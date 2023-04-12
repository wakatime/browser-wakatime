import moment from 'moment';
import browser from 'webextension-polyfill';
import config from './config/config';
import { SendHeartbeat } from './types/heartbeats';
import { generateProjectFromDevSites, IS_FIREFOX } from './utils';
import { getApiKey } from './utils/apiKey';
import contains from './utils/contains';
import getDomainFromUrl from './utils/getDomainFromUrl';

const twoMinutes = 120000;

/**
 * Creates an array from list using \n as delimiter
 * and checks if any element in list is contained in the url.
 * Also checks if element is assigned to a project using @@ as delimiter
 *
 * @param url
 * @param list
 * @returns {object}
 */
const getHeartbeat = (url: string, list: string) => {
  const projectIndicatorCharacters = '@@';

  const lines = list.split('\n');
  for (let i = 0; i < lines.length; i++) {
    // strip (http:// or https://) and trailing (`/` or `@@`)
    const cleanLine = lines[i]
      .trim()
      .replace(/(\/|@@)$/, '')
      .replace(/^(?:https?:\/\/)?/i, '');
    if (cleanLine === '') continue;

    const projectIndicatorIndex = cleanLine.lastIndexOf(projectIndicatorCharacters);
    const projectIndicatorExists = projectIndicatorIndex > -1;
    let projectName = null;
    let urlFromLine = cleanLine;
    if (projectIndicatorExists) {
      const start = projectIndicatorIndex + projectIndicatorCharacters.length;
      projectName = cleanLine.substring(start);
      urlFromLine = cleanLine
        .replace(cleanLine.substring(projectIndicatorIndex), '')
        .replace(/\/$/, '');
    }
    const schemaHttpExists = url.match(/^http:\/\//i);
    const schemaHttpsExists = url.match(/^https:\/\//i);
    let schema = '';
    if (schemaHttpExists) {
      schema = 'http://';
    }
    if (schemaHttpsExists) {
      schema = 'https://';
    }
    const cleanUrl = url
      .trim()
      .replace(/(\/|@@)$/, '')
      .replace(/^(?:https?:\/\/)?/i, '');
    const startsWithUrl = cleanUrl.toLowerCase().includes(urlFromLine.toLowerCase());
    if (startsWithUrl) {
      return {
        project: projectName,
        url: schema + urlFromLine,
      };
    }

    const lineRe = new RegExp(cleanLine.replace('.', '.').replace('*', '.*'));

    // If url matches the current line return true
    if (lineRe.test(url)) {
      return {
        project: null,
        url: schema + urlFromLine,
      };
    }
  }

  return {
    project: null,
    url: null,
  };
};

/**
 * Sends AJAX request with payload to the heartbeat API as JSON.
 *
 * @param payload
 * @param method
 * @returns {*}
 */
const sendPostRequestToApi = async (
  payload: Record<string, unknown>,
  apiKey = '',
  hostname = '',
): Promise<void> => {
  try {
    const items = await browser.storage.sync.get({
      apiUrl: config.apiUrl,
      heartbeatApiEndPoint: config.heartbeatApiEndPoint,
    });

    const request: RequestInit = {
      body: JSON.stringify(payload),
      credentials: 'omit',
      method: 'POST',
    };
    if (hostname) {
      request.headers = {
        'X-Machine-Name': hostname,
      };
    }
    const response = await fetch(
      `${items.apiUrl}${items.heartbeatApiEndPoint}?api_key=${apiKey}`,
      request,
    );
    await response.json();
  } catch (err: unknown) {
    console.log('Error', err);
  }
};

/**
 * Creates payload for the heartbeat and returns it as JSON.
 *
 * @param heartbeat
 * @param type
 * @param debug
 * @returns {*}
 * @private
 */
const preparePayload = (heartbeat: SendHeartbeat, type: string): Record<string, unknown> => {
  let browserName = 'chrome';
  let userAgent;
  if (IS_FIREFOX) {
    browserName = 'firefox';
    userAgent = navigator.userAgent.match(/Firefox\/\S+/g)![0];
  } else {
    userAgent = navigator.userAgent.match(/Chrome\/\S+/g)![0];
  }
  const payload: Record<string, unknown> = {
    entity: heartbeat.url,
    time: moment().format('X'),
    type: type,
    user_agent: `${userAgent} ${browserName}-wakatime/${config.version}`,
  };

  if (heartbeat.project) {
    payload.project = heartbeat.project;
  }

  return payload;
};

/**
 * Returns a promise with logging type variable.
 *
 * @returns {*}
 * @private
 */
const getLoggingType = async (): Promise<string> => {
  const items = await browser.storage.sync.get({
    loggingType: config.loggingType,
  });

  return items.loggingType;
};

/**
 * Given the heartbeat and logging type it creates a payload and
 * sends an ajax post request to the API.
 *
 * @param heartbeat
 * @param debug
 */
const sendHeartbeat = async (
  heartbeat: SendHeartbeat,
  apiKey: string,
  navigationPayload: Record<string, unknown>,
): Promise<void> => {
  let payload;

  const loggingType = await getLoggingType();
  // Get only the domain from the entity.
  // And send that in heartbeat
  if (loggingType == 'domain') {
    heartbeat.url = getDomainFromUrl(heartbeat.url);
    payload = preparePayload(heartbeat, 'domain');
    await sendPostRequestToApi({ ...payload, ...navigationPayload }, apiKey, heartbeat.hostname);
  }
  // Send entity in heartbeat
  else if (loggingType == 'url') {
    payload = preparePayload(heartbeat, 'url');
    await sendPostRequestToApi({ ...payload, ...navigationPayload }, apiKey, heartbeat.hostname);
  }
};

/**
 * Depending on various factors detects the current active tab URL or domain,
 * and sends it to WakaTime for logging.
 */
const recordHeartbeat = async (apiKey: string, payload: Record<string, unknown>): Promise<void> => {
  const items = await browser.storage.sync.get({
    blacklist: '',
    hostname: config.hostname,
    loggingEnabled: config.loggingEnabled,
    loggingStyle: config.loggingStyle,
    socialMediaSites: config.socialMediaSites,
    trackSocialMedia: config.trackSocialMedia,
    whitelist: '',
  });
  if (items.loggingEnabled === true) {
    if (!items.trackSocialMedia) {
      if (contains(document.URL, items.socialMediaSites as string)) {
        return;
      }
    }

    // Checks dev websites
    const project = generateProjectFromDevSites(document.URL);

    if (items.loggingStyle == 'blacklist') {
      if (!contains(document.URL, items.blacklist as string)) {
        await sendHeartbeat(
          {
            hostname: items.hostname as string,
            project,
            url: document.URL,
          },
          apiKey,
          payload,
        );
      } else {
        console.log(`${document.URL} is on a blacklist.`);
      }
    }

    if (items.loggingStyle == 'whitelist') {
      const heartbeat = getHeartbeat(document.URL, items.whitelist as string);
      if (heartbeat.url) {
        await sendHeartbeat(
          {
            ...heartbeat,
            hostname: items.hostname as string,
            project: heartbeat.project ?? project,
          },
          apiKey,
          payload,
        );
      } else {
        console.log(`${document.URL} is not on a whitelist.`);
      }
    }
  }
};

interface DesignProject {
  editor: string;
  language: string;
  project: string;
}

const parseCanva = (): DesignProject | undefined => {
  const canvaProject = document.getElementsByClassName('rF765A');
  if (canvaProject.length === 0) return;

  const projectName = (document.head.querySelector('meta[property="og:title"]') as HTMLMetaElement)
    .content;
  return {
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
    editor: 'Figma',
    language: 'Figma Design',
    project: projectName,
  };
};

const parseJupyter = (isDemo: boolean): DesignProject | undefined => {
  const { title } = document;
  if (!title.endsWith('JupyterLab') && title != 'JupyterLite') return undefined;

  try {
    const projectName =
      document.getElementsByClassName('f1fwtl1j')[0].children[isDemo ? 0 : 1].children[0].innerHTML;

    return {
      editor: 'Jupyter',
      language: 'Jupyter',
      project: projectName,
    };
  } catch (err: unknown) {
    console.log('Error getting Jupyter project name');
    return undefined;
  }
};

const getParser: {
  [key: string]:
    | (() => { editor: string; language: string; project: string } | undefined)
    | undefined;
} = {
  'jupyter.org': () => parseJupyter(true),
  localhost: () => parseJupyter(false),
  'www.canva.com': parseCanva,
  'www.figma.com': parseFigma,
};

const init = async () => {
  const apiKey = await getApiKey();
  if (!apiKey) return;

  const { hostname } = document.location;

  const projectDetails = getParser[hostname]?.();

  if (projectDetails) {
    await recordHeartbeat(apiKey, {
      category: 'Designing',
      ...projectDetails,
    });
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
