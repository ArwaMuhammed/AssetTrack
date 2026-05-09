import { useState } from "react";

const TYPES    = ["", "LAPTOP", "MONITOR", "ACCESSORY"];
const STATUSES = ["", "AVAILABLE", "ASSIGNED", "MAINTENANCE", "DECOMMISSIONED"];

export default function SearchBar({ onSearch, loading }) {
  const [query,  setQuery]  = useState("");
  const [type,   setType]   = useState("");
  const [status, setStatus] = useState("");
  const [brand,  setBrand]  = useState("");
  const [open,   setOpen]   = useState(false);

  const handleSearch = (e) => {
    e?.preventDefault();
    onSearch({ query, type, status, brand });
  };

  const handleReset = () => {
    setQuery(""); setType(""); setStatus(""); setBrand("");
    onSearch({});
  };

  const selectStyle = {
    background: "#0d0f14", border: "1px solid #1e2028",
    borderRadius: 8, padding: "8px 12px", color: "#cbd5e1",
    fontFamily: "'JetBrains Mono', monospace", fontSize: 12,
    outline: "none", cursor: "pointer",
  };

  return (
    <form onSubmit={handleSearch} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {/* Main search row */}
      <div style={{ display: "flex", gap: 10 }}>
        <div style={{ flex: 1, position: "relative" }}>
          <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#4b5563", fontSize: 16 }}>🔍</span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by serial number, model, user..."
            style={{
              width: "100%", boxSizing: "border-box",
              background: "#0d0f14", border: "1px solid #1e2028",
              borderRadius: 10, padding: "10px 14px 10px 42px",
              color: "#f1f5f9", fontFamily: "'JetBrains Mono', monospace",
              fontSize: 13, outline: "none",
              transition: "border-color 0.2s",
            }}
            onFocus={(e) => (e.target.style.borderColor = "#3b82f6")}
            onBlur={(e)  => (e.target.style.borderColor = "#1e2028")}
          />
        </div>

        <button
          type="button"
          onClick={() => setOpen(!open)}
          style={{
            ...selectStyle, display: "flex", alignItems: "center", gap: 6,
            padding: "8px 16px", transition: "border-color 0.2s",
            borderColor: open ? "#3b82f6" : "#1e2028",
          }}
        >
          <span>⚙</span> Filters {open ? "▲" : "▼"}
        </button>

        <button
          type="submit"
          disabled={loading}
          style={{
            background: "#3b82f6", border: "none", borderRadius: 10,
            padding: "10px 22px", color: "#fff", fontFamily: "'Syne', sans-serif",
            fontWeight: 700, fontSize: 13, cursor: "pointer",
            transition: "background 0.2s", whiteSpace: "nowrap",
          }}
          onMouseEnter={(e) => (e.target.style.background = "#2563eb")}
          onMouseLeave={(e) => (e.target.style.background = "#3b82f6")}
        >
          {loading ? "Searching…" : "Search"}
        </button>
      </div>

      {/* Advanced filters panel */}
      {open && (
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
          gap: 10, padding: "14px 16px",
          background: "#0d0f14", border: "1px solid #1e2028", borderRadius: 10,
          animation: "fadeIn 0.15s ease",
        }}>
          <FilterGroup label="Type">
            <select value={type} onChange={(e) => setType(e.target.value)} style={selectStyle}>
              {TYPES.map((t) => <option key={t} value={t}>{t || "All types"}</option>)}
            </select>
          </FilterGroup>

          <FilterGroup label="Status">
            <select value={status} onChange={(e) => setStatus(e.target.value)} style={selectStyle}>
              {STATUSES.map((s) => <option key={s} value={s}>{s || "All statuses"}</option>)}
            </select>
          </FilterGroup>

          <FilterGroup label="Brand">
            <input
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              placeholder="e.g. Dell, Apple…"
              style={{ ...selectStyle, width: "100%", boxSizing: "border-box" }}
            />
          </FilterGroup>

          <FilterGroup label=" ">
            <button
              type="button"
              onClick={handleReset}
              style={{
                ...selectStyle, color: "#ef4444", borderColor: "#ef444433",
                width: "100%", textAlign: "center", cursor: "pointer",
              }}
            >
              ✕ Reset
            </button>
          </FilterGroup>
        </div>
      )}
    </form>
  );
}

function FilterGroup({ label, children }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
      <label style={{ fontSize: 10, color: "#4b5563", fontFamily: "'JetBrains Mono', monospace", textTransform: "uppercase", letterSpacing: 0.8 }}>
        {label}
      </label>
      {children}
    </div>
  );
}
