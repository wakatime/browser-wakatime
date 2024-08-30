import { render, screen } from '@testing-library/react';
import React from 'react';
import Alert from './Alert';

describe('Alert Component', () => {
  it('should render with proper text on success type', () => {
    const text = 'Test Text';
    const { container } = render(<Alert text={text} type="success" />);
    // eslint-disable-next-line testing-library/prefer-implicit-assert
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
    // eslint-disable-next-line testing-library/prefer-implicit-assert
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
