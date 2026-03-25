import React, { useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { focusButton } from '../../config/commonStyles';
import Icon from '../base/Icon';
import clsx from 'clsx';

interface BreadcrumbSegmentProps {
  segment: string;
  pathTo: string;
  isLast: boolean;
}

const BreadcrumbSegment: React.FC<BreadcrumbSegmentProps> = ({ segment, pathTo, isLast }) => {
  const formattedSegment = segment.replace(/-/g, " ");

  if (isLast) {
    return (
      <span className="text-gray-500 text-sm font-medium capitalize">
        {formattedSegment}
      </span>
    );
  }

  return (
    <Link
      to={pathTo}
      className={clsx(
        "text-gray-500 text-sm font-medium hover:text-gray-700 transition-all duration-300 capitalize",
        focusButton()
      )}
    >
      {formattedSegment}
    </Link>
  );
};

const Breadcrumb: React.FC = () => {
  const location = useLocation();

  const pathnames = useMemo(() =>
    location.pathname.split("/").filter(Boolean),
    [location.pathname]
  );

  return (
    <nav aria-label="breadcrumb" className="flex items-center border-t border-gray-200 py-4 space-x-4">
      <div className="flex items-center">
        <div className="text-xl font-semibold text-gray-900">
          Current location
        </div>

        <hr className="mx-6 flex h-5 w-[1px] bg-gray-300 border-transparent" />

        <Link
          to="/"
          className={clsx(
            "inline-flex rounded text-gray-400 hover:text-gray-500",
            focusButton('focus-visible:ring-blue-600')
          )}
        >
          <Icon icon="home" />
        </Link>
      </div>

      {pathnames.map((segment, index) => {
        const pathTo = `/${pathnames.slice(0, index + 1).join("/")}`;
        const isLast = index === pathnames.length - 1;

        return (
          <React.Fragment key={pathTo}>
            <Icon icon="chevron-right" className="text-gray-400" />
            <BreadcrumbSegment
              segment={segment}
              pathTo={pathTo}
              isLast={isLast}
            />
          </React.Fragment>
        );
      })}
    </nav>
  );
};

export default Breadcrumb;
