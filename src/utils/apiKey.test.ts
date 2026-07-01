import apiKeyInvalid from './apiKey';

describe('apiKeyInvalid', () => {
  it('points users directly to the API key settings page', () => {
    expect(apiKeyInvalid('not-a-key')).toBe(
      'Invalid API key. Copy your key from https://wakatime.com/settings/api-key',
    );
  });

  it('accepts WakaTime API keys with or without waka_ prefix', () => {
    const uuidKey = '12345678-1234-4123-8123-123456789abc';

    expect(apiKeyInvalid(uuidKey)).toBe('');
    expect(apiKeyInvalid(`waka_${uuidKey}`)).toBe('');
  });
});
