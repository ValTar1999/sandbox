import React from 'react';
import { ACTIVITY_LOG_LINK_CLASS } from '../../constants';

export type ActivityLogLink = { text: string; onClick: () => void };

const ActivityLogDescription = ({
  description,
  links,
}: {
  description: string;
  links: ActivityLogLink[];
}) => {
  const activeLinks = links.filter((link) => description.includes(link.text));

  if (activeLinks.length === 0) {
    return (
      <span className="text-sm leading-5 text-gray-700">{description}</span>
    );
  }

  const pattern = activeLinks
    .map((link) => link.text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
    .sort((a, b) => b.length - a.length)
    .join('|');

  const parts = description.split(new RegExp(`(${pattern})`, 'g'));

  return (
    <span className="text-sm leading-5 text-gray-700">
      {parts.map((part, index) => {
        if (!part) {
          return null;
        }

        const link = activeLinks.find((item) => item.text === part);

        if (link) {
          return (
            <button
              key={`${part}-${index}`}
              type="button"
              className={ACTIVITY_LOG_LINK_CLASS}
              onClick={(e) => {
                e.stopPropagation();
                link.onClick();
              }}
            >
              {part}
            </button>
          );
        }

        return <React.Fragment key={index}>{part}</React.Fragment>;
      })}
    </span>
  );
};

export default ActivityLogDescription;
