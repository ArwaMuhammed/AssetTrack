import { useState } from "react";

const TYPES    = ["", "LAPTOP", "MONITOR", "ACCESSORY"];
const STATUSES = ["", "AVAILABLE", "ASSIGNED", "MAINTENANCE", "DECOMMISSIONED"];

export default function SearchBar({ onSearch, loading }) {
  const [query,  setQuery]  = useState("");
  const [type,   setType]   = useState("");
  const [status, setStatus] = useState("");
  const [brand,  setBrand]  = useState("");
  const [model,  setModel]  = useState("");
  const [open,   setOpen]   = useState(false);

  const handleSearch = (e) => {
    e?.preventDefault();
    onSearch({ query, type, status, brand, model });
  };

  const handleReset = () => {
    setQuery(""); setType(""); setStatus(""); setBrand(""); setModel("");
    onSearch({});
  };

  const selectStyle = {
    background: "var(--background)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius-sm)",
    padding: "8px 12px",
    color: "var(--text-main)",
    fontFamily: "inherit",
    fontSize: "0.85rem",
    outline: "none",
    cursor: "pointer",
    width: "100%",
    boxSizing: "border-box",
  };

  const inputStyle = {
    ...selectStyle,
    cursor: "text",
  };

  return (
    <form onSubmit={handleSearch} style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
      {/* Main search row */}
      <div style={{ display: "flex", gap: "0.6rem" }}>
        <div style={{ flex: 1, position: "relative" }}>
          <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", fontSize: 16 }}>🔍</span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by brand or model..."
            style={{
              width: "100%", boxSizing: "border-box",
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-sm)",
              padding: "10px 14px 10px 42px",
              color: "var(--text-main)",
              fontFamily: "inherit",
              fontSize: "0.9rem",
              outline: "none",
              transition: "border-color 0.2s",
            }}
            onFocus={(e) => (e.target.style.borderColor = "var(--primary)")}
            onBlur={(e)  => (e.target.style.borderColor = "var(--border)")}
          />
        </div>

        <button
          type="button"
          onClick={() => setOpen(!open)}
          style={{
            background: open ? "#eff6ff" : "var(--surface)",
            border: "1px solid",
            borderColor: open ? "var(--primary)" : "var(--border)",
            borderRadius: "var(--radius-sm)",
            padding: "8px 16px",
            color: open ? "var(--primary)" : "var(--text-muted)",
            fontFamily: "inherit",
            fontWeight: 600,
            fontSize: "0.85rem",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 6,
            transition: "all 0.2s",
            whiteSpace: "nowrap",
          }}
        >
          ⚙ Filters {open ? "▲" : "▼"}
        </button>

        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary"
          style={{ whiteSpace: "nowrap", opacity: loading ? 0.7 : 1 }}
        >
          {loading ? "Searching…" : "Search"}
        </button>
      </div>

      {/* Advanced filters panel */}
      {open && (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
          gap: "0.75rem",
          padding: "1rem",
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-sm)",
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
              placeholder="e.g. Apple…"
              style={inputStyle}
            />
          </FilterGroup>

          <FilterGroup label="Model">
            <input
              value={model}
              onChange={(e) => setModel(e.target.value)}
              placeholder="e.g. MacBook…"
              style={inputStyle}
            />
          </FilterGroup>

          <FilterGroup label=" ">
            <button
              type="button"
              onClick={handleReset}
              style={{
                ...selectStyle,
                color: "var(--danger)",
                borderColor: "#fca5a5",
                background: "#fee2e2",
                textAlign: "center",
                cursor: "pointer",
                fontWeight: 600,
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
    <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
      <label style={{
        fontSize: "0.72rem",
        color: "var(--text-muted)",
        fontWeight: 600,
        textTransform: "uppercase",
        letterSpacing: 0.8,
      }}>
        {label}
      </label>
      {children}
    </div>
  );
}