import React from 'react';
import { render, screen } from '@testing-library/react';
import Alert from './Alert';

describe('Alert Component', () => {
  it('should render with proper text on success type', () => {
    const text = 'Test Text';
    const { container } = render(<Alert text={text} type="success" />);
    expect(screen.getByText(text)).toBeInTheDocument();
    expect(container).toMatchInlineSnapshot(`
      <div>
        <div
          class="alert alert-success"
        >
          Test Text
        </div>
      </div>
    `);
  });
  it('should render wtih proper text on danger type', () => {
    const text = 'Test Text';
    const { container } = render(<Alert text={text} type="danger" />);
    expect(screen.getByText(text)).toBeInTheDocument();
    expect(container).toMatchInlineSnapshot(`
      <div>
        <div
          class="alert alert-danger"
        >
          Test Text
        </div>
      </div>
    `);
  });
});
