const twoMinutes = 120000;

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

const getParser: {
  [key: string]:
    | (() => { editor: string; language: string; project: string } | undefined)
    | undefined;
} = {
  'meet.google.com': parseMeet,
  'www.canva.com': parseCanva,
  'www.figma.com': parseFigma,
};

const init = async () => {
  const { hostname } = document.location;

  const projectDetails = getParser[hostname]?.();
  if (projectDetails) {
    chrome.runtime.sendMessage({ projectDetails, recordHeartbeat: true });
  }
};

function debounce(func: () => void, timeout = twoMinutes) {
  let timer: NodeJS.Timeout | undefined;
  return () => {
    if (timer) {
      return;
    }
    func();
    timer = setTimeout(() => {
      clearTimeout(timer);
      timer = undefined;
    }, timeout);
  };
}

document.body.addEventListener(
  'click',
  debounce(() => init()),
  true,
);

document.body.addEventListener(
  'keypress',
  debounce(() => init()),
  true,
);

chrome.runtime.onMessage.addListener((request: { message: string }, sender, sendResponse) => {
  if (request.message === 'get_html') {
    sendResponse({ html: document.documentElement.outerHTML });
  }
});

// Google Meet
// https://meet.google.com/jzf-bwrz-djk
if (window.location.href.startsWith('https://meet.google.com/')) {
  // In google meet website
  // Check every two seconds if the user is in a meeting.
  setInterval(() => {
    const inMeeting = !!document.querySelector('[data-meeting-title]');
    if (inMeeting) {
      debounce(() => init());
    }
  }, 2000);
}
