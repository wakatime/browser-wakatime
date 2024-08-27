import { parse } from 'node-html-parser';

type ProjectNameExtractor = (url: string, html: string) => string | null;

const GitHub: ProjectNameExtractor = (url: string, html: string): string | null => {
  const { hostname } = new URL(url);
  const match = url.match(/(?<=github\.(?:com|dev)\/[^/]+\/)([^/?#]+)/);

  if (match) {
    if (hostname.endsWith('.com')) {
      const root = parse(html);
      const repoName = root
        .querySelector('meta[name=octolytics-dimension-repository_nwo]')
        ?.getAttribute('content');
      if (!repoName || repoName.split('/')[1] !== match[0]) {
        return null;
      }
    }
    return match[0];
  }

  return null;
};

const GitLab: ProjectNameExtractor = (url: string, html: string): string | null => {
  const match = url.match(/(?<=gitlab\.com\/[^/]+\/)([^/?#]+)/);

  if (match) {
    const root = parse(html);
    const repoName = root.querySelector('body')?.getAttribute('data-project-full-path');
    if (!repoName || repoName.split('/')[1] !== match[0]) {
      return null;
    }
    return match[0];
  }

  return null;
};

const BitBucket: ProjectNameExtractor = (url: string, html: string): string | null => {
  const match = url.match(/(?<=bitbucket\.org\/[^/]+\/)([^/?#]+)/);

  if (match) {
    const root = parse(html);
    // this regex extracts the project name from the title
    // eg. title: jhondoe / my-test-repo — Bitbucket
    const match2 = root.querySelector('title')?.textContent.match(/(?<=\/\s)([^/\s]+)(?=\s—)/);
    if (match2 && match2[0] === match[0]) {
      return match[0];
    }
  }

  return null;
};

const TravisCI: ProjectNameExtractor = (url: string, html: string): string | null => {
  const match = url.match(/(?<=app\.travis-ci\.com\/[^/]+\/[^/]+\/)([^/?#]+)/);

  if (match) {
    const root = parse(html);
    const projectName = root.querySelector('#ember737')?.textContent;
    if (projectName === match[0]) {
      return match[0];
    }
  }

  return null;
};

const CircleCI: ProjectNameExtractor = (url: string, html: string): string | null => {
  const projectPageMatch = url.match(
    /(?<=app\.circleci\.com\/projects\/[^/]+\/[^/]+\/[^/]+\/)([^/?#]+)/,
  );

  if (projectPageMatch) {
    const root = parse(html);
    const seconndBreadcrumbLabel = root.querySelector(
      '#__next > div:nth-child(2) > div > div > main > div > header > div:nth-child(1) > ol > li:nth-child(2) > div > div > span',
    )?.textContent;
    const seconndBreadcrumbValue = root.querySelector(
      '#__next > div:nth-child(2) > div > div > main > div > header > div:nth-child(1) > ol > li:nth-child(2) > div > span',
    )?.textContent;
    if (seconndBreadcrumbLabel === 'Project' && seconndBreadcrumbValue === projectPageMatch[0]) {
      return projectPageMatch[0];
    }
  }

  const settingsPageMatch = url.match(
    /(?<=app\.circleci\.com\/settings\/project\/[^/]+\/[^/]+\/)([^/?#]+)/,
  );
  if (settingsPageMatch) {
    const root = parse(html);
    const pageTitle = root.querySelector(
      '#__next > div > div:nth-child(1) > header > div > div:nth-child(2) > h1',
    )?.textContent;
    const pageSubtitle = root.querySelector(
      '#__next > div > div:nth-child(1) > header > div > div:nth-child(2) > div',
    )?.textContent;
    if (pageTitle === 'Project Settings' && pageSubtitle === settingsPageMatch[0]) {
      return settingsPageMatch[0];
    }
  }

  return null;
};

const Vercel: ProjectNameExtractor = (url: string, html: string): string | null => {
  const match = url.match(/(?<=vercel\.com\/[^/]+\/)([^/?#]+)/);

  if (match) {
    const root = parse(html);
    // this regex extracts the project name from the title
    // eg. title: test-website - Overview – Vercel
    const match2 = root.querySelector('title')?.textContent.match(/^[^\s]+(?=\s-\s)/);
    if (match2 && match2[0] === match[0]) {
      return match[0];
    }
  }

  return null;
};

const ProjectNameExtractors: ProjectNameExtractor[] = [
  GitHub,
  GitLab,
  BitBucket,
  TravisCI,
  CircleCI,
  Vercel,
];

export const getHeartbeatFromPage = (): string | null => {
  for (const projectNameExtractor of ProjectNameExtractors) {
    const projectName = projectNameExtractor(url, html);
    if (projectName) {
      return projectName;
    }
  }
  return null;
};

const CODE_REVIEW_URL_REG_LIST = [/github.com\/[^/]+\/[^/]+\/pull\/\d+\/files/];

export const isCodeReviewing = (url: string): boolean => {
  for (const reg of CODE_REVIEW_URL_REG_LIST) {
    if (url.match(reg)) {
      return true;
    }
  }
  return false;
};

export const getHtmlContentByTabId = async (tabId: number): Promise<string> => {
  const response = (await browser.tabs.sendMessage(tabId, { message: 'get_html' })) as {
    html: string;
  };
  return response.html;
};
