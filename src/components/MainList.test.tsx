import React from 'react';
import { Browser } from 'webextension-polyfill';
import { renderWithProviders } from '../utils/test-utils';
import MainList from './MainList';

jest.mock<typeof import('webextension-polyfill')>('webextension-polyfill', () => {
  return {
    runtime: {
      getManifest: () => ({
        version: 'test-version',
      }),
    },
  } as Browser;
});

describe('MainList', () => {
  let loggingEnabled: boolean, totalTimeLoggedToday: string;
  beforeEach(() => {
    loggingEnabled = false;
    totalTimeLoggedToday = '1/1/1999';
  });
  it('should render properly', () => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const { container } = renderWithProviders(
      <MainList
        isDomainIgnored={false}
        loggingEnabled={loggingEnabled}
        totalTimeLoggedToday={totalTimeLoggedToday}
        currentTabUrl={''}
      />,
    );
    expect(container).toMatchInlineSnapshot(`
      <div>
        <div>
          <div
            class="placeholder-glow"
          >
            <span
              class="placeholder col-12"
            />
          </div>
          <div
            class="placeholder-glow"
          >
            <span
              class="placeholder col-12"
            />
          </div>
          <div
            class="list-group my-3"
          >
            <a
              class="list-group-item text-body-secondary"
              href="#"
            >
              <i
                class="fa fa-fw fa-cogs me-2"
              />
              Options
            </a>
          </div>
          <div
            class="placeholder-glow"
          >
            <span
              class="placeholder col-12"
            />
          </div>
          <div
            class="placeholder-glow"
          >
            <span
              class="placeholder col-12"
            />
          </div>
        </div>
      </div>
    `);
  });
});
