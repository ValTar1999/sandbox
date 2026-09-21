import { ReactNode } from 'react';
import { Outlet } from 'react-router-dom';
import { clsx } from 'clsx';
import Header from '../components/layout/Header';
import Sidebar from '../components/layout/Sidebar';

interface LayoutProps {
  children?: ReactNode;
  className?: string;
}

const Layout = ({ children, className }: LayoutProps) => {
  const content = children !== undefined ? children : <Outlet />;

  return (
    <div className={clsx('flex h-screen bg-gray-100', className)}>
      <aside>
        <Sidebar />
      </aside>

      <div className="flex-1 flex flex-col">
        <Header />

        <main className={clsx('h-full overflow-x-hidden overflow-y-auto p-6')}>
          {content}
        </main>
      </div>
    </div>
  );
};

export default Layout;
