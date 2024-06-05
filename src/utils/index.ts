export const IS_EDGE = navigator.userAgent.includes('Edg');
export const IS_FIREFOX = navigator.userAgent.includes('Firefox');
export const IS_CHROME = IS_EDGE === false && IS_FIREFOX === false;

export const generateProjectFromDevSites = (url: string): string | null => {
  const githubHosts = ['github.com', 'github.dev'];
  const newUrl = new URL(url);
  for (const githubHost of githubHosts) {
    if (newUrl.hostname == githubHost) {
      return newUrl.pathname.split('/')[2] || null;
    }
  }
  return null;
};
