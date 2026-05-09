import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createAsset, updateAsset, getAssetById } from "../services/assetService";

const TYPES = ["LAPTOP", "MONITOR", "ACCESSORY"];

const INITIAL = {
  type:               "LAPTOP",
  brand:              "",
  model:              "",
  serialNumber:       "",
  purchaseDate:       "",
  warrantyExpiration: "",
};

export default function AddAsset({ editMode = false }) {
  const [form,     setForm]     = useState(INITIAL);
  const [loading,  setLoading]  = useState(false);
  const [fetching, setFetching] = useState(editMode);
  const [error,    setError]    = useState(null);
  const navigate = useNavigate();
  const { id }   = useParams();

  useEffect(() => {
    if (!editMode || !id) return;
    getAssetById(id)
      .then((r) => {
        const a = r.data;
        setForm({
          type:               a.type                   || "LAPTOP",
          brand:              a.brand                  || "",
          model:              a.model                  || "",
          serialNumber:       a.serialNumber           || "",
          purchaseDate:       a.purchaseDate           || "",
          warrantyExpiration: a.warrantyExpirationDate || "",
        });
      })
      .catch(() => {})
      .finally(() => setFetching(false));
  }, [editMode, id]);

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (editMode && id) {
        await updateAsset(id, {
          brand:              form.brand,
          model:              form.model,
          warrantyExpiration: form.warrantyExpiration,
        });
      } else {
        await createAsset(form);
      }
      navigate("/assets");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save asset. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div style={{ padding: "3rem", textAlign: "center", color: "var(--text-muted)" }}>
        Loading asset…
      </div>
    );
  }

  return (
    <div className="animate-fade-in" style={{ maxWidth: 760, margin: "0 auto" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "2rem" }}>
        <button
          onClick={() => navigate(-1)}
          className="btn"
          style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text-muted)", padding: "8px 14px", borderRadius: "var(--radius-sm)" }}
        >
          ←
        </button>
        <div>
          <h1 style={{ margin: 0, fontSize: "1.6rem", fontWeight: 800 }}>
            {editMode ? "Edit Asset" : "Add New Asset"}
          </h1>
          <p style={{ margin: "2px 0 0", color: "var(--text-muted)", fontSize: "0.88rem" }}>
            {editMode ? "Update asset details" : "Register a new hardware asset in the system"}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="card" style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>

          {!editMode && (
            <div>
              <label style={labelStyle}>Asset Type <span style={{ color: "var(--primary)" }}>*</span></label>
              <div style={{ display: "flex", gap: "0.6rem", marginTop: "0.5rem" }}>
                {TYPES.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => set("type", t)}
                    style={{
                      flex: 1, padding: "10px 0",
                      borderRadius: "var(--radius-sm)",
                      border: "1px solid",
                      borderColor: form.type === t ? "var(--primary)" : "var(--border)",
                      background:  form.type === t ? "#eff6ff"        : "var(--surface)",
                      color:       form.type === t ? "var(--primary)"  : "var(--text-muted)",
                      fontWeight: 700, fontSize: "0.85rem",
                      cursor: "pointer", transition: "all 0.2s",
                    }}
                  >
                    {t === "LAPTOP" ? "💻" : t === "MONITOR" ? "🖥️" : "🖱️"} {t}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <Field label="Brand" value={form.brand} onChange={(v) => set("brand", v)} placeholder="e.g. Apple, Dell, Logitech" required />
            <Field label="Model" value={form.model} onChange={(v) => set("model", v)} placeholder="e.g. MacBook Pro 14"        required />
          </div>

          {!editMode && (
            <Field label="Serial Number" value={form.serialNumber} onChange={(v) => set("serialNumber", v)} placeholder="Unique identifier" required />
          )}

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            {!editMode && (
              <Field label="Purchase Date" value={form.purchaseDate} onChange={(v) => set("purchaseDate", v)} type="date" required />
            )}
            <Field label="Warranty Expiration" value={form.warrantyExpiration} onChange={(v) => set("warrantyExpiration", v)} type="date" required />
          </div>

          {error && (
            <div style={{ padding: "0.7rem 1rem", background: "#fee2e2", border: "1px solid #fca5a5", borderRadius: "var(--radius-sm)", color: "var(--danger)", fontSize: "0.88rem" }}>
              ⚠ {error}
            </div>
          )}

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", paddingTop: "0.5rem" }}>
            <button type="button" onClick={() => navigate(-1)} className="btn"
              style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text-muted)" }}>
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn btn-primary" style={{ opacity: loading ? 0.7 : 1 }}>
              {loading ? "Saving…" : editMode ? "Save Changes" : "Add Asset"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

const labelStyle = {
  display: "block", fontSize: "0.78rem", color: "var(--text-muted)",
  textTransform: "uppercase", letterSpacing: 0.7, fontWeight: 600, marginBottom: "0.4rem",
};

function Field({ label, value, onChange, placeholder, type = "text", required }) {
  return (
    <div>
      <label style={labelStyle}>
        {label}{required && <span style={{ color: "var(--primary)" }}> *</span>}
      </label>
      <input
        required={required} type={type} value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: "100%", boxSizing: "border-box", padding: "0.6rem 0.9rem",
          border: "1px solid var(--border)", borderRadius: "var(--radius-sm)",
          fontSize: "0.9rem", background: "var(--background)", color: "var(--text-main)",
          outline: "none", fontFamily: "inherit", transition: "border-color 0.2s",
        }}
        onFocus={(e) => (e.target.style.borderColor = "var(--primary)")}
        onBlur={(e)  => (e.target.style.borderColor = "var(--border)")}
      />
    </div>
  );
}