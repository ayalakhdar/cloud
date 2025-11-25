import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Pages
import LoginPage from "../pages/LoginPage";
import Layout from "../components/Layout";

import MyOffers from "../pages/Supplier/MyOffers";
import ClientNeeds from "../pages/Client/ClientNeeds";
import SupplierNeeds from "../pages/Supplier/SupplierNeeds";
import AccountantRequests from "../pages/Accountant/AccountantRequests";
import AccountantDashboard from "../pages/Accountant/AccountantDashboard";
import UsersManagement from "../pages/Admin/UsersManagement";

function PrivateRoute({ children, roles }) {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;
  if (!roles.includes(user.role)) return <Navigate to="/login" replace />;

  return children;
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Login */}
        <Route path="/login" element={<LoginPage />} />

        {/* Client */}
        <Route
          path="/client/needs"
          element={
            <PrivateRoute roles={["CLIENT"]}>
                <Layout>
                    <ClientNeeds />
                </Layout>
            </PrivateRoute>
          }
        />

        {/* Supplier */}
        <Route
          path="/supplier/needs"
          element={
            <PrivateRoute roles={["SUPPLIER"]}>
                <Layout>
                    <SupplierNeeds />
                </Layout>
            </PrivateRoute>
          }
        />

        {/* Accountant */}
        <Route
          path="/accountant/requests"
          element={
            <PrivateRoute roles={["ACCOUNTANT"]}>
                <Layout>
                    <AccountantRequests />
                </Layout>
            </PrivateRoute>
          }
        />

        {/* Accountant */}
        <Route 
          path="/accountant/dashboard" 
          element={
            <PrivateRoute roles={["ACCOUNTANT"]}>
                <Layout>
                    <AccountantDashboard />
                </Layout>
            </PrivateRoute>
         } />
        {/* Admin */}
        <Route
          path="/admin/users"
          element={
            <PrivateRoute roles={["ADMIN"]}>
                <Layout>
                    <UsersManagement />
                </Layout>
            </PrivateRoute>
          }
        />
        <Route
            path="/supplier/my-offers"
            element={
                <PrivateRoute roles={["SUPPLIER"]}>
                <Layout>
                    <MyOffers />
                </Layout>
                </PrivateRoute>
            }
            />


        {/* Default route */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
