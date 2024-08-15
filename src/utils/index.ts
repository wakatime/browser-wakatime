export const IS_EDGE = navigator.userAgent.includes('Edg');
export const IS_FIREFOX = navigator.userAgent.includes('Firefox');
export const IS_CHROME = IS_EDGE === false && IS_FIREFOX === false;

export const generateProjectFromDevSites = (siteUrl: string): string | null => {
  const url = new URL(siteUrl);
  const githubUrls = ['github.com', 'github.dev'];
  for (const githubUrl of githubUrls) {
    if (url.host === githubUrl) {
      // input: https://github.com/wakatime/browser-wakatime?tab=readme-ov-file#development-instructions
      // output: browser-wakatime
      return url.pathname.split('/')[2] || null;
    }
  }
  return null;
};
