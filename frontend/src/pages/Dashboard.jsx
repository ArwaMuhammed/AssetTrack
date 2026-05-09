import React from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Monitor, Users, AlertTriangle, CheckCircle } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = React.useState(null);

  React.useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await api.get('/dashboard');
        setDashboardData(response.data);
      } catch (err) {
        console.error(err);
      }
    };
    if (user?.role === 'ADMIN' || user?.role === 'MANAGER') {
      fetchDashboard();
    }
  }, [user]);

  const stats = [
    { label: 'Total Assets', value: dashboardData?.totalAssets || '124', icon: <Monitor />, color: 'var(--primary)' },
    { label: 'Active Users', value: dashboardData?.assignedAssets || '48', icon: <Users />, color: 'var(--secondary)' },
    { label: 'Pending Issues', value: dashboardData?.openConditionReports || '5', icon: <AlertTriangle />, color: 'var(--danger)' },
    { label: 'In Warranty', value: dashboardData?.availableAssets || '112', icon: <CheckCircle />, color: 'var(--success)' },
  ];

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '0.5rem' }}>Welcome back, {user?.name}!</h1>
        <p style={{ color: 'var(--text-muted)' }}>Here's what's happening with your assets today.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        {stats.map((stat, i) => (
          <div key={i} className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: 'var(--radius-md)',
              background: stat.color,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              boxShadow: `0 8px 16px -4px ${stat.color}40`
            }}>
              {stat.icon}
            </div>
            <div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: '500' }}>{stat.label}</div>
              <div style={{ fontSize: '1.75rem', fontWeight: '800' }}>{stat.value}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
        <div className="card">
          <h3 style={{ marginBottom: '1.5rem', fontWeight: '700' }}>Recent Asset Allocations</h3>
          <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem' }}>
             [Chart/Table Placeholder for Person B]
          </div>
        </div>
        <div className="card">
          <h3 style={{ marginBottom: '1.5rem', fontWeight: '700' }}>System Status</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', background: '#f8fafc', borderRadius: 'var(--radius-sm)' }}>
              <span>Database Connection</span>
              <span className="badge badge-developer">Active</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', background: '#f8fafc', borderRadius: 'var(--radius-sm)' }}>
              <span>Mail Server (Mailtrap)</span>
              <span className="badge badge-developer">Active</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', background: '#f8fafc', borderRadius: 'var(--radius-sm)' }}>
              <span>API Gateway</span>
              <span className="badge badge-developer">Active</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
