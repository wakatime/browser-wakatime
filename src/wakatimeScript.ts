import WakaTimeCore from './core/WakaTimeCore';

const twoMinutes = 120000;

interface DesignProject {
  category: string;
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
    category: 'Designing',
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
    category: 'Designing',
    editor: 'Figma',
    language: 'Figma Design',
    project: projectName,
  };
};

const getParser: {
  [key: string]:
    | (() => { editor: string; language: string; project: string } | undefined)
    | undefined;
} = {
  'www.canva.com': parseCanva,
  'www.figma.com': parseFigma,
};

const init = async () => {
  const { hostname } = document.location;

  const projectDetails = getParser[hostname]?.();

  if (projectDetails) {
    await WakaTimeCore.recordHeartbeat(projectDetails);
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
