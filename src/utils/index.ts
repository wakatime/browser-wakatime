export const IS_EDGE = navigator.userAgent.includes('Edg');
export const IS_FIREFOX = navigator.userAgent.includes('Firefox');
export const IS_CHROME = IS_EDGE === false && IS_FIREFOX === false;

const REG_LIST = [
  // GitHub. Eg. URL: https://github.com/workspace-name/project-name
  /(?<=github\.(?:com|dev)\/[^/]+\/)([^/?#]+)/,
  // Gitlab. Eg. URL: https://gitlab.com/workspace-name/project-name
  /(?<=gitlab\.com\/[^/]+\/)([^/?#]+)/,
  // BitBucket. Eg. URL: https://bitbucket.org/workspace-name/project-name/src
  /(?<=bitbucket\.org\/[^/]+\/)([^/?#]+)/,
  // Travis CI. Eg. URL: https://app.travis-ci.com/github/workspace-name/project-name/no-build?serverType=git
  /(?<=app\.travis-ci\.com\/[^/]+\/[^/]+\/)([^/?#]+)/,
  // Circle CI. Eg. URL: https://app.circleci.com/projects/project-setup/github/workspace-name/project-name/
  /(?<=app\.circleci\.com\/projects\/[^/]+\/[^/]+\/[^/]+\/)([^/?#]+)/,
  // Vercel. Eg. URL: http://vercel.com/team-name/project-name
  /(?<=vercel\.com\/[^/]+\/)([^/?#]+)/,
];

export const generateProjectFromDevSites = (url: string): string | null => {
  let match: RegExpMatchArray | null = null;

  for (const reg of REG_LIST) {
    match = url.match(reg);
    if (match) {
      break;
    }
  }

  return match?.[0] ?? null;
};
