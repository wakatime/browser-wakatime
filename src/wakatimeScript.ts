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

const parseJupyter = (isDemo: boolean): DesignProject | undefined => {
  const { title } = document;
  if (!title.endsWith('JupyterLab') && title != 'JupyterLite') return undefined;

  try {
    const projectName =
      document.getElementsByClassName('f1fwtl1j')[0].children[isDemo ? 0 : 1].children[0].innerHTML;

    return {
      category: 'Designing',
      editor: 'Jupyter',
      language: 'Jupyter',
      project: '<<LAST_PROJECT>>',
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
