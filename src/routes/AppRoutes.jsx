import { Routes, Route } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import AccountLayout from "../layouts/AccountLayout";
import AdminLayout from "../layouts/AdminLayout";
import ProtectedRoute from "./ProtectedRoute";
import GuestRoute from "./GuestRoute";
import AdminProtectedRoute from "./AdminProtectedRoute";
import AdminGuestRoute from "./AdminGuestRoute";

import Home from "../pages/Home";
import Menu from "../pages/Menu";
import Product from "../pages/Product";
import Cart from "../pages/Cart";
import Checkout from "../pages/Checkout";
import About from "../pages/About";
import NotFound from "../pages/NotFound";

import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import ForgotPassword from "../pages/Auth/ForgotPassword";
import ResetPassword from "../pages/Auth/ResetPassword";

import AccountOverview from "../pages/Account/Overview";
import Orders from "../pages/Account/Orders";
import OrderDetail from "../pages/Account/OrderDetail";
import Favorites from "../pages/Account/Favorites";
import Profile from "../pages/Account/Profile";
import Settings from "../pages/Account/Settings";

import OrderSuccess from "../pages/OrderSuccess";

// ---- Admin ----
import AdminLogin from "../pages/Admin/Auth/Login";
import AdminDashboard from "../pages/Admin/Dashboard";
import AdminOrders from "../pages/Admin/Orders";
import AdminOrderDetail from "../pages/Admin/Orders/OrderDetail";
import AdminProducts from "../pages/Admin/Products";
import ProductCreate from "../pages/Admin/Products/ProductCreate";
import ProductEdit from "../pages/Admin/Products/ProductEdit";
import AdminCategories from "../pages/Admin/Categories";
import AdminProductSizes from "../pages/Admin/ProductSizes";
import AdminSauces from "../pages/Admin/Sauces";
import AdminOffers from "../pages/Admin/Offers";
import AdminCoupons from "../pages/Admin/Coupons";
import AdminBranches from "../pages/Admin/Branches";
import AdminCustomers from "../pages/Admin/Customers";
import CustomerDetail from "../pages/Admin/Customers/CustomerDetail";
import AdminReviews from "../pages/Admin/Reviews";
import AdminPayments from "../pages/Admin/Payments";
import AdminOrderStatusHistory from "../pages/Admin/OrderStatusHistory";
import AdminProfile from "../pages/Admin/Profile";
import AdminSettings from "../pages/Admin/Settings";

export default function AppRoutes() {
  return (
    <Routes>
      {/* ---------------- Customer website (unchanged) ---------------- */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/menu/:id" element={<Product />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/about" element={<About />} />
        <Route path="/order-success/:id" element={<OrderSuccess />} />

        <Route element={<GuestRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/account" element={<AccountLayout />}>
            <Route index element={<AccountOverview />} />
            <Route path="orders" element={<Orders />} />
            <Route path="orders/:id" element={<OrderDetail />} />
            <Route path="favorites" element={<Favorites />} />
            <Route path="profile" element={<Profile />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Route>
      </Route>

      {/* ---------------- Admin dashboard ---------------- */}
      <Route element={<AdminGuestRoute />}>
        <Route path="/admin/login" element={<AdminLogin />} />
      </Route>

      <Route element={<AdminProtectedRoute />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />

          <Route path="orders" element={<AdminOrders />} />
          <Route path="orders/:id" element={<AdminOrderDetail />} />

          <Route path="products" element={<AdminProducts />} />
          <Route path="products/create" element={<ProductCreate />} />
          <Route path="products/:id/edit" element={<ProductEdit />} />

          <Route path="categories" element={<AdminCategories />} />
          <Route path="product-sizes" element={<AdminProductSizes />} />
          <Route path="sauces" element={<AdminSauces />} />
          <Route path="offers" element={<AdminOffers />} />
          <Route path="coupons" element={<AdminCoupons />} />
          <Route path="branches" element={<AdminBranches />} />

          <Route path="customers" element={<AdminCustomers />} />
          <Route path="customers/:id" element={<CustomerDetail />} />

          <Route path="reviews" element={<AdminReviews />} />

          <Route path="payments" element={<AdminPayments />} />

          <Route path="order-status-history" element={<AdminOrderStatusHistory />} />

          <Route path="profile" element={<AdminProfile />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
