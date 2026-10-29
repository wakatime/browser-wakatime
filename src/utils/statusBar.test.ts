/* eslint-disable jest/unbound-method -- These methods are Jest mocks. */
import axios from 'axios';
import browser, { Browser } from 'webextension-polyfill';
import { fetchStatusBarToday } from './statusBar';

jest.mock('axios');
jest.mock<typeof import('webextension-polyfill')>(
  'webextension-polyfill',
  () =>
    ({
      runtime: { getManifest: () => ({ version: 'test-version' }) },
      storage: { sync: { get: jest.fn() } },
    }) as unknown as Browser,
);

describe('plugin status bar API', () => {
  beforeEach(() => {
    jest.mocked(browser.storage.sync.get).mockImplementation(async (defaults) => ({
      ...(defaults as Record<string, unknown>),
      apiUrl: 'https://example.com/api/v1',
      currentUserApiEndPoint: '/users/current',
      summariesApiEndPoint: '/users/current/summaries',
    }));
  });

  it('uses the plugin endpoint despite legacy stored endpoints and reads its object payload', async () => {
    const data = {
      grand_total: {
        digital: '1:23',
        hours: 1,
        minutes: 23,
        text: '1 hr 23 mins',
        total_seconds: 4980,
      },
    };
    jest.mocked(axios.get).mockResolvedValue({ data: { data } });

    await expect(fetchStatusBarToday('test-api-key')).resolves.toEqual(data);
    expect(axios.get).toHaveBeenCalledWith(
      'https://example.com/api/v1/users/current/statusbar/today',
      { params: { api_key: 'test-api-key' } },
    );
  });

  it('propagates authentication failures', async () => {
    jest.mocked(axios.get).mockRejectedValue(new Error('Unauthorized'));
    await expect(fetchStatusBarToday('invalid-key')).rejects.toThrow('Unauthorized');
  });
});
