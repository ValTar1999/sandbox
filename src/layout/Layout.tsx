import { ReactNode } from "react";
import { Outlet } from "react-router-dom";
import { clsx } from "clsx";
import Header from "../component/layout/Header";
import Sidebar from "../component/layout/Sidebar";

interface LayoutProps {
  children: ReactNode;
  className?: string;
}

const Layout = ({ children, className }: LayoutProps) => {
  const content = children !== undefined ? children : <Outlet />;

  return (
    <div className={clsx(
      "flex h-screen bg-gray-100",
      className
    )}>
      <aside>
        <Sidebar />
      </aside>

      <div className="flex-1 flex flex-col">
        <Header />
        
        <main className={clsx(
          "p-6 overflow-y-scroll h-full",
        )}>
          {content}
        </main>
      </div>
    </div>
  );
};

export default Layout;
