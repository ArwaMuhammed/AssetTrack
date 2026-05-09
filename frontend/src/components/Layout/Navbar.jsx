import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Bell, User, LogOut, Search, Menu } from 'lucide-react';
import NotificationMenu from '../Notifications/NotificationMenu';

const Navbar = ({ toggleSidebar }) => {
  const { user, logout } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <nav style={{
      height: 'var(--navbar-height)',
      background: 'var(--surface)',
      borderBottom: '1px solid var(--border)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 2rem',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxShadow: 'var(--shadow-sm)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button onClick={toggleSidebar} style={{ background: 'none', color: 'var(--text-muted)' }}>
          <Menu size={24} />
        </button>
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search assets..."
            style={{
              padding: '0.5rem 1rem 0.5rem 2.5rem',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border)',
              background: 'var(--background)',
              width: '300px',
              fontSize: '0.9rem'
            }}
          />
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <div style={{ position: 'relative' }}>
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            style={{
              background: 'none',
              color: 'var(--text-muted)',
              position: 'relative',
              display: 'flex',
              padding: '0.5rem',
              borderRadius: '50%',
              transition: 'background 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.background = '#f1f5f9'}
            onMouseOut={(e) => e.currentTarget.style.background = 'none'}
          >
            <Bell size={22} />
            <span style={{
              position: 'absolute',
              top: '6px',
              right: '6px',
              width: '10px',
              height: '10px',
              background: 'var(--danger)',
              border: '2px solid white',
              borderRadius: '50%'
            }}></span>
          </button>
          {showNotifications && <NotificationMenu close={() => setShowNotifications(false)} />}
        </div>

        <div style={{ position: 'relative' }}>
          <button 
            onClick={() => setShowUserMenu(!showUserMenu)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.4rem 0.8rem',
              borderRadius: 'var(--radius-md)',
              background: 'none',
              border: '1px solid transparent',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.background = '#f1f5f9'}
            onMouseOut={(e) => e.currentTarget.style.background = 'none'}
          >
            <div style={{
              width: '35px',
              height: '35px',
              borderRadius: '50%',
              background: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 'bold'
            }}>
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div style={{ textAlign: 'left', display: 'none', sm: 'block' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: '600' }}>{user?.name}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{user?.role}</div>
            </div>
          </button>

          {showUserMenu && (
            <div className="animate-fade-in" style={{
              position: 'absolute',
              top: '120%',
              right: 0,
              width: '200px',
              background: 'white',
              borderRadius: 'var(--radius-md)',
              boxShadow: 'var(--shadow-lg)',
              border: '1px solid var(--border)',
              padding: '0.5rem',
              zIndex: 101
            }}>
              <div style={{ padding: '0.75rem', borderBottom: '1px solid var(--border)', marginBottom: '0.5rem' }}>
                <div style={{ fontWeight: '600' }}>{user?.name}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{user?.email}</div>
              </div>
              <button style={{
                width: '100%',
                textAlign: 'left',
                padding: '0.75rem',
                borderRadius: 'var(--radius-sm)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                background: 'none',
                color: 'var(--text-main)',
                fontSize: '0.9rem'
              }} onMouseOver={(e) => e.currentTarget.style.background = '#f1f5f9'} onMouseOut={(e) => e.currentTarget.style.background = 'none'}>
                <User size={18} /> Profile
              </button>
              <button 
                onClick={logout}
                style={{
                  width: '100%',
                  textAlign: 'left',
                  padding: '0.75rem',
                  borderRadius: 'var(--radius-sm)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  background: 'none',
                  color: 'var(--danger)',
                  fontSize: '0.9rem'
                }} onMouseOver={(e) => e.currentTarget.style.background = '#fef2f2'} onMouseOut={(e) => e.currentTarget.style.background = 'none'}>
                <LogOut size={18} /> Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
