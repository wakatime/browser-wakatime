export const IS_EDGE = navigator.userAgent.includes('Edg');
export const IS_FIREFOX = navigator.userAgent.includes('Firefox');
export const IS_YANDEX = navigator.userAgent.includes('YaBrowser');
export const IS_OPERA = navigator.userAgent.includes('OPR');
export const IS_CHROME = !IS_EDGE && !IS_FIREFOX;

export const getOperatingSystem = (): Promise<string> => {
  return new Promise((resolve) => {
    chrome.runtime.getPlatformInfo((info) => {
      resolve(`${info.os}_${info.arch}`);
    });
  });
};
