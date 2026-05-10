import React, { useState, useEffect } from 'react';
import { ShieldAlert, Clock, Info, CheckCircle } from 'lucide-react';
import api from '../../services/api';

const NotificationMenu = ({ close }) => {
  const [notifications, setNotifications] = useState([]);
  
  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await api.get('/notifications/unread');
      setNotifications(response.data);
    } catch (error) {
      console.error('Failed to fetch notifications', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.put('/notifications/read-all');
      setNotifications([]);
    } catch (error) {
      console.error('Failed to mark all as read', error);
    }
  };

  const markAsRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications(notifications.filter(n => n.id !== id));
    } catch (error) {
      console.error('Failed to mark as read', error);
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'WARRANTY_EXPIRATION': return <Clock size={16} />;
      case 'LOW_STOCK': return <ShieldAlert size={16} />;
      case 'STATUS_CHANGE': return <Info size={16} />;
      case 'ASSIGNMENT': return <CheckCircle size={16} />;
      default: return <Info size={16} />;
    }
  };

  const getColorStyles = (type) => {
    if (type === 'WARRANTY_EXPIRATION') return { background: '#fef3c7', color: '#d97706' };
    if (type === 'LOW_STOCK') return { background: '#fee2e2', color: '#ef4444' };
    return { background: '#e0f2fe', color: '#0ea5e9' };
  };
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
        {notifications.length > 0 && (
          <button onClick={markAllAsRead} style={{ fontSize: '0.75rem', color: 'var(--primary)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: '600' }}>Mark all read</button>
        )}
      </div>

      <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
        {notifications.length === 0 && (
          <div style={{ padding: '2rem 1rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            No new notifications
          </div>
        )}
        {notifications.map((n) => (
          <div key={n.id}
            onClick={() => markAsRead(n.id)}
            style={{
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
              ...getColorStyles(n.type)
            }}>
              {getIcon(n.type)}
            </div>
            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: '700', marginBottom: '0.25rem' }}>{n.title}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>{n.message}</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: '500' }}>{new Date(n.createdAt).toLocaleDateString()}</div>
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
