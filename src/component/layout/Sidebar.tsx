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
}

const menuItems: MenuItem[] = [
  { to: "/dashboard", label: "Dashboard", icon: HomeIcon, line: true },
  { to: "/payables", label: "Bills/Payables", icon: ArrowRightStartOnRectangleIcon, badge: 12 },
  { to: "/vendors", label: "Vendors", icon: TruckIcon, line: true },
  { to: "/receivables", label: "Invoices/Receivables", icon: ArrowLeftStartOnRectangleIcon, badge: 3 },
  { to: "/customers", label: "Customers", icon: BriefcaseIcon, line: true },
  { to: "/configurator", label: "Configurator", icon: AdjustmentsVerticalIcon },
  { to: "/settings", label: "Settings", icon: Cog8ToothIcon, line: true },
];

const Sidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(() => localStorage.getItem("sidebarOpen") === "true");
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
    isOpen ? "w-80" : "w-20"
  );

  const renderMenuItem = useMemo(() => (item: MenuItem) => {
    const isDashboardActive = item.to === "/dashboard" && location.pathname === "/";
    const isExactActive = location.pathname === item.to;
    const isActive = isDashboardActive || isExactActive;

    const linkClasses = clsx(
      "group flex items-center w-full hover:bg-gray-50 p-2 rounded-md transition-all duration-300",
      isActive && "bg-gray-100"
    );

    const iconClasses = clsx(
      "h-6 w-6 min-w-6 min-h-6 transition-all duration-300",
      isActive ? "text-blue-600" : "text-gray-400"
    );

    const labelClasses = clsx(
      "text-sm font-medium pl-3 transition-all duration-300",
      isActive ? "text-gray-900" : "text-gray-600 group-hover:text-gray-900"
    );

    return (
      <div key={item.to}>
        <NavLink to={item.to} className={linkClasses}>
          <item.icon className={iconClasses} />
          {isOpen && (
            <div className="flex justify-between w-full">
              <span className={labelClasses}>{item.label}</span>
              {item.badge && <Badge color="gray" rounded size="sm">{item.badge}</Badge>}
            </div>
          )}
        </NavLink>
        {item.line && <hr className="border-bottom my-2.5 w-full border-gray-200" />}
      </div>
    );
  }, [isOpen, location.pathname]);

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
          {isOpen ? (
            <Button 
              icon="question-mark-circle" 
              iconDirection="left" 
              variant="linkSecondary" 
              size="md"
            >
              Help from Transcard
            </Button>
          ) : (
            <div className="flex justify-center">
              <Button 
                icon="question-mark-circle" 
                variant="linkSecondary" 
                size="md" 
              />
            </div>
          )}
        </div>
      </nav>

      <div className="flex flex-col items-center mt-auto">
        <div className="flex w-full flex-grow items-center justify-center py-4">
          <div className="flex items-center">
            <img src={TranscardShield} title="Powered by Transcard" alt="Transcard Shield" />
            {isOpen && (
              <div className="flex items-center">
                <div className="ml-1 text-xs font-medium leading-4 text-gray-500">Powered by</div>
                <img src={TranscardText} className="ml-1" alt="Transcard" />
              </div>
            )}
          </div>
        </div>
        {isOpen && (
          <div className="flex items-center">
            <a 
              href="#" 
              className="transition-all duration-300 w-28 cursor-pointer p-2 text-center text-xs font-medium leading-4 text-gray-500 hover:opacity-80"
            >
              Terms of Use
            </a>
            <hr className="h-5 w-px border-none bg-gray-300" />
            <a 
              href="#" 
              className="transition-all duration-300 w-28 cursor-pointer p-2 text-center text-xs font-medium leading-4 text-gray-500 hover:opacity-80"
            >
              Privacy Policy
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
