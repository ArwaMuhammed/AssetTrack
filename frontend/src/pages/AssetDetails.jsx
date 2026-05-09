import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  getAssetById,
  getAllocationHistoryByAsset,
  assignAsset,
  returnAsset,
  createConditionReport,
  deleteAsset,
  updateAsset,
} from "../services/assetService";

const STATUS_STYLES = {
  AVAILABLE:      { color: "#16a34a", bg: "#dcfce7" },
  ASSIGNED:       { color: "#d97706", bg: "#fef3c7" },
  MAINTENANCE:    { color: "#ef4444", bg: "#fee2e2" },
  DECOMMISSIONED: { color: "#64748b", bg: "#f1f5f9" },
};

export default function AssetDetails() {
  const { id }   = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [asset,   setAsset]   = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const [assignModal, setAssignModal] = useState(false);
  const [issueModal,  setIssueModal]  = useState(false);
  const [returnModal, setReturnModal] = useState(false);

  const [assignUserId, setAssignUserId] = useState("");
  const [issueTitle,   setIssueTitle]   = useState("");
  const [issueDesc,    setIssueDesc]    = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError,   setActionError]   = useState(null);

  const isAdmin   = user?.role === "ADMIN";
  const canManage = ["ADMIN", "MANAGER"].includes(user?.role);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const aRes = await getAssetById(id);
        setAsset(aRes.data);

        // Allocation history — Admin+Manager only
        if (user?.role === "ADMIN" || user?.role === "MANAGER") {
          const hRes = await getAllocationHistoryByAsset(id);
          setHistory(hRes.data);
        }
      } catch {
        setAsset(DEMO_ASSET);
        setHistory([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, user]);

  const handleAssign = async () => {
    if (!assignUserId.trim()) return;
    setActionLoading(true);
    setActionError(null);
    try {
      if (asset.assignedTo) {
        try {
          await returnAsset(id);
        } catch {
        }
      }
      // POST /api/allocations { assetId, userId }
      await assignAsset(id, assignUserId);
      const [aRes, hRes] = await Promise.all([
        getAssetById(id),
        getAllocationHistoryByAsset(id),
      ]);
      setAsset(aRes.data);
      setHistory(hRes.data);
      setAssignModal(false);
      setAssignUserId("");
    } catch (e) {
      setActionError(e.response?.data?.message || "Assignment failed.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleReturn = async () => {
    setActionLoading(true);
    setActionError(null);
    try {
      await returnAsset(id);
      const [aRes, hRes] = await Promise.all([getAssetById(id), getAllocationHistoryByAsset(id)]);
      setAsset(aRes.data);
      setHistory(hRes.data);
      setReturnModal(false);
    } catch (e) {
      setActionError(e.response?.data?.message || "Return failed.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDecommission = async () => {
    if (!window.confirm("Mark this asset as decommissioned?")) return;
    try {
      await updateAsset(id, {
        brand:                  asset.brand,
        model:                  asset.model,
        warrantyExpirationDate: asset.warrantyExpirationDate, // ✅ مش warrantyExpiration
        status:                 "DECOMMISSIONED",
      });
      const res = await getAssetById(id);
      setAsset(res.data);
    } catch (e) {
      alert(e.response?.data?.message || "Failed to decommission asset.");
    }
  };

  const handleMarkAsSpare = async () => {
    if (!window.confirm("This will unassign the asset and mark it as an available spare. Continue?")) return;
    try {
      // Try return first (closes active allocation if any)
      try { await returnAsset(id); } catch { /* no active allocation — ok */ }
      // Force status to AVAILABLE regardless
      await updateAsset(id, {
        brand:                  asset.brand,
        model:                  asset.model,
        warrantyExpirationDate: asset.warrantyExpirationDate,
        status:                 "AVAILABLE",
      });
      const res = await getAssetById(id);
      setAsset(res.data);
    } catch (e) {
      alert(e.response?.data?.message || "Failed to mark as spare.");
    }
  };
  const handleReport = async () => {
    if (!issueTitle.trim() || !issueDesc.trim()) return;
    setActionLoading(true);
    setActionError(null);
    try {
      await createConditionReport(id, issueTitle, issueDesc);
      setIssueModal(false);
      setIssueTitle("");
      setIssueDesc("");
    } catch (e) {
      setActionError(e.response?.data?.message || "Report submission failed.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to permanently delete this asset? This cannot be undone.")) return;
    try {
      await deleteAsset(id);
      navigate("/assets");
    } catch (e) {
      alert(e.response?.data?.message || "Delete failed.");
    }
  };

  if (loading) {
    return <div style={{ padding: "3rem", textAlign: "center", color: "var(--text-muted)" }}>Loading…</div>;
  }

  if (!asset) {
    return <div style={{ padding: "3rem", textAlign: "center", color: "var(--danger)" }}>Asset not found.</div>;
  }

  const isExpired     = asset.warrantyExpirationDate && new Date(asset.warrantyExpirationDate) < new Date();
  const isExpiringSoon = !isExpired && asset.warrantyExpirationDate && new Date(asset.warrantyExpirationDate) - Date.now() < 30 * 24 * 60 * 60 * 1000;
  const statusStyle   = STATUS_STYLES[asset.status] || STATUS_STYLES.AVAILABLE;

  return (
    <div className="animate-fade-in" style={{ maxWidth: 900, margin: "0 auto" }}>
      {/* Back */}
      <button onClick={() => navigate(-1)} className="btn"
        style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text-muted)", marginBottom: "1.5rem", padding: "8px 16px", borderRadius: "var(--radius-sm)" }}>
        ← Back
      </button>

      {/* Hero Card */}
      <div className="card" style={{ marginBottom: "1.25rem", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "linear-gradient(90deg, var(--primary), var(--success))" }} />

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem", marginTop: "0.5rem" }}>
          <div>
            <p style={{ margin: 0, fontSize: "0.8rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: 1 }}>
              {asset.brand} · {asset.type}
            </p>
            <h1 style={{ margin: "4px 0", fontSize: "1.75rem", fontWeight: 800 }}>{asset.model}</h1>
            <code style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>{asset.serialNumber}</code>
          </div>
          <span style={{ padding: "6px 16px", borderRadius: 999, fontWeight: 700, fontSize: "0.82rem", color: statusStyle.color, background: statusStyle.bg }}>
            {asset.status}
          </span>
        </div>

        {/* Details Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(170px, 1fr))", gap: "1rem", marginTop: "1.5rem" }}>
          <Detail label="Assigned To"   value={asset.assignedTo?.name || "Unassigned"} />
          <Detail label="Purchase Date" value={asset.purchaseDate ? new Date(asset.purchaseDate).toLocaleDateString() : "—"} />
          <Detail
            label="Warranty Until"
            value={asset.warrantyExpirationDate ? new Date(asset.warrantyExpirationDate).toLocaleDateString() : "—"}
            color={isExpired ? "var(--danger)" : isExpiringSoon ? "var(--warning)" : undefined}
          />
          <Detail label="Type" value={asset.type} />
        </div>

        {/* Warranty warning */}
        {isExpired && asset.type === "LAPTOP" && canManage && asset.status !== "DECOMMISSIONED" && (
          <div style={{
            marginTop: "1rem",
            padding: "1rem",
            background: "#fee2e2",
            border: "1px solid #fca5a5",
            borderRadius: "var(--radius-sm)",
          }}>
            <p style={{ margin: "0 0 0.75rem", fontWeight: 700, color: "var(--danger)", fontSize: "0.9rem" }}>
              ⚠ Warranty Expired — Suggested Actions:
            </p>
            <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap" }}>
            <button
              className="btn"
              style={{ background: "#fef3c7", border: "1px solid #fcd34d", color: "#d97706", fontSize: "0.85rem" }}
              onClick={handleMarkAsSpare}
            >
              🔄 Mark as Spare
            </button>
              <button
                className="btn"
                style={{ background: "#fee2e2", border: "1px solid #fca5a5", color: "var(--danger)", fontSize: "0.85rem" }}
                onClick={() => handleDecommission()}
              >
                🗑 Decommission
              </button>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div style={{ display: "flex", gap: "0.75rem", marginTop: "1.25rem", flexWrap: "wrap" }}>
          {asset.status !== "DECOMMISSIONED" && (
            <>
              {canManage && (
                <>
                  {!asset.assignedTo ? (
                    <button className="btn btn-primary" onClick={() => setAssignModal(true)}>👤 Assign Asset</button>
                  ) : (
                    <>
                      <button className="btn btn-primary" onClick={() => setAssignModal(true)}>🔄 Reassign Asset</button>
                      <button className="btn" style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text-muted)" }}
                        onClick={() => setReturnModal(true)}>
                        ↩ Return Asset
                      </button>
                    </>
                  )}
                  <button className="btn" style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text-muted)" }}
                    onClick={() => navigate(`/assets/${id}/edit`)}>
                    ✏️ Edit
                  </button>
                </>
              )}

              {/* Report Issue — all roles */}
              <button className="btn" style={{ background: "#fef3c7", border: "1px solid #fcd34d", color: "#d97706" }}
                onClick={() => setIssueModal(true)}>
                ⚠️ Report Issue
              </button>
            </>
          )}

          {/* Delete — Admin only, always visible */}
          {isAdmin && (
            <button className="btn" style={{ background: "#fee2e2", border: "1px solid #fca5a5", color: "var(--danger)", marginLeft: "auto" }}
              onClick={handleDelete}>
              🗑️ Delete Asset
            </button>
          )}
        </div>
      </div>

      {/* Allocation History — Admin+Manager only */}
      {canManage && (
        <div className="card">
          <h2 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "1.25rem" }}>
            Allocation History
          </h2>
          {history.length === 0 ? (
            <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
              No allocation history yet.
            </p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {history.map((h, i) => (
                <div key={h.id || i} style={{ display: "flex", gap: "0.9rem", paddingBottom: "1rem", position: "relative" }}>
                  {i < history.length - 1 && (
                    <div style={{ position: "absolute", left: 7, top: 18, bottom: 0, width: 1, background: "var(--border)" }} />
                  )}
                  <div style={{ width: 15, height: 15, borderRadius: "50%", background: "var(--primary)", border: "2px solid var(--background)", flexShrink: 0, marginTop: 3 }} />
                  <div>
                    <p style={{ margin: 0, fontWeight: 700, fontSize: "0.9rem" }}>
                      {h.user?.name || "Unknown user"}
                    </p>
                    <p style={{ margin: "2px 0 0", fontSize: "0.8rem", color: "var(--text-muted)" }}>
                      {h.assignedAt ? new Date(h.assignedAt).toLocaleDateString() : "—"}
                      {h.returnedAt ? ` → ${new Date(h.returnedAt).toLocaleDateString()}` : " → Present"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Assign Modal */}
      {assignModal && (
        <Modal title={asset.assignedTo ? "Reassign Asset" : "Assign Asset"} onClose={() => { setAssignModal(false); setActionError(null); }}>
          <p style={{ color: "var(--text-muted)", fontSize: "0.88rem", marginBottom: "1rem" }}>
            Enter the User ID to assign this asset to:
          </p>
          <input value={assignUserId} onChange={(e) => setAssignUserId(e.target.value)} placeholder="User ID (e.g. 5)" style={inputStyle} />
          {actionError && <p style={{ color: "var(--danger)", fontSize: "0.85rem", marginTop: "0.5rem" }}>{actionError}</p>}
          <ModalActions
            onCancel={() => { setAssignModal(false); setActionError(null); }}
            onConfirm={handleAssign} loading={actionLoading}
            confirmLabel={asset.assignedTo ? "Reassign" : "Assign"}
          />
        </Modal>
      )}

      {/* Return Modal */}
      {returnModal && (
        <Modal title="Return Asset" onClose={() => { setReturnModal(false); setActionError(null); }}>
          <p style={{ color: "var(--text-muted)", fontSize: "0.88rem", marginBottom: "1rem" }}>
            This will mark the asset as returned and set its status to Available.
          </p>
          {actionError && <p style={{ color: "var(--danger)", fontSize: "0.85rem" }}>{actionError}</p>}
          <ModalActions
            onCancel={() => { setReturnModal(false); setActionError(null); }}
            onConfirm={handleReturn} loading={actionLoading}
            confirmLabel="Confirm Return" confirmColor="var(--success)"
          />
        </Modal>
      )}

      {/* Issue Modal */}
      {issueModal && (
        <Modal title="Report an Issue" onClose={() => { setIssueModal(false); setActionError(null); }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            <input value={issueTitle} onChange={(e) => setIssueTitle(e.target.value)}
              placeholder="Issue title (e.g. Battery draining fast)" style={inputStyle} />
            <textarea value={issueDesc} onChange={(e) => setIssueDesc(e.target.value)}
              placeholder="Describe the issue in detail…" rows={4} style={{ ...inputStyle, resize: "vertical" }} />
          </div>
          {actionError && <p style={{ color: "var(--danger)", fontSize: "0.85rem", marginTop: "0.5rem" }}>{actionError}</p>}
          <ModalActions
            onCancel={() => { setIssueModal(false); setActionError(null); }}
            onConfirm={handleReport} loading={actionLoading}
            confirmLabel="Submit Report" confirmColor="var(--warning)"
          />
        </Modal>
      )}
    </div>
  );
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function Detail({ label, value, color }) {
  return (
    <div>
      <p style={{ margin: 0, fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: 0.8 }}>{label}</p>
      <p style={{ margin: "3px 0 0", fontSize: "0.9rem", fontWeight: 600, color: color || "var(--text-main)" }}>{value}</p>
    </div>
  );
}

function Modal({ title, onClose, children }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
      <div className="card" style={{ width: "100%", maxWidth: 440, animation: "fadeIn 0.2s ease" }}>
        <h3 style={{ margin: "0 0 1rem", fontSize: "1.1rem", fontWeight: 700 }}>{title}</h3>
        {children}
      </div>
    </div>
  );
}

function ModalActions({ onCancel, onConfirm, loading, confirmLabel, confirmColor }) {
  return (
    <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.6rem", marginTop: "1.25rem" }}>
      <button onClick={onCancel} className="btn"
        style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text-muted)" }}>
        Cancel
      </button>
      <button onClick={onConfirm} disabled={loading} className="btn"
        style={{ background: confirmColor || "var(--primary)", color: "white", opacity: loading ? 0.7 : 1 }}>
        {loading ? "Saving…" : confirmLabel}
      </button>
    </div>
  );
}

const inputStyle = {
  width: "100%", boxSizing: "border-box", padding: "0.6rem 0.9rem",
  border: "1px solid var(--border)", borderRadius: "var(--radius-sm)",
  fontSize: "0.9rem", background: "var(--background)", color: "var(--text-main)",
  outline: "none", fontFamily: "inherit",
};

const DEMO_ASSET = {
  id: "1", type: "LAPTOP", brand: "Apple", model: 'MacBook Pro 14"',
  serialNumber: "SN-MBP-001", status: "ASSIGNED",
  assignedTo: { id: 2, name: "Nour Adel", email: "nour@example.com", role: "DEVELOPER" },
  purchaseDate: "2022-03-15", warrantyExpirationDate: "2025-03-15",
};
const DEMO_HISTORY = [
  { id: 1, user: { name: "Ahmed Hassan" }, assignedAt: "2022-03-15", returnedAt: "2023-06-01" },
  { id: 2, user: { name: "Nour Adel"    }, assignedAt: "2023-06-01", returnedAt: null },
];