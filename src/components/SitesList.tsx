import React from 'react';

type Props = {
  handleChange: (sites: string) => void;
  helpText: string;
  label: string;
  placeholder?: string;
  rows?: number;
  sites: string;
};

export default function SitesList({
  handleChange,
  label,
  placeholder,
  rows,
  sites,
  helpText,
}: Props): JSX.Element {
  const textareaChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    handleChange(event.target.value);
  };

  return (
    <div className="form-group mb-4">
      <label htmlFor={`${label}-siteList`} className="col-lg-2 control-label">
        {label}
      </label>

      <div className="col-lg-10">
        <textarea
          id={`${label}-siteList`}
          className="form-control"
          rows={rows ?? 3}
          onChange={textareaChange}
          placeholder={placeholder ?? 'http://google.com'}
          value={sites}
        ></textarea>
        <span className="text-secondary">
          {helpText}
          <br />
          One line per site.
        </span>
      </div>
    </div>
  );
}
