import { useEffect, useState, useContext } from "react";
import { useAuth } from "../context/AuthContext";
import { getAllReports, getMyReports, updateReportStatus } from "../services/assetService";

const STATUS_STYLES = {
  OPEN:        { label: "Open",        color: "#ef4444", bg: "#fee2e2" },
  IN_PROGRESS: { label: "In Progress", color: "#d97706", bg: "#fef3c7" },
  RESOLVED:    { label: "Resolved",    color: "#16a34a", bg: "#dcfce7" },
  REJECTED:    { label: "Rejected",    color: "#64748b", bg: "#f1f5f9" },
};

export default function Reports() {
  const { user }              = useAuth();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter]   = useState("ALL");
  const [error, setError]     = useState(null);

  const canManage = ["ADMIN", "MANAGER"].includes(user?.role);

  useEffect(() => {
    const fetch = canManage ? getAllReports : getMyReports;
    fetch()
      .then((r) => setReports(r.data))
      .catch(() => { setError("Failed to load reports."); setReports([]); })
      .finally(() => setLoading(false));
  }, [canManage]);

  const changeStatus = async (reportId, status) => {
    try {
      await updateReportStatus(reportId, status);
      setReports((prev) =>
        prev.map((r) => (r.id === reportId ? { ...r, status } : r))
      );
    } catch {
      /* keep old state */
    }
  };

  const filtered =
    filter === "ALL" ? reports : reports.filter((r) => r.status === filter);

  const counts = {
    ALL:         reports.length,
    OPEN:        reports.filter((r) => r.status === "OPEN").length,
    IN_PROGRESS: reports.filter((r) => r.status === "IN_PROGRESS").length,
    RESOLVED:    reports.filter((r) => r.status === "RESOLVED").length,
    REJECTED:    reports.filter((r) => r.status === "REJECTED").length,
  };

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div style={{ marginBottom: "1.75rem" }}>
        <h1 style={{ fontSize: "1.8rem", fontWeight: 800, marginBottom: "0.25rem" }}>
          {canManage ? "Issue Reports" : "My Reports"}
        </h1>
        <p style={{ color: "var(--text-muted)" }}>
          {canManage
            ? "All asset issues reported by team members"
            : "Issues you have submitted"}
        </p>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "1.5rem" }}>
        {["ALL", "OPEN", "IN_PROGRESS", "RESOLVED", "REJECTED"].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            style={{
              padding: "6px 14px",
              borderRadius: "var(--radius-sm)",
              border: "1px solid",
              borderColor: filter === s ? "var(--primary)" : "var(--border)",
              background: filter === s ? "var(--primary)" : "var(--surface)",
              color: filter === s ? "white" : "var(--text-muted)",
              fontWeight: 600,
              fontSize: "0.82rem",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            {s.replace("_", " ")}{" "}
            <span style={{ opacity: 0.75 }}>({counts[s] ?? 0})</span>
          </button>
        ))}
      </div>

      {/* Error */}
      {error && (
        <div
          style={{
            padding: "0.75rem 1rem",
            background: "#fee2e2",
            border: "1px solid #fca5a5",
            borderRadius: "var(--radius-sm)",
            color: "#ef4444",
            marginBottom: "1rem",
            fontSize: "0.9rem",
          }}
        >
          {error}
        </div>
      )}

      {/* List */}
      {loading ? (
        <p style={{ color: "var(--text-muted)" }}>Loading…</p>
      ) : filtered.length === 0 ? (
        <div
          className="card"
          style={{ textAlign: "center", padding: "3rem", color: "var(--text-muted)" }}
        >
          <p style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>✅</p>
          <p style={{ fontWeight: 600 }}>No issues here</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {filtered.map((report) => (
            <ReportCard
              key={report.id}
              report={report}
              canManage={canManage}
              onStatusChange={changeStatus}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ── Report Card ───────────────────────────────────────────────────────────────
function ReportCard({ report, canManage, onStatusChange }) {
  const s = STATUS_STYLES[report.status] || STATUS_STYLES.OPEN;

  return (
    <div className="card" style={{ padding: "1.25rem 1.5rem" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          flexWrap: "wrap",
          gap: "0.75rem",
        }}
      >
        {/* Left: info */}
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.4rem", flexWrap: "wrap" }}>
            <span
              style={{
                padding: "2px 10px",
                borderRadius: 999,
                fontSize: "0.75rem",
                fontWeight: 700,
                color: s.color,
                background: s.bg,
              }}
            >
              {s.label}
            </span>
            <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
              {report.asset?.brand} {report.asset?.model} · {report.asset?.serialNumber}
            </span>
          </div>

          <p style={{ margin: 0, fontWeight: 700, fontSize: "0.95rem" }}>
            {report.issueTitle}
          </p>
          <p style={{ margin: "4px 0 0", fontSize: "0.88rem", color: "var(--text-muted)" }}>
            {report.description}
          </p>
          <p style={{ margin: "6px 0 0", fontSize: "0.8rem", color: "var(--text-muted)" }}>
            Reported by {report.reportedBy?.name} ·{" "}
            {report.createdAt ? new Date(report.createdAt).toLocaleDateString() : "—"}
          </p>
        </div>

        {/* Right: actions */}
        {canManage && (
          <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
            {report.status !== "IN_PROGRESS" && (
              <ActionBtn
                label="In Progress"
                color="#d97706"
                bg="#fef3c7"
                onClick={() => onStatusChange(report.id, "IN_PROGRESS")}
              />
            )}
            {report.status !== "RESOLVED" && (
              <ActionBtn
                label="Resolve"
                color="#16a34a"
                bg="#dcfce7"
                onClick={() => onStatusChange(report.id, "RESOLVED")}
              />
            )}
            {report.status !== "REJECTED" && (
              <ActionBtn
                label="Reject"
                color="#64748b"
                bg="#f1f5f9"
                onClick={() => onStatusChange(report.id, "REJECTED")}
              />
            )}
            {report.status !== "OPEN" && (
              <ActionBtn
                label="Reopen"
                color="#ef4444"
                bg="#fee2e2"
                onClick={() => onStatusChange(report.id, "OPEN")}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function ActionBtn({ label, color, bg, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "5px 12px",
        borderRadius: "var(--radius-sm)",
        border: `1px solid ${color}44`,
        background: bg,
        color,
        fontWeight: 600,
        fontSize: "0.78rem",
        cursor: "pointer",
        transition: "all 0.2s",
      }}
    >
      {label}
    </button>
  );
}