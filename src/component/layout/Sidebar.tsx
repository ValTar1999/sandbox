import { useState, useMemo, useEffect, useCallback, memo } from "react";
import { NavLink, useLocation } from "react-router-dom";
import clsx from "clsx";
import {
  HomeIcon,
  TruckIcon,
  ArrowRightStartOnRectangleIcon,
  ArrowLeftStartOnRectangleIcon,
  BriefcaseIcon,
  AdjustmentsVerticalIcon,
  Cog8ToothIcon,
} from "@heroicons/react/24/outline";

import Button from "../base/Button";
import Icon from "../base/Icon";
import Logo from "../layout/Logo";
import Badge from "../base/Badge";
import Tooltip, { TooltipTrigger, TooltipContent } from "../base/Tooltip";
import Menu from "../base/Menu";
import Select, { useSelectContext } from "../base/Select";

import TranscardShield from "../../assets/image/layout/transcard-shield.svg";
import TranscardText from "../../assets/image/layout/transcard-text.svg";

interface MenuItem {
  to: string;
  label: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  badge?: number;
  line?: boolean;
  children?: Array<{
    to: string;
    label: string;
  }>;
}

const menuItems: MenuItem[] = [
  { to: "/dashboard", label: "Dashboard", icon: HomeIcon, line: true },
  { to: "/payables", label: "Bills/Payables", icon: ArrowRightStartOnRectangleIcon, badge: 12 },
  { to: "/vendors", label: "Vendors", icon: TruckIcon, line: true },
  { to: "/receivables", label: "Invoices/Receivables", icon: ArrowLeftStartOnRectangleIcon, badge: 3 },
  { to: "/customers", label: "Customers", icon: BriefcaseIcon, line: true },
  { to: "/configurator", label: "Configurator", icon: AdjustmentsVerticalIcon },
  {
    to: "/settings",
    label: "Settings",
    icon: Cog8ToothIcon,
    line: true,
    children: [
      { to: "/settings/business-details", label: "Business Details" },
      { to: "/settings/user-management", label: "User Management" },
    ],
  },
];

const SIDEBAR_BREAKPOINT = 1280;

// Константы для классов
const COMMON_CLASSES = {
  link: "group flex items-center w-full hover:bg-gray-50 p-2 rounded-md transition-all duration-300 cursor-pointer",
  linkActive: "bg-gray-100",
  icon: "h-6 w-6 min-w-6 min-h-6 transition-all duration-300",
  iconActive: "text-blue-600",
  iconInactive: "text-gray-400",
  label: "text-base font-medium pl-3 transition-all duration-300",
  labelActive: "text-gray-900",
  labelInactive: "text-gray-600 group-hover:text-gray-900",
  textContainer: "flex justify-between w-full items-center overflow-hidden transition-all duration-300",
  textVisible: "opacity-100 max-w-full",
  textHidden: "opacity-0 max-w-0 pointer-events-none",
  childLink: "block rounded-md p-2 text-base font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors duration-300",
  childLinkActive: "text-gray-900 bg-gray-100",
} as const;

interface CopyableTextProps {
  text: string;
  children: React.ReactNode;
}

const CopyableText = memo<CopyableTextProps>(({ text, children }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  }, [text]);

  return (
    <Tooltip trigger="hover" placement="right">
      <TooltipTrigger>
        <div
          onClick={handleCopy}
          className="cursor-pointer hover:text-gray-900 transition-colors inline-flex"
        >
          {children}
        </div>
      </TooltipTrigger>
      <TooltipContent className="bg-gray-900 text-white px-2 py-1 text-xs rounded-md">
        {copied ? (
          <div className="flex items-center gap-1">
            <span>Copied</span>
            <Icon icon="check-circle" className="w-3 h-3 text-blue-500" />
          </div>
        ) : (
          "Copy"
        )}
      </TooltipContent>
    </Tooltip>
  );
});

CopyableText.displayName = "CopyableText";

interface AccountInfoButtonProps {
  isOpen: boolean;
}

const AccountInfoButton = memo<AccountInfoButtonProps>(({ isOpen }) => {
  const { open } = useSelectContext();

  return (
    <button
      type="button"
      className="flex items-center bg-gray-50 w-full justify-between px-4 py-2 rounded-md transition-all duration-300 cursor-pointer"
    >
      <span 
        className={clsx(
          "text-sm font-semibold text-gray-700 overflow-hidden transition-all duration-300 text-nowrap",
          isOpen
            ? COMMON_CLASSES.textVisible
            : COMMON_CLASSES.textHidden
        )}
      >
        Your Account Information
      </span>
      <Icon 
        icon="chevron-down" 
        className={clsx(
          "w-5 h-5 text-gray-400 transition-transform duration-300",
          open && "rotate-180 text-gray-500"
        )} 
      />
    </button>
  );
});

AccountInfoButton.displayName = "AccountInfoButton";

// SVG иконка для AP/AR Payments
const APARPaymentsIcon = memo(() => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g filter="url(#filter0_d_6776_132084)">
      <rect x="2" y="1" width="28" height="28" rx="14" fill="url(#paint0_linear_6776_132084)"/>
      <path d="M16.1768 18.4131L18.8647 16.8612C18.9752 16.7974 19.0433 16.6795 19.0433 16.5519V13.4481C19.0433 13.3205 18.9752 13.2026 18.8647 13.1388L16.1768 11.5869C16.0663 11.5231 15.9302 11.5231 15.8197 11.5869L13.1317 13.1388C13.0212 13.2026 12.9531 13.3205 12.9531 13.4481V16.5519C12.9531 16.6795 13.0212 16.7974 13.1317 16.8612L15.8197 18.4131C15.9302 18.4769 16.0663 18.4769 16.1768 18.4131Z" stroke="white" strokeWidth="0.714286"/>
      <path d="M16.0019 6.07129L21.8012 9.41951M23.7343 10.5356V17.232M23.7343 19.4642L17.935 22.8124M16.0019 23.9285L10.2026 20.5802M8.26953 19.4642V12.7677M8.26953 10.5356L14.0688 7.18736" stroke="white" strokeWidth="0.714286" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M8.50112 11.4285C9.09285 11.4285 9.57255 10.9488 9.57255 10.3571C9.57255 9.76534 9.09285 9.28564 8.50112 9.28564C7.90938 9.28564 7.42969 9.76534 7.42969 10.3571C7.42969 10.9488 7.90938 11.4285 8.50112 11.4285Z" fill="white"/>
      <path d="M8.50112 20.7141C9.09285 20.7141 9.57255 20.2345 9.57255 19.6427C9.57255 19.051 9.09285 18.5713 8.50112 18.5713C7.90938 18.5713 7.42969 19.051 7.42969 19.6427C7.42969 20.2345 7.90938 20.7141 8.50112 20.7141Z" fill="white"/>
      <path d="M23.5011 20.7141C24.0929 20.7141 24.5725 20.2345 24.5725 19.6427C24.5725 19.051 24.0929 18.5713 23.5011 18.5713C22.9094 18.5713 22.4297 19.051 22.4297 19.6427C22.4297 20.2345 22.9094 20.7141 23.5011 20.7141Z" fill="white"/>
      <path d="M23.5011 11.4285C24.0929 11.4285 24.5725 10.9488 24.5725 10.3571C24.5725 9.76534 24.0929 9.28564 23.5011 9.28564C22.9094 9.28564 22.4297 9.76534 22.4297 10.3571C22.4297 10.9488 22.9094 11.4285 23.5011 11.4285Z" fill="white"/>
      <path d="M16.0011 7.14286C16.5929 7.14286 17.0725 6.66316 17.0725 6.07143C17.0725 5.4797 16.5929 5 16.0011 5C15.4094 5 14.9297 5.4797 14.9297 6.07143C14.9297 6.66316 15.4094 7.14286 16.0011 7.14286Z" fill="white"/>
      <path d="M16.0011 25C16.5929 25 17.0725 24.5203 17.0725 23.9286C17.0725 23.3369 16.5929 22.8572 16.0011 22.8572C15.4094 22.8572 14.9297 23.3369 14.9297 23.9286C14.9297 24.5203 15.4094 25 16.0011 25Z" fill="white"/>
    </g>
    <defs>
      <filter id="filter0_d_6776_132084" x="0" y="0" width="32" height="32" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
        <feFlood floodOpacity="0" result="BackgroundImageFix"/>
        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
        <feOffset dy="1"/>
        <feGaussianBlur stdDeviation="1"/>
        <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.05 0"/>
        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_6776_132084"/>
        <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_6776_132084" result="shape"/>
      </filter>
      <linearGradient id="paint0_linear_6776_132084" x1="16" y1="1" x2="16" y2="29" gradientUnits="userSpaceOnUse">
        <stop stopColor="#27C9E3"/>
        <stop offset="1" stopColor="#026EBC"/>
      </linearGradient>
    </defs>
  </svg>
));

APARPaymentsIcon.displayName = "APARPaymentsIcon";

// Компонент для кнопки добавления фичи
interface FeatureButtonProps {
  label: string;
}

const FeatureButton = memo<FeatureButtonProps>(({ label }) => (
  <button className="cursor-pointer flex items-center gap-2 group">
    <div className="border-2 border-gray-200 rounded-full border-dashed group-hover:border-blue-600 transition-all duration-300">
      <Icon icon="plus" className="w-5 h-5 text-gray-400 m-1 group-hover:text-blue-600 transition-all duration-300" />
    </div>
    <div className="text-sm font-medium text-blue-600">
      {label}
    </div>
  </button>
));

FeatureButton.displayName = "FeatureButton";

const AccountInfoContent = memo(() => {
  const { open, refs, getFloatingProps } = useSelectContext();

  if (!open) return null;

  return (
    <div
      ref={refs.setFloating}
      {...getFloatingProps({
        className: "absolute top-full left-0 right-0 w-full px-4 pb-4 bg-gray-50 space-y-3 z-10",
      })}
    >
      <div className="text-xs text-gray-500 leading-4">
        You can go to your account enrollment portal to update your business information or upgrade your product with additional features.
      </div>

      <hr className="border-gray-200" />

      <div className="space-y-3">
        <div className="text-sm font-medium text-gray-700">
          Current Features
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <APARPaymentsIcon />
            <div className="text-sm font-medium text-gray-800">
              AP/AR Payments
            </div>
            <Icon icon="clock" className="w-4.5 h-4.5 text-blue-500" />
          </div>
          <Icon icon="information-circle" className="w-4.5 h-4.5 text-gray-400" />
        </div>
      </div>

      <hr className="border-gray-200" />

      <div className="space-y-3">
        <div className="text-sm font-medium text-gray-700">
          Enable More Features
        </div>
        <div className="flex items-center justify-between">
          <FeatureButton label="Supply Chain Financing" />
          <Icon icon="information-circle" className="w-4.5 h-4.5 text-gray-400" />
        </div>
        <div className="flex items-center justify-between">
          <FeatureButton label="Merchant Services" />
          <Icon icon="information-circle" className="w-4.5 h-4.5 text-gray-400" />
        </div>
      </div>

      <hr className="border-gray-200" />

      <Button 
        variant="linkPrimary"
        icon="arrow-narrow-right-up"
        iconDirection="right"
      >
        Go to enrollment portal
      </Button>
    </div>
  );
});

AccountInfoContent.displayName = "AccountInfoContent";

const SettingsTooltipContent = memo(() => {
  const settingsLinks = [
    { to: "/settings/business-details", label: "My Company Profile" },
    { to: "/settings/payment-preferences", label: "Payment Preferences" },
    { to: "/settings/user-management", label: "User Management" },
  ];

  return (
    <div className="px-4 py-3">
      <div className="text-xs text-gray-500 mb-2">Settings</div>
      <div className="space-y-2">
        {settingsLinks.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className="block text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors cursor-pointer"
          >
            {link.label}
          </NavLink>
        ))}
      </div>
    </div>
  );
});

SettingsTooltipContent.displayName = "SettingsTooltipContent";

const AccountInfoContentTooltip = memo(() => (
  <div className="w-[296px] bg-white shadow-md rounded-lg p-4 space-y-3">
    <div className="text-sm font-semibold text-gray-900">Your Account Information</div>
    <div className="text-xs text-gray-500 leading-4">
      You can go to your account enrollment portal to update your business information or upgrade your product with additional features.
    </div>

    <hr className="border-gray-200" />

    <div className="space-y-3">
      <div className="text-sm font-medium text-gray-700">
        Current Features
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <APARPaymentsIcon />
          <div className="text-sm font-medium text-gray-800">
            AP/AR Payments
          </div>
          <Icon icon="clock" className="w-4.5 h-4.5 text-blue-500" />
        </div>
        <Icon icon="information-circle" className="w-4.5 h-4.5 text-gray-400" />
      </div>
    </div>

    <hr className="border-gray-200" />

    <div className="space-y-3">
      <div className="text-sm font-medium text-gray-700">
        Enable More Features
      </div>
      <div className="flex items-center justify-between">
        <FeatureButton label="Supply Chain Financing" />
        <Icon icon="information-circle" className="w-4.5 h-4.5 text-gray-400" />
      </div>
      <div className="flex items-center justify-between">
        <FeatureButton label="Merchant Services" />
        <Icon icon="information-circle" className="w-4.5 h-4.5 text-gray-400" />
      </div>
    </div>

    <hr className="border-gray-200" />

    <Button 
      variant="linkPrimary"
      icon="arrow-narrow-right-up"
      iconDirection="right"
    >
      Go to enrollment portal
    </Button>
  </div>
));

AccountInfoContentTooltip.displayName = "AccountInfoContentTooltip";

// Компонент для Help Menu/Tooltip контента
const HelpContent = memo(() => (
  <>
    <div className="space-y-2 px-4 py-4.5">
      <div className="font-semibold text-gray-900 text-sm">Contact Support</div>
      <div className="space-y-1.5 text-sm text-gray-500">
        <CopyableText text="support@transcard.com">
          support@transcard.com
        </CopyableText>
        <CopyableText text="800-890-3128">
          800-890-3128
        </CopyableText>
      </div>
    </div>
    <a 
      href="#" 
      className="flex items-center gap-1 text-sm font-semibold py-3 px-6 text-blue-600 hover:text-blue-700 transition-all duration-300"
    >
      FAQ & User Guides
      <Icon icon="arrow-right" className="w-4 h-4" />
    </a>
  </>
));

HelpContent.displayName = "HelpContent";

const Sidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(() => {
    if (typeof window === "undefined") return false;
    if (window.innerWidth <= SIDEBAR_BREAKPOINT) return false;
    return localStorage.getItem("sidebarOpen") === "true";
  });
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({});
  const location = useLocation();

  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${SIDEBAR_BREAKPOINT}px)`);
    const handleChange = (e: MediaQueryListEvent) => {
      if (e.matches) {
        setIsOpen(false);
        localStorage.setItem("sidebarOpen", "false");
      } else {
        setIsOpen(localStorage.getItem("sidebarOpen") === "true");
      }
    };
    mql.addEventListener("change", handleChange);
    return () => mql.removeEventListener("change", handleChange);
  }, []);

  const toggleSidebar = useCallback(() => {
    setIsOpen((prev) => {
      const newState = !prev;
      localStorage.setItem("sidebarOpen", newState.toString());
      return newState;
    });
  }, []);

  const sidebarClasses = useMemo(
    () => clsx(
      "h-screen bg-white border-r border-gray-200 px-5 pt-5 pb-9 flex flex-col transition-all duration-300",
      isOpen ? "w-[304px]" : "w-20"
    ),
    [isOpen]
  );

  const handleMenuToggle = useCallback((item: MenuItem, isChildActive: boolean) => {
    return (event: React.MouseEvent) => {
      if (!item.children || !isOpen) return;
      event.preventDefault();
      setExpandedMenus((prev) => ({
        ...prev,
        [item.to]: !(prev[item.to] ?? isChildActive),
      }));
    };
  }, [isOpen]);

  // Общий компонент для содержимого пункта меню
  const MenuItemContent = memo<{
    item: MenuItem;
    iconClasses: string;
    labelClasses: string;
    isExpanded: boolean;
    isOpen: boolean;
  }>(({ item, iconClasses, labelClasses, isExpanded, isOpen: sidebarOpen }) => (
    <>
      <item.icon className={iconClasses} />
      <div
        className={clsx(
          COMMON_CLASSES.textContainer,
          sidebarOpen ? COMMON_CLASSES.textVisible : COMMON_CLASSES.textHidden
        )}
      >
        <span className={labelClasses}>{item.label}</span>
        <div className="flex items-center">
          {item.badge && <Badge color="gray" rounded size="sm">{item.badge}</Badge>}
          {item.children && sidebarOpen && (
            <Icon
              icon="chevron-down"
              className={clsx(
                "w-5 h-5 text-gray-500 transition-transform duration-300",
                isExpanded ? "rotate-180" : "rotate-0"
              )}
            />
          )}
        </div>
      </div>
    </>
  ));

  MenuItemContent.displayName = "MenuItemContent";

  const renderMenuItem = useCallback((item: MenuItem, index: number) => {
    const isDashboardActive = item.to === "/dashboard" && location.pathname === "/";
    const isExactActive = location.pathname === item.to;
    const isChildActive = item.children?.some((child) => location.pathname === child.to) ?? false;
    const isActive = isDashboardActive || isExactActive;
    const applyActiveStyles = !item.children && isActive;
    const isExpanded = expandedMenus[item.to] ?? isChildActive;
    const isLastItem = index === menuItems.length - 1;
    const isSettings = item.to === "/settings";

    const linkClasses = clsx(
      COMMON_CLASSES.link,
      applyActiveStyles && COMMON_CLASSES.linkActive
    );

    const iconClasses = clsx(
      COMMON_CLASSES.icon,
      applyActiveStyles ? COMMON_CLASSES.iconActive : COMMON_CLASSES.iconInactive
    );

    const labelClasses = clsx(
      COMMON_CLASSES.label,
      applyActiveStyles ? COMMON_CLASSES.labelActive : COMMON_CLASSES.labelInactive
    );

    const menuContent = (
      <MenuItemContent
        item={item}
        iconClasses={iconClasses}
        labelClasses={labelClasses}
        isExpanded={isExpanded}
        isOpen={isOpen}
      />
    );

    const needsTooltip = !isOpen && !isSettings && !item.children;
    const navLinkElement = (
      <NavLink
        to={item.to}
        className={linkClasses}
        onClick={handleMenuToggle(item, isChildActive)}
        tabIndex={!isOpen ? -1 : undefined}
      >
        {menuContent}
      </NavLink>
    );

    return (
      <div key={item.to}>
        <div className="flex items-center relative">
          {isSettings && !isOpen ? (
            <Menu.Root placement="right-start">
              <Menu.Trigger as="span" className="w-full">
                <button type="button" className={linkClasses}>
                  {menuContent}
                </button>
              </Menu.Trigger>
              <Menu.Portal>
                <Menu.Positioner>
                  <Menu.Popup className="w-fit rounded-lg bg-white shadow-md">
                    <SettingsTooltipContent />
                  </Menu.Popup>
                </Menu.Positioner>
              </Menu.Portal>
            </Menu.Root>
          ) : needsTooltip ? (
            <Tooltip trigger="hover" placement="right">
              <TooltipTrigger as="span" className="w-full">
                {navLinkElement}
              </TooltipTrigger>
              <TooltipContent className="bg-gray-900 text-white px-2.5 py-1 text-sm rounded-lg">
                {item.label}
              </TooltipContent>
            </Tooltip>
          ) : (
            navLinkElement
          )}
        </div>
        {item.children && (
          <div
            className={clsx(
              "grid overflow-hidden transition-all duration-300",
              isOpen && isExpanded
                ? "opacity-100 max-h-40"
                : "opacity-0 max-h-0 pointer-events-none"
            )}
          >
            <div className="pl-10 pt-1 pb-2 space-y-1">
              {item.children.map((child) => {
                const isChildItemActive = location.pathname === child.to;
                return (
                  <NavLink
                    key={child.to}
                    to={child.to}
                    className={clsx(
                      COMMON_CLASSES.childLink,
                      isChildItemActive && COMMON_CLASSES.childLinkActive
                    )}
                  >
                    {child.label}
                  </NavLink>
                );
              })}
            </div>
          </div>
        )}
        {item.line && !isLastItem && <hr className="border-bottom my-3 w-full border-gray-200" />}
      </div>
    );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expandedMenus, isOpen, location.pathname, handleMenuToggle]);

  const menuItemsList = useMemo(
    () => menuItems.map((item, index) => renderMenuItem(item, index)),
    [renderMenuItem]     
  );

  return (
    <div className={sidebarClasses}>
      <div className="flex items-center justify-between">
        {isOpen && <Logo />}
        <Tooltip trigger="hover" placement="right">
          <TooltipTrigger as="span">
            <Button onClick={toggleSidebar} size="md" variant="linkSecondary">
              <Icon 
                icon="logout" 
                className={clsx(
                  "transition-all duration-300",
                  isOpen ? "rotate-0" : "rotate-180"
                )} 
              />
            </Button>
          </TooltipTrigger>
          <TooltipContent className="bg-gray-900 text-white px-2 py-1 text-xs rounded-md">
            {isOpen ? "Collapse" : "Expand"}
          </TooltipContent>
        </Tooltip>
      </div>

      <nav className="mt-5 grid grid-cols-1 gap-1">
        {menuItemsList}

        <div className="mt-8">
          <div className="flex items-center relative">
            {isOpen ? (
              <Menu.Root placement="bottom-start">
                <Menu.Trigger
                  as="button"
                  className={clsx(
                    "group cursor-pointer inline-flex items-center transition-all duration-300 w-full",
                    "px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 rounded-md"
                  )}
                >
                  <Icon icon="question-mark-circle" className="h-4 w-4 text-gray-400" />
                  <div
                    className={clsx(
                      "flex pl-1.5 justify-between w-full items-center overflow-hidden transition-all duration-300",
                      COMMON_CLASSES.textVisible
                    )}
                  >
                    <span className="text-sm font-semibold text-gray-700 group-hover:text-gray-900 transition-all duration-300 text-nowrap">
                      Help from Transcard
                    </span>
                  </div>
                </Menu.Trigger>
                <Menu.Portal>
                  <Menu.Positioner>
                    <Menu.Popup className="w-64 rounded-lg bg-white shadow-md divide-y divide-gray-200">
                      <HelpContent />
                    </Menu.Popup>
                  </Menu.Positioner>
                </Menu.Portal>
              </Menu.Root>
            ) : (
              <Tooltip trigger="hover" placement="right-start">
                <TooltipTrigger
                  as="button"
                  tabIndex={-1}
                  className={clsx(
                    "group cursor-pointer inline-flex items-center transition-all duration-300",
                    "ml-1 hover:bg-gray-50 p-2 rounded-md"
                  )}
                >
                  <Icon icon="question-mark-circle" className="h-4 w-4 text-gray-400" />
                  <div
                    className={clsx(
                      "flex pl-1.5 justify-between w-full items-center overflow-hidden transition-all duration-300",
                      COMMON_CLASSES.textHidden
                    )}
                  >
                    <span className="text-sm font-semibold text-gray-700 group-hover:text-gray-900 transition-all duration-300 text-nowrap">
                      Help from Transcard
                    </span>
                  </div>
                </TooltipTrigger>
                <TooltipContent className="w-64 p-4 bg-white border border-gray-200 shadow-lg rounded-lg">
                  <HelpContent />
                </TooltipContent>
              </Tooltip>
            )}
          </div>
        </div>

        <div className="mt-8 relative">
          {isOpen ? (
            <Select.Root placement="bottom-start">
              <Select.Trigger as="span" className="w-full">
                <AccountInfoButton isOpen={isOpen} />
              </Select.Trigger>
              <AccountInfoContent />
            </Select.Root>
          ) : (
            <Tooltip trigger="hover" placement="right-start">
              <TooltipTrigger>
                <button
                  type="button"
                  className="group flex items-center ml-1 hover:bg-gray-50 p-2 rounded-md transition-all duration-300"
                >
                  <Icon icon="information-circle" className="h-4 w-4 text-gray-400" />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <AccountInfoContentTooltip />
              </TooltipContent>
            </Tooltip>
          )}
        </div>
      </nav>

      <div className="flex flex-col items-center mt-auto space-y-2">
        <div className="flex w-full flex-grow items-center justify-center">
          <div className="flex items-center">
            <img
              src={TranscardShield}
              title="Powered by Transcard"
              alt="Transcard Shield"
              loading="lazy"
              decoding="async"
            />
            <div
              className={clsx(
                "flex items-center overflow-hidden transition-all duration-300",
                isOpen ? COMMON_CLASSES.textVisible : COMMON_CLASSES.textHidden
              )}
            >
              <div className="ml-1 text-xs font-medium leading-4 text-gray-500 text-nowrap">Powered by</div>
              <img
                src={TranscardText}
                className="ml-1"
                alt="Transcard"
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>
        </div>
        <div
          className={clsx(
            "flex items-center space-x-2 overflow-hidden transition-all duration-300",
            isOpen
              ? "opacity-100 max-w-full block"
              : "opacity-0 max-w-0 pointer-events-none hidden"
          )}
        >
          <a 
            href="#" 
            className="text-nowrap w-fit transition-all duration-300 cursor-pointer text-center text-xs font-medium leading-4 text-gray-700 hover:opacity-80"
          >
            Terms of Use
          </a>
          <div className="text-gray-700 text-xs font-medium leading-4">•</div>
          <a 
            href="#" 
            className="text-nowrap w-fit transition-all duration-300 cursor-pointer text-center text-xs font-medium leading-4 text-gray-700 hover:opacity-80"
          >
            Privacy Policy
          </a>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
