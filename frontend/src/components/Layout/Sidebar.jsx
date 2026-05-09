import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  LayoutDashboard, 
  Monitor, 
  Users, 
  History, 
  AlertTriangle, 
  Settings,
  Package,
  Cpu, 
  Search
} from 'lucide-react';

const Sidebar = ({ isOpen }) => {
  const { user } = useAuth();

  const menuItems = [
    { name: 'Dashboard',      icon: <LayoutDashboard size={20} />, path: '/',           roles: ['ADMIN', 'MANAGER'] },
    { name: 'Assets',         icon: <Monitor size={20} />,         path: '/assets',     roles: ['ADMIN', 'MANAGER', 'DEVELOPER'] },
    { name: 'Search',         icon: <Search size={20} />,          path: '/search',     roles: ['ADMIN', 'MANAGER', 'DEVELOPER'] },
    { name: 'Allocations',    icon: <History size={20} />,         path: '/allocations',roles: ['ADMIN', 'MANAGER'] },
    { name: 'Users',          icon: <Users size={20} />,           path: '/users',      roles: ['ADMIN'] },
    { name: 'Reports',        icon: <AlertTriangle size={20} />,   path: '/reports',    roles: ['ADMIN', 'MANAGER', 'DEVELOPER'] },
    { name: 'Inventory Sync', icon: <Cpu size={20} />,             path: '/sync',       roles: ['ADMIN'] },
    { name: 'Settings',       icon: <Settings size={20} />,        path: '/settings',   roles: ['ADMIN', 'MANAGER', 'DEVELOPER'] },
  ];

  return (
    <aside style={{
      width: isOpen ? 'var(--sidebar-width)' : '0',
      height: 'calc(100vh - var(--navbar-height))',
      background: 'var(--surface)',
      borderRight: '1px solid var(--border)',
      transition: 'all 0.3s ease',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      position: 'sticky',
      top: 'var(--navbar-height)',
      zIndex: 99
    }}>
      <div style={{ padding: '1.5rem 1rem' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          padding: '0 0.5rem 1.5rem',
          color: 'var(--primary)',
          borderBottom: '1px solid var(--border)',
          marginBottom: '1rem'
        }}>
          <Package size={24} strokeWidth={2.5} />
          <span style={{ fontWeight: '800', fontSize: '1.25rem', letterSpacing: '-0.5px', color: 'var(--text-main)' }}>AssetTrack</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          {menuItems.filter(item => item.roles.includes(user?.role)).map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.8rem 1rem',
                borderRadius: 'var(--radius-sm)',
                color: isActive ? 'var(--primary)' : 'var(--text-muted)',
                background: isActive ? '#eff6ff' : 'transparent',
                fontWeight: isActive ? '600' : '500',
                transition: 'all 0.2s',
                fontSize: '0.95rem'
              })}
              onMouseOver={(e) => {
                if (!e.currentTarget.classList.contains('active')) {
                  e.currentTarget.style.background = '#f8fafc';
                  e.currentTarget.style.color = 'var(--text-main)';
                }
              }}
              onMouseOut={(e) => {
                if (!e.currentTarget.classList.contains('active')) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = 'var(--text-muted)';
                }
              }}
            >
              {item.icon}
              <span>{item.name}</span>
            </NavLink>
          ))}
        </div>
      </div>

      <div style={{ marginTop: 'auto', padding: '1.5rem' }}>
        <div style={{
          background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
          borderRadius: 'var(--radius-md)',
          padding: '1.25rem',
          color: 'white',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ fontWeight: '700', fontSize: '0.9rem', marginBottom: '0.25rem' }}>Need Help?</div>
            <div style={{ fontSize: '0.75rem', opacity: 0.9, marginBottom: '0.75rem' }}>Check our documentation for asset management.</div>
            <button style={{
              background: 'white',
              color: 'var(--primary)',
              padding: '0.4rem 0.8rem',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.75rem',
              fontWeight: '700'
            }}>Read Docs</button>
          </div>
          <Package size={80} style={{ position: 'absolute', right: '-20px', bottom: '-20px', opacity: 0.1, transform: 'rotate(-15deg)' }} />
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
