import React from 'react';
import { ShieldAlert, Clock, Info, CheckCircle } from 'lucide-react';

const NotificationMenu = ({ close }) => {
  const notifications = [
    { id: 1, title: 'Warranty Expiration', message: 'Laptop L-782 warranty expires in 15 days.', type: 'warning', icon: <Clock size={16} />, time: '2h ago' },
    { id: 2, title: 'Asset Reassigned', message: 'Dell Monitor M-102 moved from Alice to Bob.', type: 'info', icon: <Info size={16} />, time: '5h ago' },
    { id: 3, title: 'New Issue Reported', message: 'Developer reported battery drain on L-501.', type: 'danger', icon: <ShieldAlert size={16} />, time: '1d ago' },
  ];

  return (
    <div className="animate-fade-in" style={{
      position: 'absolute',
      top: '120%',
      right: 0,
      width: '320px',
      background: 'white',
      borderRadius: 'var(--radius-md)',
      boxShadow: 'var(--shadow-lg)',
      border: '1px solid var(--border)',
      zIndex: 101,
      overflow: 'hidden'
    }}>
      <div style={{ padding: '1rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: '700' }}>Notifications</h3>
        <button style={{ fontSize: '0.75rem', color: 'var(--primary)', background: 'none', fontWeight: '600' }}>Mark all read</button>
      </div>

      <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
        {notifications.map((n) => (
          <div key={n.id} style={{
            padding: '1rem',
            borderBottom: '1px solid var(--border)',
            display: 'flex',
            gap: '1rem',
            cursor: 'pointer',
            transition: 'background 0.2s'
          }} onMouseOver={(e) => e.currentTarget.style.background = '#f8fafc'} onMouseOut={(e) => e.currentTarget.style.background = 'white'}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              background: n.type === 'warning' ? '#fef3c7' : (n.type === 'danger' ? '#fee2e2' : '#e0f2fe'),
              color: n.type === 'warning' ? '#d97706' : (n.type === 'danger' ? '#ef4444' : '#0ea5e9')
            }}>
              {n.icon}
            </div>
            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: '700', marginBottom: '0.25rem' }}>{n.title}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>{n.message}</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: '500' }}>{n.time}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ padding: '0.75rem', textAlign: 'center', background: '#f8fafc' }}>
        <button style={{ fontSize: '0.8rem', color: 'var(--text-muted)', background: 'none', fontWeight: '600' }}>View all notifications</button>
      </div>
      
      {/* Overlay to close when clicking outside (simplistic) */}
      <div 
        onClick={close}
        style={{ position: 'fixed', inset: 0, zIndex: -1 }}
      ></div>
    </div>
  );
};

export default NotificationMenu;
