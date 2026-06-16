import { Category } from '../types/heartbeats';
import { getSite } from './sites';

const parseGoogleMeet = (url = 'https://meet.google.com/abc-defg-hij') => {
  return getSite(url)?.parser(url);
};

describe('site parsers', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    document.title = '';
  });

  describe('Google Meet', () => {
    it('uses the existing data-meeting-title attribute when available', () => {
      document.body.innerHTML = '<div data-meeting-title="Team sync"></div>';

      expect(parseGoogleMeet()).toEqual({
        category: Category.meeting,
        plugin: 'Google Meet',
        project: 'Team sync',
      });
    });

    it('falls back to the document title when active call controls are present', () => {
      document.title = 'Design review - Google Meet';
      document.body.innerHTML = '<button aria-label="Leave call"></button>';

      expect(parseGoogleMeet()).toEqual({
        category: Category.meeting,
        plugin: 'Google Meet',
        project: 'Design review',
      });
    });

    it('falls back to the meeting code for active calls without a usable title', () => {
      document.title = 'Google Meet';
      document.body.innerHTML = '<button data-is-muted="false"></button>';

      expect(parseGoogleMeet()).toEqual({
        category: Category.meeting,
        plugin: 'Google Meet',
        project: 'abc-defg-hij',
      });
    });

    it('reads the meeting code from the active call heading before using the url', () => {
      document.title = 'Google Meet';
      document.body.innerHTML = `
        <div id="browser-extension-center-buttons"></div>
        <div role="heading" aria-level="1">
          <div>
            <span>
              <div>awy-tjek-hxe</div>
            </span>
          </div>
        </div>
      `;

      expect(parseGoogleMeet('https://meet.google.com/landing')).toEqual({
        category: Category.meeting,
        plugin: 'Google Meet',
        project: 'awy-tjek-hxe',
      });
    });

    it('does not track generic Meet pages without active call signals', () => {
      expect(parseGoogleMeet('https://meet.google.com/')).toBeUndefined();
    });
  });
});
