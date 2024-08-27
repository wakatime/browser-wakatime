import { getSite } from './utils/heartbeat';

const oneMinute = 60000;
const fiveMinutes = 300000;

interface DesignProject {
  category: string;
  editor: string;
  language: string;
  project: string;
}

const parseCanva = (): DesignProject | undefined => {
  const projectName = (document.head.querySelector('meta[property="og:title"]') as HTMLMetaElement)
    .content;
  if (!projectName) return;

  // make sure the page title matches the design input element's value, meaning this is a design file
  const canvaProjectInput = Array.from(
    document.querySelector('nav')?.querySelectorAll('input') ?? [],
  ).find((inp) => inp.value === projectName);
  if (!canvaProjectInput) return;

  return {
    category: 'designing',
    editor: 'Canva',
    language: 'Canva Design',
    project: projectName,
  };
};

const parseFigma = (): DesignProject | undefined => {
  const figmaProject = document.getElementsByClassName('gpu-view-content');
  if (figmaProject.length === 0) return;

  const projectName = (document.querySelector('span[data-testid="filename"]') as HTMLElement)
    .innerText;
  return {
    category: 'designing',
    editor: 'Figma',
    language: 'Figma Design',
    project: projectName,
  };
};

const parseMeet = (): DesignProject | undefined => {
  const meetId = document.querySelector('[data-meeting-title]')?.getAttribute('data-meeting-title');
  if (!meetId) {
    return;
  }
  return {
    category: 'meeting',
    editor: 'Meet',
    language: 'Google Meet',
    project: meetId,
  };
};

/**
 * Debounces the execution of a function.
 *
 * @param {() => void} func - The function to debounce.
 * @param {number} [timeout] - The timeout for the debounce in milliseconds.
 * @param {number} [maxWaitTime] - The max time to debounce before forcing execution in milliseconds.
 * @returns {() => void} The debounced function.
 */
function debounce(func: () => void, timeout = oneMinute, maxWaitTime = fiveMinutes) {
  let timer: NodeJS.Timeout | undefined;
  let lastExecutionTime: number | undefined;
  return (...args: unknown[]) => {
    clearTimeout(timer);
    if (lastExecutionTime && lastExecutionTime + maxWaitTime < Date.now()) {
      lastExecutionTime = Date.now();
      func(...(args as []));
    }
    timer = setTimeout(() => {
      lastExecutionTime = Date.now();
      func(...(args as []));
    }, timeout);
  };
}

const sendHeartbeat = debounce(async () => {
  chrome.runtime.sendMessage({ task: 'handleActivity' });
});

chrome.runtime.onMessage.addListener(
  (request: { task: string; url: string }, sender, sendResponse) => {
    if (request.task === 'getHeartbeatFromPage') {
      const site = getSite(request.url);
      if (!site) {
        sendResponse({ heartbeat: undefined });
        return;
      }

      sendResponse({ heartbeat: site.parser(request.url) });
    }
  },
);

document.body.addEventListener('click', sendHeartbeat, true);

document.body.addEventListener('keypress', sendHeartbeat, true);

const checkIfInAMeeting = () => {
  const isActiveMeeting = !!document.querySelector('[data-meeting-title]');
  if (isActiveMeeting) {
    sendHeartbeat();
  }

  setTimeout(checkIfInAMeeting, oneMinute);
};

// Google Meet
if (window.location.href.startsWith('https://meet.google.com')) {
  checkIfInAMeeting();
}
