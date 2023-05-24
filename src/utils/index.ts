export const IS_EDGE = navigator.userAgent.includes('Edg');
export const IS_FIREFOX = navigator.userAgent.includes('Firefox');
export const IS_CHROME = IS_EDGE === false && IS_FIREFOX === false;

export const generateProjectFromDevSites = (url: string): string | null => {
  const githubUrls = ['https://github.com/', 'https://github.dev/'];
  for (const githubUrl of githubUrls) {
    if (url.startsWith(githubUrl)) {
      const newUrl = url.replace(githubUrl, '');
      return newUrl.split('/')[1] || null;
    }
  }
  return null;
};
