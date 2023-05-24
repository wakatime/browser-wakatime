import browser from 'webextension-polyfill';
import config from '../config/config';

export default function apiKeyInvalid(key?: string): string {
  const err = 'Invalid api key... check https://wakatime.com/settings for your key';
  if (!key) return err;
  const re = new RegExp(
    '^(waka_)?[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$',
    'i',
  );
  if (!re.test(key)) return err;
  return '';
}

export async function getApiKey(): Promise<string> {
  const storage = await browser.storage.sync.get({
    apiKey: config.apiKey,
  });
  const apiKey = storage.apiKey as string;
  return apiKey;
}
