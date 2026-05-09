import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllAssets, searchAssets } from "../services/assetService";
import AssetCard from "../components/AssetComponents/AssetCard";
import SearchBar from "../components/AssetComponents/SearchBar.jsx";

export default function Assets() {
  const [assets,  setAssets]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [view, setView] = useState("grid"); // "grid" | "list"
  const navigate = useNavigate();

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = () => {
    setLoading(true);
    getAllAssets()
      .then((r) => setAssets(r.data))
      .catch(() => setAssets(DEMO_ASSETS))
      .finally(() => setLoading(false));
  };

  const handleSearch = (params) => {
    const isEmpty = Object.values(params).every((v) => !v);
    if (isEmpty) return fetchAll();

    setSearching(true);
    searchAssets(params)
      .then((r) => setAssets(r.data))
      .catch(() => {})
      .finally(() => setSearching(false));
  };

  const btnStyle = (active) => ({
    background: active ? "#3b82f6" : "#111318",
    border: "1px solid #1e2028",
    borderRadius: 8, padding: "8px 12px",
    color: active ? "#fff" : "#6b7280",
    cursor: "pointer", fontSize: 16,
    transition: "all 0.2s",
  });

  return (
    <div style={{ padding: "32px", maxWidth: 1300, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
        <div>
          <h1 style={{ margin: 0, fontFamily: "'Syne', sans-serif", fontSize: 28, fontWeight: 800, color: "#f1f5f9" }}>
            Assets
          </h1>
          <p style={{ margin: "4px 0 0", fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: "#6b7280" }}>
            {assets.length} total records
          </p>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <button style={btnStyle(view === "grid")} onClick={() => setView("grid")} title="Grid view">⊞</button>
          <button style={btnStyle(view === "list")} onClick={() => setView("list")} title="List view">☰</button>
          <button
            onClick={() => navigate("/assets/add")}
            style={{
              background: "#3b82f6", border: "none", borderRadius: 10,
              padding: "10px 20px", color: "#fff",
              fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 13,
              cursor: "pointer", marginLeft: 8,
            }}
          >
            + Add Asset
          </button>
        </div>
      </div>

      {/* Search */}
      <div style={{ marginBottom: 24 }}>
        <SearchBar onSearch={handleSearch} loading={searching} />
      </div>

      {/* Content */}
      {loading ? (
        <div style={{ textAlign: "center", padding: 60, color: "#6b7280", fontFamily: "'JetBrains Mono', monospace" }}>
          Loading assets…
        </div>
      ) : assets.length === 0 ? (
        <div style={{
          textAlign: "center", padding: 60,
          background: "#111318", border: "1px solid #1e2028", borderRadius: 16,
        }}>
          <p style={{ fontSize: 40, margin: "0 0 12px" }}>📭</p>
          <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 18, color: "#f1f5f9", margin: "0 0 6px" }}>No assets found</p>
          <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: "#6b7280", margin: 0 }}>Try adjusting your search filters</p>
        </div>
      ) : view === "grid" ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 }}>
          {assets.map((a) => <AssetCard key={a.id} asset={a} />)}
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {assets.map((a) => <AssetCard key={a.id} asset={a} compact />)}
        </div>
      )}
    </div>
  );
}

// ── Demo data ─────────────────────────────────────────────────────────────────
const DEMO_ASSETS = [
  { id: 1, type: "LAPTOP",    brand: "Apple",   model: "MacBook Pro 14\"",  serialNumber: "SN-MBP-001", status: "ASSIGNED",    assignedUser: { name: "Nour Adel" },    warrantyExpiration: "2024-11-15" },
  { id: 2, type: "LAPTOP",    brand: "Dell",    model: "XPS 15",            serialNumber: "SN-XPS-002", status: "AVAILABLE",   assignedUser: null,                     warrantyExpiration: "2026-08-30" },
  { id: 3, type: "MONITOR",   brand: "LG",      model: "UltraWide 34\"",    serialNumber: "SN-LGM-003", status: "ASSIGNED",    assignedUser: { name: "Youssef Samy" }, warrantyExpiration: "2025-12-01" },
  { id: 4, type: "LAPTOP",    brand: "Lenovo",  model: "ThinkPad X1 Carbon",serialNumber: "SN-LNV-004", status: "MAINTENANCE", assignedUser: null,                     warrantyExpiration: "2025-04-20" },
  { id: 5, type: "ACCESSORY", brand: "Logitech",model: "MX Master 3",       serialNumber: "SN-LOG-005", status: "AVAILABLE",   assignedUser: null,                     warrantyExpiration: "2027-01-01" },
  { id: 6, type: "LAPTOP",    brand: "Apple",   model: "MacBook Air M2",    serialNumber: "SN-MBA-006", status: "ASSIGNED",    assignedUser: { name: "Sara Ehab" },    warrantyExpiration: "2026-05-10" },
];
