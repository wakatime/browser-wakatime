export const IS_EDGE = navigator.userAgent.includes('Edg');
export const IS_FIREFOX = navigator.userAgent.includes('Firefox');
export const IS_CHROME = IS_EDGE === false && IS_FIREFOX === false;

const CODE_REVIEW_URL_REG_LIST = [/github.com\/[^/]+\/[^/]+\/pull\/\d+\/files/];

export const isCodeReviewing = (url: string): boolean => {
  for (const reg of CODE_REVIEW_URL_REG_LIST) {
    if (url.match(reg)) {
      return true;
    }
  }
  return false;
};

export const getOperatingSystem = (): Promise<string> => {
  return new Promise((resolve) => {
    chrome.runtime.getPlatformInfo(function (info) {
      resolve(`${info.os}_${info.arch}`);
    });
  });
};
