import { ReactNode } from "react";
import { clsx } from "clsx";
import Header from "../component/layout/Header";
import Sidebar from "../component/layout/Sidebar";

interface LayoutProps {
  children: ReactNode;
  className?: string;
}

const Layout = ({ children, className }: LayoutProps) => {
  return (
    <div className={clsx(
      "flex h-screen bg-gray-100",
      className
    )}>
      <aside className="hidden lg:block">
        <Sidebar />
      </aside>

      <div className="flex-1 flex flex-col">
        <Header />
        
        <main className={clsx(
          "p-6 overflow-y-scroll h-full",
        )}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
