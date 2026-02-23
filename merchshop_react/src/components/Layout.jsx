import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { useState } from 'react';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const isPanelOpen = ['/cart', '/wishlist', '/orders'].includes(location.pathname);

  return (
    <div className="outer">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      {!isPanelOpen && <Navbar setSidebarOpen={setSidebarOpen} />}
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;