import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <div style={{ display: 'flex', flex: 1 }}>
        <Sidebar isOpen={sidebarOpen} />
        <main style={{ 
          flex: 1, 
          padding: '2rem', 
          background: 'var(--background)',
          minWidth: 0 // Prevent content from breaking flexbox
        }}>
          <div className="animate-fade-in">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
