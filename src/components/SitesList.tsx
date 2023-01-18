import React from 'react';

type Props = {
  handleChange: (sites: string) => void;
  helpText: string;
  label: string;
  placeholder?: string;
  sites: string;
};

export default function SitesList({
  handleChange,
  label,
  placeholder,
  sites,
  helpText,
}: Props): JSX.Element {
  const textareaChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    handleChange(event.target.value);
  };

  return (
    <div className="form-group">
      <label htmlFor="sites" className="col-lg-2 control-label">
        {label}
      </label>

      <div className="col-lg-10">
        <textarea
          className="form-control"
          rows={3}
          onChange={textareaChange}
          placeholder={placeholder ?? 'http://google.com'}
          value={sites}
        ></textarea>
        <span className="help-block">
          {helpText}
          <br />
          One line per site.
        </span>
      </div>
    </div>
  );
}
