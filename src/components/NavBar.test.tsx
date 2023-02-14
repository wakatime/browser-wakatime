import React from 'react';
import { renderWithProviders } from '../utils/test-utils';
import NavBar from './NavBar';

jest.mock('webextension-polyfill', () => {
  return {
    runtime: {
      getManifest: () => {
        return { version: 'test-version' };
      },
    },
  };
});

describe('NavBar', () => {
  it('should render properly', () => {
    const { container } = renderWithProviders(<NavBar />);
    expect(container).toMatchInlineSnapshot(`
      <div>
        <nav
          class="navbar navbar-default"
          role="navigation"
        >
          <div
            class="container-fluid"
          >
            <div
              class="navbar-header"
            >
              <a
                class="navbar-brand"
                href="https://wakatime.com"
                rel="noreferrer"
                target="_blank"
              >
                WakaTime
                <img
                  src="graphics/wakatime-logo-48.png"
                />
              </a>
              <button
                aria-controls="bs-example-navbar-collapse-1"
                aria-expanded="false"
                aria-label="Toggle navigation"
                class="navbar-toggler"
                data-bs-target="#bs-example-navbar-collapse-1"
                data-bs-toggle="collapse"
                type="button"
              >
                <span
                  class="sr-only"
                >
                  Toggle navigation
                </span>
                <i
                  class="fa fa-fw fa-cogs"
                />
              </button>
            </div>
            <br />
            <div
              class="collapse navbar-collapse"
              id="bs-example-navbar-collapse-1"
            >
              <div />
              <ul
                class="nav navbar-nav"
              >
                <div />
                <div />
                <li
                  class="dropdown"
                >
                  <a
                    aria-expanded="false"
                    class="dropdown-toggle"
                    data-toggle="dropdown"
                    href="#"
                    role="button"
                  >
                    <i
                      class="fa fa-fw fa-info"
                    />
                    About
                    <span
                      class="caret"
                    />
                  </a>
                  <ul
                    class="dropdown-menu"
                    role="menu"
                  >
                    <li>
                      <a
                        href="https://github.com/wakatime/chrome-wakatime/issues"
                        rel="noreferrer"
                        target="_blank"
                      >
                        <i
                          class="fa fa-fw fa-bug"
                        />
                        Report an Issue
                      </a>
                    </li>
                    <li>
                      <a
                        href="https://github.com/wakatime/chrome-wakatime"
                        rel="noreferrer"
                        target="_blank"
                      >
                        <i
                          class="fa fa-fw fa-github"
                        />
                        View on GitHub
                      </a>
                    </li>
                  </ul>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </div>
    `);
  });
});
