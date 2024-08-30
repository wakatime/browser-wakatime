import React, { useCallback } from 'react';
import { ProjectName } from '../utils/settings';

type Props = {
  handleChange: (sites: ProjectName[]) => void;
  helpText: string;
  label: string;
  projectNamePlaceholder?: string;
  sites: ProjectName[];
  urlPlaceholder?: string;
};

export default function CustomProjectNameList({
  handleChange,
  label,
  urlPlaceholder,
  projectNamePlaceholder,
  sites,
}: Props): JSX.Element {
  const handleAddNewSite = useCallback(() => {
    handleChange([...sites, { projectName: '', url: '' }]);
  }, [handleChange, sites]);

  const handleUrlChangeForSite = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
      handleChange(
        sites.map((item, i) => (i === index ? { ...item, url: event.target.value } : item)),
      );
    },
    [handleChange, sites],
  );

  const handleOnProjectNameChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
      handleChange(
        sites.map((item, i) => (i === index ? { ...item, projectName: event.target.value } : item)),
      );
    },
    [handleChange, sites],
  );

  const handleRemoveSite = useCallback(
    (index: number) => {
      handleChange(sites.filter((_, i) => i !== index));
    },
    [handleChange, sites],
  );

  return (
    <div className="form-group mb-4 d-flex flex-column gap-3">
      <label htmlFor={`${label}-siteList`} className="control-label">
        {label}
      </label>

      {sites.length > 0 && (
        <div className="d-flex flex-column gap-2">
          {sites.map((site, i) => (
            <div key={i} className="d-flex gap-2">
              <div className="flex-fill">
                <input
                  placeholder={urlPlaceholder ?? 'https://google.com'}
                  className="form-control"
                  value={site.url}
                  onChange={(e) => handleUrlChangeForSite(e, i)}
                />
              </div>
              <div className="flex-fill">
                <input
                  placeholder={projectNamePlaceholder ?? 'Project Name'}
                  value={site.projectName}
                  className="form-control"
                  onChange={(e) => handleOnProjectNameChange(e, i)}
                />
              </div>
              <button
                type="button"
                className="btn btn-sm btn-default"
                onClick={() => handleRemoveSite(i)}
              >
                <i className="fa fa-fw fa-times"></i>
              </button>
            </div>
          ))}
        </div>
      )}

      <button type="button" onClick={handleAddNewSite} className="btn btn-default col-12">
        <i className="fa fa-fw fa-plus me-2"></i>
        Add Project Name
      </button>
    </div>
  );
}
