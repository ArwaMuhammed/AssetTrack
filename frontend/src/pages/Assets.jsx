import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllAssets, searchAssets, getAllocationHistoryByUser } from "../services/assetService";
import AssetCard from "../components/AssetComponents/AssetCard";
import SearchBar from "../components/AssetComponents/SearchBar.jsx";
import { useAuth } from "../context/AuthContext";

export default function Assets() {
  const [assets,    setAssets]    = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [searching, setSearching] = useState(false);
  const [view,      setView]      = useState("grid");
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    fetchAll();
  }, [user]);

  const fetchAll = () => {
    setLoading(true);
    getAllAssets()
      .then((r) => {
        setAssets(r.data);
      })
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

  const displayAssets = user?.role === "DEVELOPER"
    ? assets.filter((a) => a.status === "ASSIGNED")
    : assets;

  const btnStyle = (active) => ({
    background: active ? "var(--primary)" : "var(--surface)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius-sm)",
    padding: "8px 12px",
    color: active ? "white" : "var(--text-muted)",
    cursor: "pointer",
    fontSize: 16,
    transition: "all 0.2s",
  });

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.75rem" }}>
        <div>
          <h1 style={{ margin: 0, fontSize: "1.8rem", fontWeight: 800 }}>Assets</h1>
          <p style={{ margin: "4px 0 0", color: "var(--text-muted)", fontSize: "0.88rem" }}>
            {displayAssets.length} {user?.role === "DEVELOPER" ? "assigned to you" : "total records"}
          </p>
        </div>
        <div style={{ display: "flex", gap: "0.6rem", alignItems: "center" }}>
          <button style={btnStyle(view === "grid")} onClick={() => setView("grid")} title="Grid view">⊞</button>
          <button style={btnStyle(view === "list")} onClick={() => setView("list")} title="List view">☰</button>
          {user?.role === "ADMIN" && (
            <button
              onClick={() => navigate("/assets/add")}
              className="btn btn-primary"
              style={{ marginLeft: "0.5rem" }}
            >
              + Add Asset
            </button>
          )}
        </div>
      </div>

      {/* Search */}
      <div style={{ marginBottom: "1.5rem" }}>
        <SearchBar onSearch={handleSearch} loading={searching} />
      </div>

      {/* Content */}
      {loading ? (
        <div style={{ textAlign: "center", padding: "3rem", color: "var(--text-muted)" }}>
          Loading assets…
        </div>
      ) : displayAssets.length === 0 ? (
        <div className="card" style={{ textAlign: "center", padding: "3rem" }}>
          <p style={{ fontSize: "2.5rem", margin: "0 0 0.75rem" }}>📭</p>
          <p style={{ fontWeight: 700, fontSize: "1.1rem", margin: "0 0 0.4rem" }}>
            {user?.role === "DEVELOPER" ? "No assets assigned to you" : "No assets found"}
          </p>
          <p style={{ color: "var(--text-muted)", fontSize: "0.88rem", margin: 0 }}>
            {user?.role === "DEVELOPER" ? "Contact your manager to get an asset assigned." : "Try adjusting your search filters"}
          </p>
        </div>
      ) : view === "grid" ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1rem" }}>
          {displayAssets.map((a) => <AssetCard key={a.id} asset={a} />)}
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          {displayAssets.map((a) => <AssetCard key={a.id} asset={a} compact />)}
        </div>
      )}
    </div>
  );
}

const DEMO_ASSETS = [
  { id: 1, type: "LAPTOP",    brand: "Apple",    model: 'MacBook Pro 14"',   serialNumber: "SN-MBP-001", status: "ASSIGNED",    assignedTo: { id: 2, name: "Nour Adel" },    warrantyExpirationDate: "2024-11-15" },
  { id: 2, type: "LAPTOP",    brand: "Dell",     model: "XPS 15",            serialNumber: "SN-XPS-002", status: "AVAILABLE",   assignedTo: null,                            warrantyExpirationDate: "2026-08-30" },
  { id: 3, type: "MONITOR",   brand: "LG",       model: 'UltraWide 34"',     serialNumber: "SN-LGM-003", status: "ASSIGNED",    assignedTo: { id: 3, name: "Youssef Samy" }, warrantyExpirationDate: "2025-12-01" },
  { id: 4, type: "LAPTOP",    brand: "Lenovo",   model: "ThinkPad X1 Carbon",serialNumber: "SN-LNV-004", status: "MAINTENANCE", assignedTo: null,                            warrantyExpirationDate: "2025-04-20" },
  { id: 5, type: "ACCESSORY", brand: "Logitech", model: "MX Master 3",       serialNumber: "SN-LOG-005", status: "AVAILABLE",   assignedTo: null,                            warrantyExpirationDate: "2027-01-01" },
  { id: 6, type: "LAPTOP",    brand: "Apple",    model: "MacBook Air M2",    serialNumber: "SN-MBA-006", status: "ASSIGNED",    assignedTo: { id: 4, name: "Sara Ehab" },    warrantyExpirationDate: "2026-05-10" },
];