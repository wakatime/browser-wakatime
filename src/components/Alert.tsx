import classNames from 'classnames';
import { SuccessOrFailType } from '../config/config';
interface AlertProps {
  text: string;
  type: SuccessOrFailType;
}

export default function Alert({ type, text }: AlertProps): JSX.Element {
  return <div className={classNames('alert', `alert-${type}`)}>{text}</div>;
}
