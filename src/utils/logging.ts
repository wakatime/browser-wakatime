import browser from 'webextension-polyfill';
import config from '../config/config';

/**
 * Returns a promise with logging type variable.
 *
 * @returns {*}
 * @private
 */
export const getLoggingType = async (): Promise<string> => {
  const items = await browser.storage.sync.get({
    loggingType: config.loggingType,
  });

  return items.loggingType;
};
