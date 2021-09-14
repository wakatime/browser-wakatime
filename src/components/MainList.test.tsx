import React from 'react';
import {render} from '@testing-library/react';
import MainList from './MainList';

type onClick = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void;
describe('MainList', () => {
    let disableLogging: onClick;
    let enableLogging: onClick;
    let loggedIn: boolean;
    let loggingEnabled: boolean;
    let logoutUser: onClick;
    let totalTimeLoggedToday: string;
    beforeEach(() => {
        disableLogging = jest.fn();
        enableLogging = jest.fn();
        loggingEnabled = false;
        loggedIn = false;
        logoutUser = jest.fn();
        totalTimeLoggedToday = '1/1/1999';
    });
    it('should render properly', () => {
        const {container} = render(
            <MainList
                disableLogging={disableLogging}
                enableLogging={enableLogging}
                loggingEnabled={loggingEnabled}
                loggedIn={loggedIn}
                logoutUser={logoutUser}
                totalTimeLoggedToday={totalTimeLoggedToday}
            />,
        );
        expect(container).toMatchInlineSnapshot(`
      <div>
        <div>
          <div
            class="list-group"
          >
            <a
              class="list-group-item"
              href="#"
            >
              <i
                class="fa fa-fw fa-cogs"
              />
              Options
            </a>
            <a
              class="list-group-item"
              href="https://wakatime.com/login"
              rel="noreferrer"
              target="_blank"
            >
              <i
                class="fa fa-fw fa-sign-in"
              />
              Login
            </a>
          </div>
        </div>
      </div>
    `);
    });
});
