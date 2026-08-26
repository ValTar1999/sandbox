import React, { ReactNode } from 'react';
import clsx from 'clsx';
import Button from '../base/Button';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  noCross?: boolean;
  classContent?: string;
  noHeader?: boolean;
  header?: ReactNode;
  footer?: ReactNode;
  onClose?: () => void;
}

const WrapModal: React.FC<Props> = ({
  noCross = false,
  classContent = '',
  noHeader = false,
  header,
  footer,
  className = '',
  children,
  onClose,
}) => {
  const isSlotFooterNotEmpty = Boolean(footer);

  return (
    <div
      className={clsx(
        'rounded-md bg-white m-auto flex flex-col max-h-[calc(100vh-4rem)] overflow-hidden',
        noCross && 'pt-10',
        className
      )}
    >
      {!noHeader && (
        <div className="flex w-full shrink-0 items-center justify-end">
          {!noCross && (
            <div
              className={clsx(
                'flex w-full items-center text-lg font-medium',
                header && 'border-b border-gray-200'
              )}
            >
              {header && (
                <div className="flex items-center px-6 py-4">{header}</div>
              )}
              {onClose && (
                <Button
                  icon="x"
                  size="xl"
                  variant="linkSecondary"
                  className="my-3 ml-auto mr-4"
                  onClick={onClose}
                />
              )}
            </div>
          )}
        </div>
      )}

      <div
        className={clsx(
          'min-h-0 flex-1 overflow-y-auto overscroll-contain no-scrollbar',
          classContent
        )}
      >
        {children}
      </div>

      {isSlotFooterNotEmpty && (
        <div className="shrink-0 border-t border-gray-200 px-6 py-5">
          {footer}
        </div>
      )}
    </div>
  );
};

export default WrapModal;
