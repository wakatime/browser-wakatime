import React, { MouseEventHandler, CSSProperties } from 'react';
import classNames from 'classnames';
import { SuccessOrFailType } from '../config/config';
interface AlertProps {
  onClick?: MouseEventHandler<HTMLDivElement>;
  style?: CSSProperties;
  text: string;
  type: SuccessOrFailType;
}

export default function Alert({ onClick, style, type, text }: AlertProps): JSX.Element {
  return (
    <div className={classNames('alert', `alert-${type}`)} onClick={onClick} style={style}>
      {text}
    </div>
  );
}
