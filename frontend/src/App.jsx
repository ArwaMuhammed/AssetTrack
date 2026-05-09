import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import MainLayout from "./components/Layout/MainLayout";

// ── Person A pages ────────────────────────────────────────────────────────────
import Login    from "./pages/Login";
import Signup   from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Users    from "./pages/Admin/Users";

// ── Person B pages ────────────────────────────────────────────────────────────
import Assets      from "./pages/Assets";
import AddAsset    from "./pages/AddAsset";
import AssetDetails from "./pages/AssetDetails";
import Search      from "./pages/Search";
import Reports     from "./pages/Reports";

// ── Misc ──────────────────────────────────────────────────────────────────────
const Unauthorized = () => (
  <div style={{ padding: "2rem", textAlign: "center" }}>
    <h1 style={{ color: "var(--danger)" }}>Unauthorized Access</h1>
    <p style={{ color: "var(--text-muted)", marginTop: "0.5rem" }}>
      You do not have permission to view this page.
    </p>
    <button
      className="btn btn-primary"
      onClick={() => window.history.back()}
      style={{ marginTop: "1rem" }}
    >
      Go Back
    </button>
  </div>
);

// Helper: lets nested protected routes render their children via <Outlet>
const OutletProxy = () => <Outlet />;

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* ── Public ── */}
          <Route path="/login"        element={<Login />} />
          <Route path="/signup"       element={<Signup />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* ── Protected (any authenticated user) ── */}
          <Route
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            
           {/* ADMIN + MANAGER only */}
            <Route
              element={
                <ProtectedRoute allowedRoles={["ADMIN", "MANAGER"]}>
                  <OutletProxy />
                </ProtectedRoute>
              }
            >
            </Route>

            {/* Dashboard — all authenticated users (Developer sees limited view) */}
            <Route path="/" element={<Dashboard />} />

            {/* All authenticated users */}
            <Route path="/assets"          element={<Assets />} />
            <Route
              path="/assets/add"
              element={
                <ProtectedRoute allowedRoles={["ADMIN"]}>
                  <AddAsset />
                </ProtectedRoute>
              }
            />
            <Route path="/assets/:id"      element={<AssetDetails />} />
            <Route path="/assets/:id/edit" element={<AddAsset editMode />} />
            <Route path="/search"          element={<Search />} />
            <Route path="/reports"         element={<Reports />} />
            {/* ADMIN only */}
            <Route
              element={
                <ProtectedRoute allowedRoles={["ADMIN"]}>
                  <OutletProxy />
                </ProtectedRoute>
              }
            >
              <Route path="/users" element={<Users />} />
            </Route>
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

// export default function App() {
//   return <h1 style={{color:"red"}}>APP IS WORKING</h1>;
// }