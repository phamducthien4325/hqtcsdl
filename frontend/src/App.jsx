import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./providers/AuthProvider";
import { AppLayout } from "./components/AppLayout";
import { LoginPage } from "./pages/LoginPage";
import { DashboardPage } from "./pages/DashboardPage";
import { CustomersPage } from "./pages/CustomersPage";
import { OrdersPage } from "./pages/OrdersPage";
import { ProductsPage } from "./pages/ProductsPage";
import { PaymentsPage } from "./pages/PaymentsPage";
import { EmployeesPage } from "./pages/EmployeesPage";
import { ReportsPage } from "./pages/ReportsPage";
import { PivotPage } from "./pages/PivotPage";

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

export default function App() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />}
      />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="customers" element={<CustomersPage />} />
        <Route path="orders" element={<OrdersPage />} />
        <Route path="products" element={<ProductsPage />} />
        <Route path="payments" element={<PaymentsPage />} />
        <Route path="employees" element={<EmployeesPage />} />
        <Route path="reports" element={<ReportsPage />} />
        <Route path="pivot" element={<PivotPage />} />
      </Route>
    </Routes>
  );
}
