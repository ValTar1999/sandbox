import React from 'react';
import clsx from 'clsx';
import Icon from './Icon';

interface Step {
  text: string;
  state?: 'done' | 'progress';
}

interface PaymentStepProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  data?: Step[];
}

const defaultData: Step[] = [
  { text: 'Request Initiation', state: 'done' },
  { text: 'In Progress', state: 'progress' },
  { text: 'Paid' }
];

const classConstructor = {
  root: 'flex items-start gap-8 p-4 bg-gray-50 rounded-lg w-full text-sm font-medium',
  state: {
    done: {
      line: 'bg-smart-main',
      text: 'text-smart-main'
    },
    progress: {
      line: 'bg-smart-main',
      text: 'text-gray-900'
    }
  }
};

const PaymentStepProgress: React.FC<PaymentStepProgressProps> = ({ data = defaultData, className, ...props }) => {
  return (
    <div className={clsx(classConstructor.root, className)} {...props}>
      {data.map(({ text, state }, index) => (
        <div key={index} className="flex w-full flex-col items-start">
          <div className={clsx('h-1 w-full bg-gray-200', state && classConstructor.state[state]?.line)} />
          <div className={clsx('mt-4 flex items-center', state && classConstructor.state[state]?.text)}>
            {state === 'done' && <Icon icon="check-circle" className="mr-1" />}
            <div>{text}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PaymentStepProgress;
