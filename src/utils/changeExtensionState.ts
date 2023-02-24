import browser from 'webextension-polyfill';
import config, { ApiStates } from '../config/config';
import changeExtensionIcon from './changeExtensionIcon';
import changeExtensionTooltip from './changeExtensionTooltip';

/**
 * Sets the current state of the extension.
 */
export default async function changeExtensionState(state: ApiStates): Promise<void> {
  switch (state) {
    case 'allGood':
      await changeExtensionIcon(config.colors.allGood);
      await changeExtensionTooltip(config.tooltips.allGood);
      break;
    case 'notLogging':
      await changeExtensionIcon(config.colors.notLogging);
      await changeExtensionTooltip(config.tooltips.notLogging);
      break;
    case 'notSignedIn':
      await changeExtensionIcon(config.colors.notSignedIn);
      await changeExtensionTooltip(config.tooltips.notSignedIn);
      break;
    case 'blacklisted':
      await changeExtensionIcon(config.colors.notLogging);
      await changeExtensionTooltip(config.tooltips.blacklisted);
      break;
    case 'whitelisted':
      await changeExtensionIcon(config.colors.notLogging);
      await changeExtensionTooltip(config.tooltips.whitelisted);
      break;
    default:
      break;
  }
  await browser.storage.sync.set({ extensionState: state });
}
