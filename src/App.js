import React, { lazy, Suspense } from "react";
import { Navigate, Outlet, Routes, Route, useParams } from "react-router-dom";
import TrackOrdersPage from './pages/TrackOrdersPage';
import Navbar from './components/common/Navbar';
import MenuPage from './pages/menu/MenuPage';
import TodaySpecial from './components/categories/TodaySpecial';
import CheckoutPage from './pages/CheckoutPage';
import CartPage from './pages/CartPage';
import { CartProvider } from './contexts/CartContext';
import { BrandProvider } from './contexts/BrandContext';
import CanteenEntry from './pages/CanteenEntry';

// Admin code is split out so customers never download it.
const ProtectedAdminRoute = lazy(() => import('./features/admin/ProtectedAdminRoute'));
const AdminLogin = lazy(() => import('./features/admin/AdminLogin'));
const AdminDashboard = lazy(() => import('./features/admin/AdminDashboard'));

// Old category URLs (/lunch, /category/snacks) now open the menu filtered to that category.
const CategoryRedirect = ({ name }) => {
  const params = useParams();
  const category = name || params.name;
  return <Navigate to={`/menu?category=${encodeURIComponent(category)}`} replace />;
};

const CustomerLayout = () => (
  <BrandProvider>
    <CartProvider>
      <Navbar />
      <Outlet />
    </CartProvider>
  </BrandProvider>
);

function App() {
  return (
    <Suspense fallback={null}>
      <Routes>
        <Route element={<CustomerLayout />}>
          <Route index element={<Navigate to="/menu" replace />} />
          {/* QR code entry: /r/:slug is the neutral link, /c/:slug keeps older printed codes working */}
          <Route path="/r/:slug" element={<CanteenEntry />} />
          <Route path="/c/:slug" element={<CanteenEntry />} />
          <Route path="/menu" element={<MenuPage/>} />
          <Route path="/specials" element={<TodaySpecial/>} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/category/:name" element={<CategoryRedirect />} />
          <Route path="/snacks" element={<CategoryRedirect name="Snacks" />} />
          <Route path="/breakfast" element={<CategoryRedirect name="Breakfast" />} />
          <Route path="/lunch" element={<CategoryRedirect name="Lunch" />} />
          <Route path="/beverages" element={<CategoryRedirect name="Beverages" />} />
          <Route path="/track-orders" element={<TrackOrdersPage />} />
        </Route>

        <Route path="/admin/login" element={<AdminLogin />} />
        <Route element={<ProtectedAdminRoute />}>
          <Route path="/admin" element={<AdminDashboard />} />
        </Route>
      </Routes>
    </Suspense>
  );
}

export default App;
