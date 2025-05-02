import React, { memo } from 'react';
import clsx from 'clsx';
import LogoImgSrc from '../../assets/image/layout/smart-hub-logo-new.svg';

interface LogoProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  logoSrc?: string;
  altText?: string;
  link?: string;
  className?: string;
}

const Logo: React.FC<LogoProps> = memo(({
  className,
  logoSrc = LogoImgSrc,
  altText = 'SMART Hub',
  link = '/sandbox/',
  ...props
}) => {
  return (
    <a
      href={link}
      className={clsx(
        'flex flex-shrink-0 items-center',
        className
      )}
      {...props}
    >
      <img
        src={logoSrc}
        alt={altText}
        className="w-full min-w-8 h-8"
      />
    </a>
  );
});

Logo.displayName = 'Logo';

export default Logo;
