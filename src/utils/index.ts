export const IS_EDGE = navigator.userAgent.includes('Edg');
export const IS_FIREFOX = navigator.userAgent.includes('Firefox');
export const IS_CHROME = IS_EDGE === false && IS_FIREFOX === false;

export const generateProjectFromDevSites = (siteUrl: string): string | null => {
  const url = new URL(siteUrl);

  // Github
  const githubHosts = ['github.com', 'github.dev'];
  for (const host of githubHosts) {
    if (url.host === host) {
      // input: https://github.com/wakatime/browser-wakatime?tab=readme-ov-file#development-instructions
      // output: browser-wakatime
      return url.pathname.split('/')[2] || null;
    }
  }

  // Gitlab
  const gitlabHosts = ['gitlab.com'];
  for (const host of gitlabHosts) {
    if (url.host === host) {
      // input: https://gitlab.com/wakatime/browser-wakatime?tab=readme-ov-file#development-instructions
      // output: browser-wakatime
      return url.pathname.split('/')[2] || null;
    }
  }

  return null;
};
