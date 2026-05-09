import api from "./api";

// ─── Assets ────────────────────────────────────────────────────────────────

export const getAllAssets = () => api.get("/assets");

export const getAssetById = (id) => api.get(`/assets/${id}`);

export const createAsset = (data) =>
  api.post("/assets", {
    serialNumber:           data.serialNumber,
    brand:                  data.brand,
    model:                  data.model,
    type:                   data.type,                  // LAPTOP | MONITOR | ACCESSORY
    purchaseDate:           data.purchaseDate,           // yyyy-MM-dd
    warrantyExpirationDate: data.warrantyExpiration,     // mapped to backend field name
  });

export const updateAsset = (id, data) =>
  api.put(`/assets/${id}`, {
    brand:                  data.brand,
    model:                  data.model,
    status:                 data.status,
    warrantyExpirationDate: data.warrantyExpiration,
  });

export const deleteAsset = (id) => api.delete(`/assets/${id}`);

// GET /api/assets/spare-laptop  → returns ONE AssetResponse (not an array)
export const getAvailableSpareLaptop = () => api.get("/assets/spare-laptop");

// ─── Search ─────────────────────────────────────────────────────────────────
// Query params accepted: brand, model, type, status
export const searchAssets = async (params) => {
  const { query, type, status } = params;

  if (query) {
    const [byBrand, byModel] = await Promise.all([
      api.get("/assets/search", { params: { brand: query, type, status } }),
      api.get("/assets/search", { params: { model: query, type, status } }),
    ]);

    const combined = [...byBrand.data, ...byModel.data];
    const unique = combined.filter(
      (a, index, self) => self.findIndex((b) => b.id === a.id) === index
    );
    return { data: unique };
  }

  const clean = {};
  if (params.brand)  clean.brand  = params.brand;
  if (params.model)  clean.model  = params.model;
  if (params.type)   clean.type   = params.type;
  if (params.status) clean.status = params.status;
  return api.get("/assets/search", { params: clean });
};

// ─── Allocation ─────────────────────────────────────────────────────────────

// POST /api/allocations  body: { assetId, userId }
export const assignAsset = (assetId, userId) =>
  api.post("/allocations", { assetId: Number(assetId), userId: Number(userId) });

// PUT /api/allocations/return/{assetId}
export const returnAsset = (assetId) =>
  api.put(`/allocations/return/${assetId}`);

// GET /api/allocations/asset/{assetId}
export const getAllocationHistoryByAsset = (assetId) =>
  api.get(`/allocations/asset/${assetId}`);

// GET /api/allocations/user/{userId}
export const getAllocationHistoryByUser = (userId) =>
  api.get(`/allocations/user/${userId}`);

// ─── Condition Reports ───────────────────────────────────────────────────────

// POST /api/reports  body: { assetId, issueTitle, description }
export const createConditionReport = (assetId, issueTitle, description) =>
  api.post("/reports", {
    assetId:    Number(assetId),
    issueTitle,
    description,
  });

// GET /api/reports  (ADMIN / MANAGER)
export const getAllReports = () => api.get("/reports");

// GET /api/reports/my  (any authenticated user)
export const getMyReports = () => api.get("/reports/my");

// GET /api/reports/asset/{assetId}
export const getReportsByAsset = (assetId) =>
  api.get(`/reports/asset/${assetId}`);

// GET /api/reports/status/{status}
export const getReportsByStatus = (status) =>
  api.get(`/reports/status/${status}`);

// PUT /api/reports/{id}/status  body: { status }
export const updateReportStatus = (reportId, status) =>
  api.put(`/reports/${reportId}/status`, { status });

// ─── Notifications ───────────────────────────────────────────────────────────

export const getNotifications       = ()    => api.get("/notifications");
export const getUnreadNotifications = ()    => api.get("/notifications/unread");
export const markNotificationRead   = (id)  => api.put(`/notifications/${id}/read`);
export const markAllNotificationsRead = ()  => api.put("/notifications/read-all");

// ─── Stock ───────────────────────────────────────────────────────────────────

export const getAllStock     = ()           => api.get("/stock");
export const getStockById    = (id)         => api.get(`/stock/${id}`);
export const getLowStock     = ()           => api.get("/stock/low-stock");
export const createStock     = (data)       => api.post("/stock", data);
export const updateStockQty  = (id, qty)    => api.put(`/stock/${id}/quantity`, { quantity: qty });
export const deleteStock     = (id)         => api.delete(`/stock/${id}`);

// ─── Dashboard ───────────────────────────────────────────────────────────────

export const getDashboardStats = () => api.get("/dashboard");