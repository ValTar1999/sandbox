import React, { ReactNode } from 'react';
import clsx from 'clsx';
import WrapModal from '../modal/WrapModal';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
  children?: ReactNode;
  footer?: ReactNode;
  icon?: ReactNode;
  onClose?: () => void;
  titleCenter?: boolean;
}

const Modal: React.FC<Props> = ({
  title,
  description,
  className = '',
  children,
  footer,
  icon,
  onClose,
  titleCenter = false,
}) => {
  return (
    <WrapModal className={clsx('modal-container', className)} onClose={onClose}>
      <div className="flex flex-col items-center gap-8 px-6 pb-6">
        {icon && <div className={clsx("flex items-center w-full", titleCenter && "justify-center")}>{icon}</div>}
        
        <div className={clsx("flex flex-col gap-2", titleCenter && "items-center")}>
          {title && <div className={clsx("text-lg font-semibold text-gray-900", titleCenter && "text-center")}>{title}</div>}
          {description && (
            <div
              className={clsx("text-sm text-gray-500", titleCenter && "text-center")}
              dangerouslySetInnerHTML={{ __html: description }}
            />
          )}
        </div>
        {children}
      </div>
      {footer && (
        <div className="border-t border-gray-200 px-6 py-5">
          {footer}
        </div>
      )}
    </WrapModal>
  );
};

export default Modal;
