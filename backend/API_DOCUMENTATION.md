# AssetTrack Backend API Documentation

## Base URL
- Local: `http://localhost:8080`
- All endpoints start with: `/api`

## Authentication & Authorization
- Public endpoints: `/api/auth/**`
- Any other endpoint requires JWT token in header:
  - `Authorization: Bearer <token>`
- Roles used in project:
  - `ADMIN`
  - `MANAGER`
  - `DEVELOPER`

## Common Error Response Format
Most errors return this JSON shape:

```json
{
  "timestamp": "2026-05-08T21:30:00.123",
  "status": 403,
  "error": "Forbidden",
  "message": "Access denied",
  "path": "/api/users"
}
```

## Enums Used in Requests
- `Role`: `ADMIN`, `MANAGER`, `DEVELOPER`
- `AssetType`: `LAPTOP`, `MONITOR`, `ACCESSORY`
- `AssetStatus`: `AVAILABLE`, `ASSIGNED`, `MAINTENANCE`, `DECOMMISSIONED`
- `ReportStatus`: `OPEN`, `IN_PROGRESS`, `RESOLVED`, `REJECTED`
- `NotificationType`: `WARRANTY_EXPIRATION`, `LOW_STOCK`, `CONDITION_REPORT`

---

## 1) Auth APIs (`/api/auth`)

| Method | Endpoint | Who can call | Body | Returns |
|---|---|---|---|---|
| POST | `/api/auth/signup` | Public | `SignupRequest` | `AuthResponse` |
| POST | `/api/auth/login` | Public | `LoginRequest` | `AuthResponse` |

### SignupRequest
```json
{
  "name": "string",
  "email": "string (email)",
  "password": "string",
  "role": "ADMIN | MANAGER | DEVELOPER"
}
```

### LoginRequest
```json
{
  "email": "string (email)",
  "password": "string"
}
```

### AuthResponse
```json
{
  "token": "string",
  "email": "string",
  "role": "string"
}
```

---

## 2) User APIs (`/api/users`)

| Method | Endpoint | Who can call | Params | Body | Returns |
|---|---|---|---|---|---|
| GET | `/api/users` | `ADMIN` | - | - | `List<UserResponse>` |
| GET | `/api/users/{id}` | `ADMIN` | `id` (path) | - | `UserResponse` |
| PUT | `/api/users/{id}/role` | `ADMIN` | `id` (path) | `UpdateUserRoleRequest` | `UserResponse` |
| DELETE | `/api/users/{id}` | `ADMIN` | `id` (path) | - | `204 No Content` |

### UserResponse
```json
{
  "id": 1,
  "name": "string",
  "email": "string",
  "role": "ADMIN | MANAGER | DEVELOPER",
  "createdAt": "datetime"
}
```

### UpdateUserRoleRequest
```json
{
  "role": "ADMIN | MANAGER | DEVELOPER"
}
```

---

## 3) Asset APIs (`/api/assets`)

| Method | Endpoint | Who can call | Params | Body | Returns |
|---|---|---|---|---|---|
| POST | `/api/assets` | `ADMIN` | - | `CreateAssetRequest` | `AssetResponse` |
| GET | `/api/assets` | `ADMIN`, `MANAGER`, `DEVELOPER` | - | - | `List<AssetSummary>` |
| GET | `/api/assets/{id}` | `ADMIN`, `MANAGER`, `DEVELOPER` | `id` (path) | - | `AssetResponse` |
| PUT | `/api/assets/{id}` | `ADMIN`, `MANAGER` | `id` (path) | `UpdateAssetRequest` | `AssetResponse` |
| DELETE | `/api/assets/{id}` | `ADMIN` | `id` (path) | - | `204 No Content` |
| GET | `/api/assets/search` | `ADMIN`, `MANAGER`, `DEVELOPER` | `brand?`, `model?`, `type?`, `status?` | - | `List<AssetSummary>` |
| GET | `/api/assets/spare-laptop` | `ADMIN`, `MANAGER` | - | - | `AssetResponse` |

### CreateAssetRequest
```json
{
  "serialNumber": "string",
  "brand": "string",
  "model": "string",
  "type": "LAPTOP | MONITOR | ACCESSORY",
  "purchaseDate": "yyyy-MM-dd",
  "warrantyExpirationDate": "yyyy-MM-dd"
}
```

### UpdateAssetRequest
```json
{
  "brand": "string",
  "model": "string",
  "status": "AVAILABLE | ASSIGNED | MAINTENANCE | DECOMMISSIONED",
  "warrantyExpirationDate": "yyyy-MM-dd"
}
```

### AssetSummary
```json
{
  "id": 1,
  "serialNumber": "string",
  "brand": "string",
  "model": "string",
  "type": "LAPTOP | MONITOR | ACCESSORY",
  "status": "AVAILABLE | ASSIGNED | MAINTENANCE | DECOMMISSIONED"
}
```

### AssetResponse
```json
{
  "id": 1,
  "serialNumber": "string",
  "brand": "string",
  "model": "string",
  "type": "LAPTOP | MONITOR | ACCESSORY",
  "status": "AVAILABLE | ASSIGNED | MAINTENANCE | DECOMMISSIONED",
  "purchaseDate": "yyyy-MM-dd",
  "warrantyExpirationDate": "yyyy-MM-dd",
  "createdAt": "datetime",
  "assignedTo": {
    "id": 1,
    "name": "string",
    "email": "string",
    "role": "ADMIN | MANAGER | DEVELOPER"
  }
}
```

---

## 4) Allocation APIs (`/api/allocations`)

| Method | Endpoint | Who can call | Params | Body | Returns |
|---|---|---|---|---|---|
| POST | `/api/allocations` | `ADMIN`, `MANAGER` | - | `AllocateAssetRequest` | `AllocationResponse` |
| PUT | `/api/allocations/return/{assetId}` | `ADMIN`, `MANAGER` | `assetId` (path) | - | `AllocationResponse` |
| GET | `/api/allocations/asset/{assetId}` | `ADMIN`, `MANAGER` | `assetId` (path) | - | `List<AllocationResponse>` |
| GET | `/api/allocations/user/{userId}` | `ADMIN`, `MANAGER` | `userId` (path) | - | `List<AllocationResponse>` |

### AllocateAssetRequest
```json
{
  "assetId": 1,
  "userId": 1
}
```

### AllocationResponse
```json
{
  "id": 1,
  "asset": { "id": 1, "serialNumber": "string", "brand": "string", "model": "string", "type": "LAPTOP", "status": "ASSIGNED" },
  "user": { "id": 1, "name": "string", "email": "string", "role": "DEVELOPER" },
  "assignedAt": "datetime",
  "returnedAt": "datetime or null"
}
```

---

## 5) Condition Report APIs (`/api/reports`)

| Method | Endpoint | Who can call | Params | Body | Returns |
|---|---|---|---|---|---|
| POST | `/api/reports` | `ADMIN`, `MANAGER`, `DEVELOPER` | - | `CreateConditionReportRequest` | `ConditionReportResponse` |
| PUT | `/api/reports/{id}/status` | `ADMIN`, `MANAGER` | `id` (path) | `UpdateReportStatusRequest` | `ConditionReportResponse` |
| GET | `/api/reports` | `ADMIN`, `MANAGER` | - | - | `List<ConditionReportResponse>` |
| GET | `/api/reports/asset/{assetId}` | `ADMIN`, `MANAGER` | `assetId` (path) | - | `List<ConditionReportResponse>` |
| GET | `/api/reports/status/{status}` | `ADMIN`, `MANAGER` | `status` (path) | - | `List<ConditionReportResponse>` |
| GET | `/api/reports/my` | `ADMIN`, `MANAGER`, `DEVELOPER` | - | - | `List<ConditionReportResponse>` |

### CreateConditionReportRequest
```json
{
  "assetId": 1,
  "issueTitle": "string",
  "description": "string"
}
```

### UpdateReportStatusRequest
```json
{
  "status": "OPEN | IN_PROGRESS | RESOLVED | REJECTED"
}
```

### ConditionReportResponse
```json
{
  "id": 1,
  "asset": { "id": 1, "serialNumber": "string", "brand": "string", "model": "string", "type": "LAPTOP", "status": "ASSIGNED" },
  "reportedBy": { "id": 1, "name": "string", "email": "string", "role": "DEVELOPER" },
  "issueTitle": "string",
  "description": "string",
  "status": "OPEN | IN_PROGRESS | RESOLVED | REJECTED",
  "createdAt": "datetime",
  "resolvedAt": "datetime or null"
}
```

---

## 6) Notification APIs (`/api/notifications`)

| Method | Endpoint | Who can call | Params | Body | Returns |
|---|---|---|---|---|---|
| GET | `/api/notifications` | Any authenticated user | - | - | `List<NotificationResponse>` |
| GET | `/api/notifications/unread` | Any authenticated user | - | - | `List<NotificationResponse>` |
| PUT | `/api/notifications/{id}/read` | Any authenticated user | `id` (path) | - | `204 No Content` |
| PUT | `/api/notifications/read-all` | Any authenticated user | - | - | `204 No Content` |

### NotificationResponse
```json
{
  "id": 1,
  "title": "string",
  "message": "string",
  "type": "WARRANTY_EXPIRATION | LOW_STOCK | CONDITION_REPORT",
  "isRead": true,
  "createdAt": "datetime"
}
```

---

## 7) Stock APIs (`/api/stock`)

| Method | Endpoint | Who can call | Params | Body | Returns |
|---|---|---|---|---|---|
| POST | `/api/stock` | `ADMIN`, `MANAGER` | - | `CreateAccessoryStockRequest` | `AccessoryStockResponse` |
| GET | `/api/stock` | `ADMIN`, `MANAGER` | - | - | `List<AccessoryStockResponse>` |
| GET | `/api/stock/{id}` | `ADMIN`, `MANAGER` | `id` (path) | - | `AccessoryStockResponse` |
| PUT | `/api/stock/{id}/quantity` | `ADMIN`, `MANAGER` | `id` (path) | `UpdateStockQuantityRequest` | `AccessoryStockResponse` |
| DELETE | `/api/stock/{id}` | `ADMIN` | `id` (path) | - | `204 No Content` |
| GET | `/api/stock/low-stock` | `ADMIN`, `MANAGER` | - | - | `List<AccessoryStockResponse>` |

### CreateAccessoryStockRequest
```json
{
  "name": "string",
  "quantity": 0,
  "minimumRequiredQuantity": 1
}
```

### UpdateStockQuantityRequest
```json
{
  "quantity": 0
}
```

### AccessoryStockResponse
```json
{
  "id": 1,
  "name": "string",
  "quantity": 10,
  "minimumRequiredQuantity": 3,
  "lowStock": false,
  "updatedAt": "datetime"
}
```

---

## 8) Dashboard API (`/api/dashboard`)

| Method | Endpoint | Who can call | Body | Returns |
|---|---|---|---|---|
| GET | `/api/dashboard` | `ADMIN`, `MANAGER` | - | `DashboardResponse` |

### DashboardResponse
```json
{
  "totalAssets": 0,
  "assignedAssets": 0,
  "availableAssets": 0,
  "maintenanceAssets": 0,
  "decommissionedAssets": 0,
  "expiringWithin30Days": 0,
  "openConditionReports": 0,
  "assetsByType": {
    "LAPTOP": 0,
    "MONITOR": 0,
    "ACCESSORY": 0
  },
  "assetsByStatus": {
    "AVAILABLE": 0,
    "ASSIGNED": 0,
    "MAINTENANCE": 0,
    "DECOMMISSIONED": 0
  }
}
```

---

## Notes
- `@Valid` is used on request bodies in multiple endpoints; invalid data returns `400`.
- Missing/invalid token returns `401`.
- Valid token with insufficient role returns `403`.
- Some delete/mark endpoints return `204 No Content` (empty body).
