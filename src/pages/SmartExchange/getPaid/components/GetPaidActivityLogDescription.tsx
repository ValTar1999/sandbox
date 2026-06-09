import { Fragment } from 'react';
import { ACTIVITY_LOG_LINK_CLASS } from '../../constants';

const GetPaidActivityLogDescription = ({
  description,
  invoiceNumber,
}: {
  description: string;
  invoiceNumber: string;
}) => {
  const invoiceLink = `#${invoiceNumber}`;

  if (!description.includes(invoiceLink)) {
    return (
      <span className="text-sm leading-5 text-gray-700">{description}</span>
    );
  }

  const parts = description.split(
    new RegExp(`(${invoiceLink.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'g')
  );

  return (
    <span className="text-sm leading-5 text-gray-700">
      {parts.map((part, index) =>
        part === invoiceLink ? (
          <span
            key={`${part}-${index}`}
            className={ACTIVITY_LOG_LINK_CLASS}
          >
            {part}
          </span>
        ) : part ? (
          <Fragment key={index}>{part}</Fragment>
        ) : null
      )}
    </span>
  );
};

export default GetPaidActivityLogDescription;
