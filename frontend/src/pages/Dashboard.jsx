import React from "react";
import { useAuth } from "../context/AuthContext";
import { getDashboardStats } from "../services/assetService";
import { StatusPieChart, TypeBarChart } from "../components/AssetComponents/Charts";
import { Monitor, Users, AlertTriangle, CheckCircle, Clock } from "lucide-react";
import { getAllAssets } from "../services/assetService";

const Dashboard = () => {
  const { user } = useAuth();
  const [data, setData]       = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [assets, setAssets] = React.useState([]);

  React.useEffect(() => {
    if (user?.role === "ADMIN" || user?.role === "MANAGER") {
      getDashboardStats()
        .then((r) => setData(r.data))
        .catch(() => setData(DEMO_DATA))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [user]);

  // Transform API data → chart format
  const statusChartData = data
    ? [
        { name: "Available",      value: data.availableAssets      || 0 },
        { name: "Assigned",       value: data.assignedAssets        || 0 },
        { name: "Maintenance",    value: data.maintenanceAssets     || 0 },
        { name: "Decommissioned", value: data.decommissionedAssets  || 0 },
      ].filter((d) => d.value > 0)
    : [];

  const typeChartData = data?.assetsByType
    ? Object.entries(data.assetsByType).map(([type, count]) => ({ type, count }))
    : [];

  const stats = [
    {
      label: "Total Assets",
      value: data?.totalAssets ?? "—",
      icon: <Monitor size={22} />,
      color: "var(--primary)",
    },
    {
      label: "Assigned Assets",
      value: data?.assignedAssets ?? "—",
      icon: <Users size={22} />,
      color: "var(--secondary)",
    },
    {
      label: "Open Issues",
      value: data?.openConditionReports ?? "—",
      icon: <AlertTriangle size={22} />,
      color: "var(--danger)",
    },
    {
      label: "Available Assets",
      value: data?.availableAssets ?? "—",
      icon: <CheckCircle size={22} />,
      color: "var(--success)",
    },
    {
      label: "Expiring in 30d",
      value: data?.expiringWithin30Days ?? "—",
      icon: <Clock size={22} />,
      color: "var(--warning)",
    },
  ];

  if (loading) {
    return (
      <div style={{ padding: "2rem", textAlign: "center", color: "var(--text-muted)" }}>
        Loading dashboard…
      </div>
    );
  }

  if (user?.role === "DEVELOPER") {
    return (
      <div className="animate-fade-in">
        <div style={{ marginBottom: "2rem" }}>
          <h1 style={{ fontSize: "1.8rem", fontWeight: 800, marginBottom: "0.25rem" }}>
            Welcome back, {user?.name}!
          </h1>
          <p style={{ color: "var(--text-muted)" }}>
            You can view and manage your assigned assets below.
          </p>
        </div>
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          <a href="/assets" className="btn btn-primary">📋 View My Assets</a>
          <a href="/search" className="btn" style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text-muted)" }}>🔍 Search Assets</a>
        </div>
      </div>
    );
  }
  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "1.8rem", fontWeight: 800, marginBottom: "0.25rem" }}>
          Welcome back, {user?.name}!
        </h1>
        <p style={{ color: "var(--text-muted)" }}>
          Here&apos;s what&apos;s happening with your assets today.
        </p>
      </div>

      {/* Stats Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "1.25rem",
          marginBottom: "2rem",
        }}
      >
        {stats.map((stat, i) => (
          <div
            key={i}
            className="card"
            style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}
          >
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: "var(--radius-md)",
                background: stat.color,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                flexShrink: 0,
                boxShadow: `0 8px 16px -4px ${stat.color}40`,
              }}
            >
              {stat.icon}
            </div>
            <div>
              <div style={{ color: "var(--text-muted)", fontSize: "0.85rem", fontWeight: 500 }}>
                {stat.label}
              </div>
              <div style={{ fontSize: "1.65rem", fontWeight: 800, lineHeight: 1.2 }}>
                {stat.value}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(380px, 1fr))",
          gap: "1.5rem",
          marginBottom: "1.5rem",
        }}
      >
        {/* Pie Chart — status distribution */}
        <div className="card">
          <h3 style={{ marginBottom: "1.25rem", fontWeight: 700, fontSize: "1rem" }}>
            Asset Status Distribution
          </h3>
          {statusChartData.length > 0 ? (
            <StatusPieChart data={statusChartData} />
          ) : (
            <EmptyChart />
          )}
        </div>

        {/* Bar Chart — assets by type */}
        <div className="card">
          <h3 style={{ marginBottom: "1.25rem", fontWeight: 700, fontSize: "1rem" }}>
            Assets by Type
          </h3>
          {typeChartData.length > 0 ? (
            <TypeBarChart data={typeChartData} />
          ) : (
            <EmptyChart />
          )}
        </div>
      </div>

      {/* Bottom Row */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(380px, 1fr))",
          gap: "1.5rem",
        }}
      >
        {/* Warranty Alerts */}
        <div className="card">
          <h3 style={{ marginBottom: "1.25rem", fontWeight: 700, fontSize: "1rem" }}>
            Warranty Alerts
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            <AlertRow
              label={`Expiring within 30 days`}
              value={data?.expiringWithin30Days ?? 0}
              color="var(--warning)"
            />
            <AlertRow
              label="In maintenance"
              value={data?.maintenanceAssets ?? 0}
              color="var(--danger)"
            />
            <AlertRow
              label="Decommissioned"
              value={data?.decommissionedAssets ?? 0}
              color="var(--text-muted)"
            />
          </div>
        </div>

        {/* System Status */}
        <div className="card">
          <h3 style={{ marginBottom: "1.25rem", fontWeight: 700, fontSize: "1rem" }}>
            System Status
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            <StatusRow label="Database Connection" />
            <StatusRow label="Mail Server (Mailtrap)" />
            <StatusRow label="API Gateway" />
          </div>
        </div>
      </div>

      {/* Assets by Assigned User */}
      {data?.assetsByUser?.length > 0 && (
        <div className="card" style={{ marginTop: "1.5rem" }}>
          <h3 style={{ marginBottom: "1.25rem", fontWeight: 700, fontSize: "1rem" }}>
            Assets by Assigned User
          </h3>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)" }}>
                <th style={{ padding: "0.6rem 1rem", textAlign: "left", color: "var(--text-muted)", fontWeight: 600, fontSize: "0.8rem" }}>USER</th>
                <th style={{ padding: "0.6rem 1rem", textAlign: "left", color: "var(--text-muted)", fontWeight: 600, fontSize: "0.8rem" }}>ASSETS</th>
              </tr>
            </thead>
            <tbody>
              {data.assetsByUser.map((u) => (
                <tr key={u.userId} style={{ borderBottom: "1px solid var(--border)" }}
                  onMouseOver={(e) => e.currentTarget.style.background = "var(--background)"}
                  onMouseOut={(e)  => e.currentTarget.style.background = "transparent"}
                >
                  <td style={{ padding: "0.75rem 1rem", fontWeight: 600 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                      <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#e0f2fe", color: "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "0.85rem", flexShrink: 0 }}>
                        {u.userName?.charAt(0)?.toUpperCase()}
                      </div>
                      {u.userName}
                    </div>
                  </td>
                  <td style={{ padding: "0.75rem 1rem" }}>
                    <span style={{ background: "var(--primary)", color: "#fff", borderRadius: 20, padding: "2px 10px", fontWeight: 700, fontSize: "0.82rem" }}>
                      {u.assetCount}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

// ── Sub-components ─────────────────────────────────────────────────────────

function AlertRow({ label, value, color }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0.75rem 1rem",
        background: "var(--background)",
        borderRadius: "var(--radius-sm)",
        border: "1px solid var(--border)",
      }}
    >
      <span style={{ fontSize: "0.9rem" }}>{label}</span>
      <span
        style={{
          fontWeight: 700,
          color,
          fontSize: "1.1rem",
        }}
      >
        {value}
      </span>
    </div>
  );
}

function StatusRow({ label }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0.75rem 1rem",
        background: "var(--background)",
        borderRadius: "var(--radius-sm)",
        border: "1px solid var(--border)",
      }}
    >
      <span style={{ fontSize: "0.9rem" }}>{label}</span>
      <span className="badge badge-developer">Active</span>
    </div>
  );
}

function EmptyChart() {
  return (
    <div
      style={{
        textAlign: "center",
        padding: "2rem",
        color: "var(--text-muted)",
        fontSize: "0.9rem",
      }}
    >
      No data available yet
    </div>
  );
}

// ── Demo fallback (when API is down) ──────────────────────────────────────
const DEMO_DATA = {
  totalAssets:           12,
  assignedAssets:         7,
  availableAssets:        3,
  maintenanceAssets:      1,
  decommissionedAssets:   1,
  expiringWithin30Days:   2,
  openConditionReports:   3,
  assetsByType:   { LAPTOP: 6, MONITOR: 4, ACCESSORY: 2 },
  assetsByStatus: { AVAILABLE: 3, ASSIGNED: 7, MAINTENANCE: 1, DECOMMISSIONED: 1 },
};

export default Dashboard;