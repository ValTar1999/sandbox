import { useState, useMemo } from "react";
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

const Sidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(() => localStorage.getItem("sidebarOpen") === "true");
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({});
  const location = useLocation();

  const toggleSidebar = () => {
    setIsOpen((prev) => {
      const newState = !prev;
      localStorage.setItem("sidebarOpen", newState.toString());
      return newState;
    });
  };

  const sidebarClasses = clsx(
    "h-screen bg-white border-r border-gray-200 px-5 pt-5 pb-9 flex flex-col transition-all duration-300",
    isOpen ? "w-90" : "w-20"
  );

  const renderMenuItem = useMemo(() => (item: MenuItem) => {
    const isDashboardActive = item.to === "/dashboard" && location.pathname === "/";
    const isExactActive = location.pathname === item.to;
    const isChildActive = item.children?.some((child) => location.pathname === child.to) ?? false;
    const isActive = isDashboardActive || isExactActive;
    const applyActiveStyles = !item.children && isActive;
    const isExpanded = expandedMenus[item.to] ?? isChildActive;

    const linkClasses = clsx(
      "group flex items-center w-full hover:bg-gray-50 p-2 rounded-md transition-all duration-300",
      applyActiveStyles && "bg-gray-100"
    );

    const iconClasses = clsx(
      "h-6 w-6 min-w-6 min-h-6 transition-all duration-300",
      applyActiveStyles ? "text-blue-600" : "text-gray-400"
    );

    const labelClasses = clsx(
      "text-base font-medium pl-3 transition-all duration-300",
      applyActiveStyles ? "text-gray-900" : "text-gray-600 group-hover:text-gray-900"
    );

    return (
      <div key={item.to}>
        <div className="flex items-center">
          <NavLink
            to={item.to}
            className={linkClasses}
            onClick={(event) => {
              if (!item.children || !isOpen) return;
              event.preventDefault();
              setExpandedMenus((prev) => ({
                ...prev,
                [item.to]: !(prev[item.to] ?? isChildActive),
              }));
            }}
          >
            <item.icon className={iconClasses} />
            <div
              className={clsx(
                "flex justify-between w-full items-center overflow-hidden transition-all duration-300",
                isOpen
                  ? "opacity-100 max-w-full"
                  : "opacity-0 max-w-0 pointer-events-none"
              )}
            >
              <span className={labelClasses}>{item.label}</span>
              <div className="flex items-center">
                {item.badge && <Badge color="gray" rounded size="sm">{item.badge}</Badge>}
                {item.children && isOpen && (
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
          </NavLink>
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
                      "block rounded-md p-2 text-base font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors duration-300",
                      isChildItemActive && "text-gray-900 bg-gray-100"
                    )}
                  >
                    {child.label}
                  </NavLink>
                );
              })}
            </div>
          </div>
        )}
        {item.line && <hr className="border-bottom my-2.5 w-full border-gray-200" />}
      </div>
    );
  }, [expandedMenus, isOpen, location.pathname]);

  return (
    <div className={sidebarClasses}>
      <div className="flex items-center justify-between">
        {isOpen && <Logo />}
        <Button onClick={toggleSidebar} size="md" variant="linkSecondary">
          <Icon 
            icon="logout" 
            className={clsx(
              "transition-all duration-300",
              isOpen ? "rotate-0" : "rotate-180"
            )} 
          />
        </Button>
      </div>

      <nav className="mt-5 grid grid-cols-1 gap-1">
        {menuItems.map(renderMenuItem)}

        <div>
          <div
            className={clsx(
              "flex items-center overflow-hidden transition-all duration-300",
              isOpen
                ? "opacity-100 max-w-full block"
                : "opacity-0 max-w-0 pointer-events-none hidden"
            )}
          >
            <Button 
              icon="question-mark-circle" 
              iconDirection="left" 
              variant="linkSecondary" 
              size="md"
            >
              Help from Transcard
            </Button>
          </div>
          {!isOpen && (
            <div className="flex justify-start">
              <Button 
                icon="question-mark-circle" 
                variant="linkSecondary" 
                size="md" 
              />
            </div>
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
                isOpen
                  ? "opacity-100 max-w-full"
                  : "opacity-0 max-w-0 pointer-events-none"
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
