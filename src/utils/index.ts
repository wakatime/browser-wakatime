export const IS_EDGE = navigator.userAgent.includes('Edg');
export const IS_FIREFOX = navigator.userAgent.includes('Firefox');
export const IS_CHROME = IS_EDGE === false && IS_FIREFOX === false;

export const generateProjectFromDevSites = (siteUrl: string): string | null => {
  const url = new URL(siteUrl);

  // Github
  // Example URL: https://github.com/wakatime/browser-wakatime?tab=readme-ov-file#development-instructions
  const githubHosts = ['github.com', 'github.dev'];
  for (const host of githubHosts) {
    if (url.host === host) {
      return url.pathname.split('/')[2] || null;
    }
  }

  // Gitlab
  // Example URL: https://gitlab.com/wakatime/browser-wakatime?tab=readme-ov-file#development-instructions
  const gitlabHosts = ['gitlab.com'];
  for (const host of gitlabHosts) {
    if (url.host === host) {
      return url.pathname.split('/')[2] || null;
    }
  }

  // BitBucket
  // Example URL: https://bitbucket.org/rohidul209/my-test-repo/src
  const bitbucketHosts = ['bitbucket.org'];
  for (const host of bitbucketHosts) {
    if (url.host === host) {
      return url.pathname.split('/')[2] || null;
    }
  }

  // Travis CI
  // Example URL: https://app.travis-ci.com/github/iam-rohid/ai-expense-tracker/no-build?serverType=git
  const travisHosts = ['app.travis-ci.com'];
  for (const host of travisHosts) {
    if (url.host === host) {
      return url.pathname.split('/')[3] || null;
    }
  }
  return null;
};
