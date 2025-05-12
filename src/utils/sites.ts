import { Category, EntityType } from '../types/heartbeats';
import {
  HeartbeatParser,
  KnownSite,
  OptionalHeartbeat,
  SiteParser,
  StackExchangeSite,
} from '../types/sites';
import { STACKEXCHANGE_SITES } from './stackexchange-sites';

const githubLanguage = (): string | undefined => {
  const embedData = document.querySelector(
    'script[data-target="react-app.embeddedData"]',
  )?.textContent;
  if (embedData) {
    try {
      const data = JSON.parse(embedData) as { payload?: { blob?: { language?: string } } };
      if (data.payload?.blob?.language) return data.payload.blob.language;
    } catch (e: unknown) {
      console.error('Failed to parse GitHub language', e);
    }
  }

  const files = Array.from(
    document.querySelectorAll('div[data-details-container-group="file"]').values(),
  );

  const languages = files
    .sort((a, b) => {
      const aSize =
        a
          .querySelector('.file-info')
          ?.querySelector('.sr-only')
          ?.textContent?.trim()
          .split(':')[1]
          .trim()
          .split(' ')[0]
          .replace(',', '')
          .replace('.', '')
          .replace('k', '000')
          .replace('M', '000000') ?? 0;
      const bSize =
        b
          .querySelector('.file-info')
          ?.querySelector('.sr-only')
          ?.textContent?.trim()
          .split(':')[1]
          .trim()
          .split(' ')[0]
          .replace(',', '')
          .replace('.', '')
          .replace('k', '000')
          .replace('M', '000000') ?? 0;
      return Number(bSize) - Number(aSize);
    })
    .map((div) => div.getAttribute('data-tagsearch-lang'))
    .filter(Boolean) as string[];

  return languages[0];
};

const GitHub: HeartbeatParser = (url: string) => {
  const { hostname } = new URL(url);
  const match = url.match(/(?<=github\.(?:com|dev)\/[^/]+\/)([^/?#]+)/);
  if (!match) return;

  if (hostname.endsWith('.dev')) {
    return {
      language: '<<LAST_LANGUAGE>>',
      project: match[0],
    };
  }

  const repo = document
    .querySelector('meta[name=octolytics-dimension-repository_nwo]')
    ?.getAttribute('content');
  if (repo?.split('/')[1] !== match[0]) {
    return {
      language: '<<LAST_LANGUAGE>>',
    };
  }

  // TODO: parse language associated with this repo from the DOM
  // TODO: parse branch associated with the PR url from the DOM

  const re = new RegExp(/github.com\/[^/]+\/[^/]+\/pull\/\d+\/files/);
  const category: Category | undefined = re.test(url) ? Category.code_reviewing : undefined;

  return {
    category,
    language: githubLanguage() ?? '<<LAST_LANGUAGE>>',
    project: match[0],
  };
};

const GitLab: HeartbeatParser = (url: string) => {
  const match = url.match(/([^/]+)(?:\/-\/|\/?$)/);
  if (!match) return;

  const urlRepo = match[1];
  const repoName = document.querySelector('body')?.getAttribute('data-project-full-path');
  const isValidPath = repoName?.split('/').pop() === urlRepo;
  if (!isValidPath) {
    return {
      language: '<<LAST_LANGUAGE>>',
    };
  }

  return {
    language: '<<LAST_LANGUAGE>>',
    project: urlRepo,
  };
};

const BitBucket: HeartbeatParser = (url: string) => {
  const match = url.match(/(?<=bitbucket\.org\/[^/]+\/)([^/?#]+)/);
  if (!match) return;

  // this regex extracts the project name from the title
  // eg. title: jhondoe / my-test-repo — Bitbucket
  const match2 = document.querySelector('title')?.textContent?.match(/(?<=\/\s)([^/\s]+)(?=\s—)/);
  if (!match2 || match2[0] !== match[0]) {
    return {
      language: '<<LAST_LANGUAGE>>',
    };
  }

  return {
    language: '<<LAST_LANGUAGE>>',
    project: match[0],
  };
};

const TravisCI: HeartbeatParser = (url: string) => {
  const match = url.match(/(?<=app\.travis-ci\.com\/[^/]+\/[^/]+\/)([^/?#]+)/);
  if (!match) return;

  const projectName = document.querySelector('#ember737')?.textContent;
  if (projectName !== match[0]) {
    return {
      language: '<<LAST_LANGUAGE>>',
    };
  }

  return {
    language: '<<LAST_LANGUAGE>>',
    project: match[0],
  };
};

const CircleCI: HeartbeatParser = (url: string) => {
  const projectPageMatch = url.match(
    /(?<=app\.circleci\.com\/projects\/[^/]+\/[^/]+\/[^/]+\/)([^/?#]+)/,
  );

  if (projectPageMatch) {
    const seconndBreadcrumbLabel = document.querySelector(
      '#__next > div:nth-child(2) > div > div > main > div > header > div:nth-child(1) > ol > li:nth-child(2) > div > div > span',
    )?.textContent;
    const seconndBreadcrumbValue = document.querySelector(
      '#__next > div:nth-child(2) > div > div > main > div > header > div:nth-child(1) > ol > li:nth-child(2) > div > span',
    )?.textContent;
    if (seconndBreadcrumbLabel === 'Project' && seconndBreadcrumbValue === projectPageMatch[0]) {
      return {
        language: '<<LAST_LANGUAGE>>',
        project: projectPageMatch[0],
      };
    }
  }

  const settingsPageMatch = url.match(
    /(?<=app\.circleci\.com\/settings\/project\/[^/]+\/[^/]+\/)([^/?#]+)/,
  );
  if (settingsPageMatch) {
    const pageTitle = document.querySelector(
      '#__next > div > div:nth-child(1) > header > div > div:nth-child(2) > h1',
    )?.textContent;
    const pageSubtitle = document.querySelector(
      '#__next > div > div:nth-child(1) > header > div > div:nth-child(2) > div',
    )?.textContent;
    if (pageTitle === 'Project Settings' && pageSubtitle === settingsPageMatch[0]) {
      return {
        language: '<<LAST_LANGUAGE>>',
        project: settingsPageMatch[0],
      };
    }
  }

  return {
    language: '<<LAST_LANGUAGE>>',
  };
};

const Vercel: HeartbeatParser = (url: string) => {
  const match = url.match(/(?<=vercel\.com\/[^/]+\/)([^/?#]+)/);
  if (!match) return;

  // this regex extracts the project name from the title
  // eg. title: test-website - Overview – Vercel
  const match2 = document.querySelector('title')?.textContent?.match(/^[^\s]+(?=\s-\s)/);
  if (!match2 || match2[0] !== match[0]) {
    return {
      language: '<<LAST_LANGUAGE>>',
    };
  }

  return {
    language: '<<LAST_LANGUAGE>>',
    project: match[0],
  };
};

const StackOverflow: HeartbeatParser = (_url: string) => {
  const tags = Array.from(document.querySelectorAll('.post-tag').values())
    .map((el) => el.textContent)
    .filter(Boolean) as string[];
  if (tags.length === 0) {
    return {
      language: '<<LAST_LANGUAGE>>',
    };
  }

  const languages = Array.from(document.querySelectorAll('code[data-highlighted="yes"]').values())
    .map((code) => {
      const cls = Array.from(code.classList.values()).find((c) => c.startsWith('language-'));
      return cls?.substring('language-'.length);
    })
    .filter(Boolean) as string[];

  for (const lang of languages) {
    if (tags.includes(lang)) {
      return { language: lang };
    }
  }

  return {
    language: '<<LAST_LANGUAGE>>',
  };
};

const Canva: HeartbeatParser = (_url: string): OptionalHeartbeat | undefined => {
  const projectName = (document.head.querySelector('meta[property="og:title"]') as HTMLMetaElement)
    .content;
  if (!projectName) return;

  // make sure the page title matches the design input element's value, meaning this is a design file
  const canvaProjectInput = Array.from(
    document.querySelector('nav')?.querySelectorAll('input').values() ?? [],
  ).find((inp) => inp.value === projectName);
  if (!canvaProjectInput) return;

  return {
    category: Category.designing,
    language: 'Image (svg)',
    plugin: 'Canva',
    project: projectName,
  };
};

const Figma: HeartbeatParser = (_url: string): OptionalHeartbeat | undefined => {
  const figmaProject = document.getElementsByClassName('gpu-view-content');
  if (figmaProject.length === 0) return;

  const project = (document.querySelector('span[data-testid="filename"]') as HTMLElement).innerText;
  return {
    category: Category.designing,
    language: 'Image (svg)',
    plugin: 'Figma',
    project,
  };
};

const GoogleMeet: HeartbeatParser = (_url: string): OptionalHeartbeat | undefined => {
  const meetId = document.querySelector('[data-meeting-title]')?.getAttribute('data-meeting-title');
  if (!meetId) return;

  return {
    category: Category.meeting,
    plugin: 'Google Meet',
    project: meetId,
  };
};

const MicrosoftTeams: HeartbeatParser = (_url: string): OptionalHeartbeat | undefined => {
  const leaveButton = document.querySelector('#hangup-button');
  if (!leaveButton) return;

  const title = document.querySelector('title')?.innerText;
  if (!title) return;

  const meetingTitle = title.split(' | ')[1];
  if (!meetingTitle.trim()) return;

  return {
    category: Category.meeting,
    plugin: 'Microsoft Teams',
    project: meetingTitle.trim(),
  };
};

const Slack: HeartbeatParser = (_url: string): OptionalHeartbeat | undefined => {
  const title = document.querySelector('title')?.textContent?.split(' - ');
  if (!title || title.length < 3 || title[-1] !== 'Slack') {
    return {
      category: Category.communicating,
      plugin: 'Slack',
    };
  }

  const entity = title[0];
  const project = title[1];

  return {
    category: Category.communicating,
    entity,
    entityType: EntityType.app,
    plugin: 'Slack',
    project,
  };
};

const Zoom: HeartbeatParser = (_url: string): OptionalHeartbeat | undefined => {
  const entity = document.querySelector('title')?.textContent;

  return {
    category: Category.communicating,
    entity: entity ?? undefined,
    entityType: entity ? EntityType.app : undefined,
    plugin: 'Zoom',
  };
};

const _normalizeUrl = (url?: string | null) => {
  if (!url) {
    return '';
  }
  if (url.startsWith('http://')) {
    url = url.substring('http://'.length);
  }
  if (url.startsWith('https://')) {
    url = url.substring('https://'.length);
  }
  if (url.startsWith('www.')) {
    url = url.substring('www.'.length);
  }
  if (url.endsWith('/')) {
    url = url.substring(0, url.length - 1);
  }
  return url;
};

const stackExchangeDomains = (STACKEXCHANGE_SITES as StackExchangeSite[]).map((site) => {
  return _normalizeUrl(site.site_url);
});

const SITES: Record<KnownSite, SiteParser> = {
  bitbucket: {
    parser: BitBucket,
    urls: [/^https?:\/\/(.+\.)?bitbucket.org\//],
  },
  canva: {
    parser: Canva,
    urls: ['canva.com'],
  },
  circleci: {
    parser: CircleCI,
    urls: [/^https?:\/\/(.+\.)?circleci.com\//],
  },
  figma: {
    parser: Figma,
    urls: ['figma.com'],
  },
  github: {
    parser: GitHub,
    urls: [
      /^https?:\/\/(.+\.)?github.com\//,
      /^https?:\/\/(.+\.)?github.dev\//,
      /^https?:\/\/(.+\.)?github.blog\//,
      /^https?:\/\/(.+\.)?github.io\//,
      /^https?:\/\/(.+\.)?github.community\//,
      // /^https?:\/\/(.+\.)?ghcr.io\//,
      // /^https?:\/\/(.+\.)?githubapp.com\//,
      // /^https?:\/\/(.+\.)?githubassets.com\//,
      // /^https?:\/\/(.+\.)?githubusercontent.com\//,
      // /^https?:\/\/(.+\.)?githubnext.com\//,
    ],
  },
  gitlab: {
    parser: GitLab,
    urls: [/^https?:\/\/(.+\.)?gitlab.[\w.]+\//],
  },
  googlemeet: {
    parser: GoogleMeet,
    trackWithoutMouseMoving: true,
    urls: [/^https?:\/\/meet.google.com\//],
  },
  msteams: {
    parser: MicrosoftTeams,
    trackWithoutMouseMoving: true,
    urls: [/^https:\/\/teams.live.com\/v2\//, /^https:\/\/teams.microsoft.com\/v1\//],
  },
  slack: {
    parser: Slack,
    urls: [/^https:\/\/app.slack.com\/client\//],
  },
  stackoverflow: {
    parser: StackOverflow,
    urls: stackExchangeDomains,
  },
  travisci: {
    parser: TravisCI,
    urls: [/^https?:\/\/(.+\.)?travis-ci.com\//],
  },
  vercel: {
    parser: Vercel,
    urls: [/^https?:\/\/(.+\.)?vercel.com\//],
  },
  zoom: {
    parser: Zoom,
    trackWithoutMouseMoving: true,
    urls: [/^https:\/\/(.+\.)?zoom.us\/[^?]+\/join/],
  },
};

const match = (url: string, pattern: RegExp | string): boolean => {
  if (typeof pattern === 'string') {
    return _normalizeUrl(url).startsWith(_normalizeUrl(pattern));
  }
  return pattern.test(url);
};

export const getSite = (url: string): SiteParser | undefined => {
  return Object.values(SITES).find((site) => {
    return site.urls.some((re) => match(url, re));
  });
};
