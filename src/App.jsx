import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import ScrollToTop from './components/ScrollToTop.jsx';
import Home from './pages/Home.jsx';
import Explore from './pages/Explore.jsx';
import EntrepreneurProfile from './pages/EntrepreneurProfile.jsx';
import ProductDetails from './pages/ProductDetails.jsx';
import ServiceRequest from './pages/ServiceRequest.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Cart from './pages/Cart.jsx';
import CheckoutSuccess from './pages/CheckoutSuccess.jsx';
import CustomerDashboard from './pages/CustomerDashboard.jsx';
import EntrepreneurDashboard from './pages/EntrepreneurDashboard.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import NotFound from './pages/NotFound.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

export default function App() {
  return (
    <HashRouter>
      <ScrollToTop />
      <Navbar />
      <main id="main-content" style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/maker/:id" element={<EntrepreneurProfile />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/request/:makerId/:serviceId?" element={<ServiceRequest />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/cart" element={<Cart />} />
          <Route
            path="/checkout/success"
            element={
              <ProtectedRoute roles={['customer', 'entrepreneur', 'admin']}>
                <CheckoutSuccess />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute roles={['customer', 'entrepreneur', 'admin']}>
                <CustomerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/seller/*"
            element={
              <ProtectedRoute roles={['entrepreneur', 'admin']}>
                <EntrepreneurDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute roles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/404" element={<NotFound />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </main>
      <Footer />
    </HashRouter>
  );
}
