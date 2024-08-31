import React, { useCallback } from 'react';

type Props = {
  handleChange: (sites: string[]) => void;
  helpText: string;
  label: string;
  projectNamePlaceholder?: string;
  sites: string[];
  urlPlaceholder?: string;
};

export default function SitesList({
  handleChange,
  label,
  urlPlaceholder,
  sites,
  helpText,
}: Props): JSX.Element {
  const handleAddNewSite = useCallback(() => {
    handleChange([...sites, '']);
  }, [handleChange, sites]);

  const handleUrlChangeForSite = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
      handleChange(sites.map((item, i) => (i === index ? event.target.value : item)));
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
    <div className="form-group mb-4 d-flex flex-column gap-2">
      <label htmlFor={`${label}-siteList`} className="control-label">
        {label}
      </label>

      {sites.length > 0 ? (
        <div className="d-flex flex-column gap-2">
          {sites.map((site, i) => (
            <div key={i} className="d-flex gap-2">
              <div className="flex-fill">
                <input
                  placeholder={urlPlaceholder ?? 'https://google.com'}
                  className="form-control"
                  value={site}
                  onChange={(e) => handleUrlChangeForSite(e, i)}
                />
              </div>
              <button
                type="button"
                className="btn btn-sm btn-default"
                onClick={() => handleRemoveSite(i)}
              >
                <i className="fa fa-fw fa-times" />
              </button>
            </div>
          ))}
        </div>
      ) : null}

      <button type="button" onClick={handleAddNewSite} className="btn btn-default col-12">
        <i className="fa fa-fw fa-plus me-2" />
        Add Site
      </button>
      <span className="text-secondary">{helpText}</span>
    </div>
  );
}
