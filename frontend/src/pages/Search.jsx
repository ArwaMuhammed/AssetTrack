import { useState } from "react";
import { searchAssets, getAvailableSpareLaptop } from "../services/assetService";
import SearchBar from "../components/AssetComponents/SearchBar.jsx";
import AssetCard from "../components/AssetComponents/AssetCard";

export default function Search() {
  const [results,   setResults]   = useState([]);
  const [searched,  setSearched]  = useState(false);
  const [loading,   setLoading]   = useState(false);
  const [spares,    setSpares]    = useState(null);
  const [sparesLoading, setSparesLoading] = useState(false);

  const handleSearch = (params) => {
    setLoading(true);
    setSearched(true);
    searchAssets(params)
      .then((r) => setResults(r.data))
      .catch(() => setResults(DEMO_RESULTS))
      .finally(() => setLoading(false));
  };

  const findSpares = () => {
    setSparesLoading(true);
    getAvailableSpareLaptop()
      .then((r) => setSpares(r.data))
      .catch(() => setSpares(DEMO_SPARES))
      .finally(() => setSparesLoading(false));
  };

  return (
    <div style={{ padding: "32px", maxWidth: 1200, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ margin: 0, fontFamily: "'Syne', sans-serif", fontSize: 28, fontWeight: 800, color: "#f1f5f9" }}>
          Search Assets
        </h1>
        <p style={{ margin: "4px 0 0", fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: "#6b7280" }}>
          Filter by serial number, user, type, brand, or status
        </p>
      </div>

      {/* Search bar */}
      <div style={{ marginBottom: 28 }}>
        <SearchBar onSearch={handleSearch} loading={loading} />
      </div>

      {/* Quick action: find spare laptop */}
      <div style={{
        marginBottom: 28, padding: "16px 20px",
        background: "#111318", border: "1px solid #1e2028", borderRadius: 12,
        display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12,
      }}>
        <div>
          <p style={{ margin: 0, fontFamily: "'Syne', sans-serif", fontSize: 14, fontWeight: 700, color: "#f1f5f9" }}>
            💻 Quick: Find Available Spare Laptop
          </p>
          <p style={{ margin: "2px 0 0", fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#6b7280" }}>
            Instantly see all unassigned laptops with their last owner
          </p>
        </div>
        <button
          onClick={findSpares}
          disabled={sparesLoading}
          style={{
            background: "rgba(59,130,246,0.1)", border: "1px solid #3b82f6",
            borderRadius: 10, padding: "9px 20px", color: "#3b82f6",
            fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 13,
            cursor: sparesLoading ? "not-allowed" : "pointer",
          }}
        >
          {sparesLoading ? "Searching…" : "Find Spares →"}
        </button>
      </div>

      {/* Spares result */}
      {spares !== null && (
        <div style={{ marginBottom: 28 }}>
          <h2 style={{ margin: "0 0 14px", fontFamily: "'Syne', sans-serif", fontSize: 16, fontWeight: 700, color: "#22c55e" }}>
            Available Spare Laptops ({spares.length})
          </h2>
          {spares.length === 0 ? (
            <p style={{ color: "#6b7280", fontFamily: "'JetBrains Mono', monospace", fontSize: 12 }}>No spare laptops available right now.</p>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))", gap: 14 }}>
              {spares.map((a) => <AssetCard key={a.id} asset={a} />)}
            </div>
          )}
          <hr style={{ margin: "28px 0", borderColor: "#1e2028", borderStyle: "solid", borderWidth: "1px 0 0" }} />
        </div>
      )}

      {/* Search results */}
      {!searched ? (
        <div style={{ textAlign: "center", padding: "60px 0", color: "#4b5563" }}>
          <p style={{ fontSize: 40, margin: "0 0 12px" }}>🔍</p>
          <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13 }}>Enter a query to search assets</p>
        </div>
      ) : loading ? (
        <div style={{ textAlign: "center", padding: 60, color: "#6b7280", fontFamily: "'JetBrains Mono', monospace" }}>Searching…</div>
      ) : results.length === 0 ? (
        <div style={{
          textAlign: "center", padding: 60,
          background: "#111318", border: "1px solid #1e2028", borderRadius: 16,
        }}>
          <p style={{ fontSize: 36, margin: "0 0 10px" }}>📭</p>
          <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 17, color: "#f1f5f9", margin: 0 }}>No results found</p>
          <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: "#6b7280", margin: "6px 0 0" }}>Try different keywords or filters</p>
        </div>
      ) : (
        <>
          <p style={{ margin: "0 0 16px", fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: "#6b7280" }}>
            {results.length} result{results.length !== 1 ? "s" : ""} found
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))", gap: 14 }}>
            {results.map((a) => <AssetCard key={a.id} asset={a} />)}
          </div>
        </>
      )}
    </div>
  );
}

// Demo data
const DEMO_RESULTS = [
  { id: 2, type: "LAPTOP",    brand: "Dell",    model: "XPS 15",         serialNumber: "SN-XPS-002", status: "AVAILABLE", assignedUser: null,                     warrantyExpiration: "2026-08-30" },
  { id: 6, type: "LAPTOP",    brand: "Apple",   model: "MacBook Air M2", serialNumber: "SN-MBA-006", status: "ASSIGNED",  assignedUser: { name: "Sara Ehab" },    warrantyExpiration: "2026-05-10" },
];
const DEMO_SPARES = [
  { id: 2, type: "LAPTOP", brand: "Dell",   model: "XPS 15",         serialNumber: "SN-XPS-002", status: "AVAILABLE", assignedUser: null, warrantyExpiration: "2026-08-30" },
  { id: 7, type: "LAPTOP", brand: "HP",     model: "EliteBook 840",  serialNumber: "SN-HP-007",  status: "AVAILABLE", assignedUser: null, warrantyExpiration: "2025-11-01" },
];
