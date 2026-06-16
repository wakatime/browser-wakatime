import React, { useCallback, useRef } from 'react';
import { YaBrowserSpaceNameMatch } from '../utils/settings';

type Props = {
  onChange: (value: YaBrowserSpaceNameMatch) => void;
  value: YaBrowserSpaceNameMatch;
};

export default function YaBrowserSpaceNameMatchList({ value, onChange }: Props): JSX.Element {
  const tabsCountGrouped = useRef<Record<string, number | undefined>>({});

  const handleAdd = useCallback(async () => {
    tabsCountGrouped.current = (await chrome.tabs.query({})).reduce<Record<string, number>>(
      (p, c) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
        const spaceId = (c as any).spaceId as string;
        p[spaceId] = (p[spaceId] ?? 0) + 1;
        return p;
      },
      {},
    );
    const existingMatches = new Set(Object.keys(value));
    let foundSpaceId: string | undefined;
    for (const e of Object.entries(tabsCountGrouped.current)) {
      if (!existingMatches.has(e[0])) {
        foundSpaceId = e[0];
        break;
      }
    }

    if (foundSpaceId == undefined) return;
    const updated = {
      ...value,
      [foundSpaceId]: '',
    };

    onChange(updated);
  }, [onChange, value]);

  const handleRemove = useCallback(
    (spaceId: string) => {
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete value[spaceId];
      onChange(value);
    },
    [onChange, value],
  );

  const handleGroupNameChange = useCallback(
    (spaceId: string, val: string) => {
      value[spaceId] = val.trim();

      onChange(value);
    },
    [onChange, value],
  );

  return (
    <div className="form-group mb-4 d-flex flex-column gap-3">
      <span style={{ fontSize: '12px' }} className="text-secondary">
        <div>
          By default in Yandex Browser groups(spaces) feature is disabled, because there is no way
          programmatically to distinct grouped tabs from ungrouped. All of them are grouped. Also
          there is no API for getting the group(space) name. This is why this form exists. If you
          want to use the groups features(use group name as project name and/or log only grouped
          tabs) you need to do some extra steps: you need to mannualy match the group(space) id to a
          readable name(that will be used as Project name).
        </div>
        <div>Here is how it works:</div>
        <div>{'1. Press the "Search for spaces(tab groups)" button.'}</div>
        <div>
          2. You will see a space(group) id, provided by Yandex Browser API. Also you will see a
          caption saying how many tabs are in the group with this space id. This is how you can make
          an assumption about which group this id belongs to.
        </div>
        <div>
          {'3. Now, when you know what space(group) the space id you are seeing belongs to, '}
          {'you can give a name to this space(create a match). '}
          {
            'Also do not forget to toggle the "Use tab\'s group name as project name" checkbox for this feature to work'
          }
        </div>
        <div>{'4. Press "Save"'}</div>
        <div>
          Now you are all set! The activity will be logged using the provided space(group) name as
          Project name!
        </div>
      </span>
      <label style={{ fontSize: '14px' }} className="control-label">
        {'Yandex Browser spaceId to name match'}
      </label>
      {Object.keys(value).length > 0 ? (
        <div className="d-flex flex-column gap-2">
          {Object.entries(value).map((row, i) => (
            <div key={i} className="d-flex gap-2 align-items-center">
              <div className="flex-fill">
                <label style={{ fontSize: '12px' }} className="form-label" htmlFor={`spaceId-${i}`}>
                  {tabsCountGrouped.current[row[0]] == undefined
                    ? ''
                    : `${tabsCountGrouped.current[row[0]]} tabs in the space with id:`}
                </label>
                <input
                  id={`spaceId-${i}`}
                  disabled={true}
                  placeholder={'spaceId'}
                  className="form-control"
                  value={row[0]}
                />
              </div>
              <div className="flex-fill">
                <label
                  style={{ fontSize: '12px' }}
                  className="form-label"
                  htmlFor={`groupName-${i}`}
                >
                  {tabsCountGrouped.current[row[0]] == undefined || (row[1] ?? '') !== ''
                    ? ''
                    : `Enter a name for the tab containing ${tabsCountGrouped.current[row[0]]} tabs`}
                </label>
                <input
                  id={`groupName-${i}`}
                  placeholder={'Group Name'}
                  className="form-control"
                  value={row[1] ?? ''}
                  onChange={(e) => handleGroupNameChange(row[0], e.target.value)}
                />
              </div>

              <button
                type="button"
                className="btn btn-sm btn-default ms-2"
                onClick={() => handleRemove(row[0])}
              >
                <i className="fa fa-fw fa-times" />
              </button>
            </div>
          ))}
        </div>
      ) : null}
      <button type="button" onClick={handleAdd} className="btn btn-default col-12 flex-fill">
        Search for spaces(tab groups)
      </button>
    </div>
  );
}
