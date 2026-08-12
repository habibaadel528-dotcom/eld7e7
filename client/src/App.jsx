import { Navigate, Route, Routes } from 'react-router-dom';
import MyOrders from './pages/account/MyOrders';
import Home from './pages/Home';
import CulturalBooksClearance from './pages/CulturalBooksClearance';
import Stationery from './pages/Stationery';
import Cart from './pages/Cart';
import Wishlist from "./pages/account/Wishlist";
import Login from './pages/auth/Login';
import SignUp from './pages/auth/SignUp';
import DashboardLayout from './layouts/DashboardLayout';
import DashboardPage from './pages/account/DashboardPage';
import AccountPlaceholderPage from './pages/account/AccountPlaceholderPage';
import PaymentsPage from "./pages/account/PaymentsPage";
import AddressPage from "./pages/account/AddressPage";
import ProtectedRoute from './components/auth/ProtectedRoute';
import SettingsPage from './pages/account/SettingsPage';
import NotFoundPage from './pages/NotFoundPage';
import AdminSettingsPage from './pages/admin/SettingsPage';
import AdminLayout from './layouts/AdminLayout';
import AdminProtectedRoute from './components/admin/AdminProtectedRoute';
import CustomerManagementPage from './pages/admin/CustomerManagementPage';
import OrderManagementPage from './pages/admin/OrderManagementPage';
import ProductManagementPage from './pages/admin/ProductManagementPage';
import HandcraftSuppliesPage from './pages/HandcraftSuppliesPage';
import ExternalSchoolBooksPage from './pages/ExternalSchoolBooksPage';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
function PlaceholderPage({ title }) {
  return (
    <main className="min-h-screen bg-[var(--page-bg)] px-6 py-24 text-center text-[var(--primary-text)]">
      <h1 className="text-4xl font-bold">
        {title}
      </h1>
    </main>
  );
}

export default function App() {
  return (
    <Routes>
      {/* Public pages */}
      <Route
        path="/"
        element={<Home />}
      />

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/signup"
        element={<SignUp />}
      />

      <Route
        path="/cart"
        element={<Cart />}
      />
      <Route
        path="/checkout"
        element={
          <ProtectedRoute>
            <Checkout />
          </ProtectedRoute>
        }
      />

      <Route
        path="/order-success"
        element={
          <ProtectedRoute>
            <OrderSuccess />
          </ProtectedRoute>
        }
      />

      <Route
        path="/cultural-books-clearance"
        element={<CulturalBooksClearance />}
      />

      <Route
        path="/stationery"
        element={<Stationery />}
      />

      <Route
        path="/external-school-books"
         element={<ExternalSchoolBooksPage />}
      />

      <Route
        path="/handcraft-supplies"
        element={<HandcraftSuppliesPage />}
      />

      {/* Protected account pages */}
      <Route
        path="/account"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route
          index
          element={
            <Navigate
              to="dashboard"
              replace
            />
          }
        />

        <Route
          path="dashboard"
          element={<DashboardPage />}
        />

        <Route
          path="orders"
          element={<MyOrders />}
        />

        <Route
          path="wishlist"
          element={<Wishlist />}
        />

        <Route
          path="address"
          element={<AddressPage />}
        />

        <Route
          path="payments"
          element={<PaymentsPage />}
        />

        <Route
          path="notifications"
          element={<AccountPlaceholderPage />}
        />

        <Route
          path="settings"
          element={<SettingsPage />}
        />

        <Route
          path="support"
          element={<AccountPlaceholderPage />}
        />
      </Route>

      {/* Protected admin pages */}
      <Route
        path="/admin"
        element={
          <AdminProtectedRoute>
            <AdminLayout />
          </AdminProtectedRoute>
        }
      >
        <Route
          index
          element={
            <Navigate
              to="customers"
              replace
            />
          }
        />

        <Route
          path="customers"
          element={<CustomerManagementPage />}
        />

        <Route
          path="orders"
          element={<OrderManagementPage />}
        />

        <Route path="products" element={<ProductManagementPage />} />
        <Route path="settings" element={<AdminSettingsPage />} />
        {/* overview, products, analytics, promotions, settings — هنعملهم لما تبعتي تصميماتهم */}
      </Route>

      {/* Unknown routes */}
      <Route
        path="*"
        element={<NotFoundPage />}
      />
    </Routes>
  );
}