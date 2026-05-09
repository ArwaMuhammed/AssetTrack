import { useNavigate } from "react-router-dom";

const STATUS_STYLES = {
  AVAILABLE:    { label: "Available",    color: "#22c55e", bg: "rgba(34,197,94,0.1)" },
  ASSIGNED:     { label: "Assigned",     color: "#f59e0b", bg: "rgba(245,158,11,0.1)" },
  MAINTENANCE:  { label: "Maintenance",  color: "#ef4444", bg: "rgba(239,68,68,0.1)"  },
  DECOMMISSIONED:{ label: "Decommissioned", color: "#6b7280", bg: "rgba(107,114,128,0.1)" },
};

const TYPE_ICONS = {
  LAPTOP:    "💻",
  MONITOR:   "🖥️",
  ACCESSORY: "🖱️",
};

export default function AssetCard({ asset, compact = false }) {
  const navigate = useNavigate();
  const status = STATUS_STYLES[asset.status] || STATUS_STYLES.AVAILABLE;
  const icon   = TYPE_ICONS[asset.type] || "📦";

  const isExpiringSoon =
    asset.warrantyExpiration &&
    new Date(asset.warrantyExpiration) - Date.now() < 30 * 24 * 60 * 60 * 1000;
  const isExpired =
    asset.warrantyExpiration && new Date(asset.warrantyExpiration) < new Date();

  return (
    <div
      onClick={() => navigate(`/assets/${asset.id}`)}
      style={{
        background: "#111318",
        border: "1px solid #1e2028",
        borderRadius: 12,
        padding: compact ? "14px 18px" : "20px 24px",
        cursor: "pointer",
        transition: "border-color 0.2s, transform 0.15s",
        position: "relative",
        overflow: "hidden",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "#3b82f6";
        e.currentTarget.style.transform = "translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "#1e2028";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      {/* Accent line */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0,
        height: 2, background: "#3b82f6", borderRadius: "12px 12px 0 0",
      }} />

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginTop: 6 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: compact ? 22 : 28 }}>{icon}</span>
          <div>
            <p style={{ margin: 0, fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#6b7280", letterSpacing: 1, textTransform: "uppercase" }}>
              {asset.brand}
            </p>
            <h3 style={{ margin: "2px 0 0", fontFamily: "'Syne', sans-serif", fontSize: compact ? 14 : 16, color: "#f1f5f9", fontWeight: 700 }}>
              {asset.model}
            </h3>
          </div>
        </div>

        <span style={{
          padding: "3px 10px", borderRadius: 20, fontSize: 11,
          fontFamily: "'JetBrains Mono', monospace", fontWeight: 600,
          color: status.color, background: status.bg,
        }}>
          {status.label}
        </span>
      </div>

      {!compact && (
        <div style={{ marginTop: 16, display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px 16px" }}>
          <InfoRow label="Serial" value={asset.serialNumber} mono />
          <InfoRow label="Type"   value={asset.type} />
          <InfoRow label="Assigned To" value={asset.assignedUser?.name || "—"} />
          <InfoRow
            label="Warranty"
            value={
              asset.warrantyExpiration
                ? new Date(asset.warrantyExpiration).toLocaleDateString()
                : "—"
            }
            warn={isExpiringSoon && !isExpired}
            error={isExpired}
          />
        </div>
      )}

      {compact && (
        <p style={{ margin: "8px 0 0", fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#6b7280" }}>
          {asset.serialNumber} · {asset.assignedUser?.name || "Unassigned"}
        </p>
      )}

      {(isExpiringSoon || isExpired) && (
        <div style={{
          marginTop: 12, padding: "6px 10px", borderRadius: 6,
          background: isExpired ? "rgba(239,68,68,0.08)" : "rgba(245,158,11,0.08)",
          border: `1px solid ${isExpired ? "#ef4444" : "#f59e0b"}22`,
          fontSize: 11, color: isExpired ? "#ef4444" : "#f59e0b",
          fontFamily: "'JetBrains Mono', monospace",
        }}>
          ⚠ {isExpired ? "Warranty expired" : "Warranty expiring within 30 days"}
        </div>
      )}
    </div>
  );
}

function InfoRow({ label, value, mono, warn, error }) {
  return (
    <div>
      <p style={{ margin: 0, fontSize: 10, color: "#4b5563", fontFamily: "'JetBrains Mono', monospace", textTransform: "uppercase", letterSpacing: 0.8 }}>{label}</p>
      <p style={{
        margin: "2px 0 0", fontSize: 12,
        fontFamily: mono ? "'JetBrains Mono', monospace" : "inherit",
        color: error ? "#ef4444" : warn ? "#f59e0b" : "#cbd5e1",
      }}>
        {value}
      </p>
    </div>
  );
}
