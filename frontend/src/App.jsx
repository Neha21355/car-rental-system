import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import CarListing from "./pages/CarListing";
import CarDetails from "./pages/CarDetails";
import Booking from "./pages/Booking";
import Payment from "./pages/Payment";
import BookingConfirmation from "./pages/BookingConfirmation";
import MyBookings from "./pages/MyBookings";
import Notifications from "./pages/Notifications";
import Profile from "./pages/Profile";
import Dashboard from "./pages/Dashboard";
import About from "./pages/About";
import Contact from "./pages/Contact";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageCars from "./pages/admin/ManageCars";
import ManageBookings from "./pages/admin/ManageBookings";

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

function AdminRoute({ children }) {
  const { user, loading, isAdmin } = useAuth();
  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  if (!user) return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/" replace />;
  return children;
}

function CustomerRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== "customer") return <Navigate to="/admin" replace />;
  return children;
}

function BookingRoute({ children }) {
  const { user, loading } = useAuth();
  const bookingPath = window.location.pathname;
  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  if (!user)
    return (
      <Navigate
        to={`/login?redirect=${encodeURIComponent(bookingPath)}`}
        replace
      />
    );
  if (user.role !== "customer") return <Navigate to="/admin" replace />;
  return children;
}

function AppLayout({ children, showFooter = true }) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <main className="flex-1">{children}</main>
      {showFooter && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/dashboard"
        element={
          <CustomerRoute>
            <AppLayout>
              <Dashboard />
            </AppLayout>
          </CustomerRoute>
        }
      />

      <Route
        path="/"
        element={
          <AppLayout>
            <Home />
          </AppLayout>
        }
      />
      <Route
        path="/about"
        element={
          <AppLayout>
            <About />
          </AppLayout>
        }
      />
      <Route
        path="/contact"
        element={
          <AppLayout>
            <Contact />
          </AppLayout>
        }
      />
      <Route
        path="/cars"
        element={
          <AppLayout>
            <CarListing />
          </AppLayout>
        }
      />
      <Route
        path="/cars/:id"
        element={
          <AppLayout>
            <CarDetails />
          </AppLayout>
        }
      />

      <Route
        path="/booking/:id"
        element={
          <BookingRoute>
            <AppLayout showFooter={false}>
              <Booking />
            </AppLayout>
          </BookingRoute>
        }
      />
      <Route
        path="/payment"
        element={
          <ProtectedRoute>
            <AppLayout showFooter={false}>
              <Payment />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/confirmation"
        element={
          <ProtectedRoute>
            <AppLayout showFooter={false}>
              <BookingConfirmation />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/my-bookings"
        element={
          <ProtectedRoute>
            <AppLayout>
              <MyBookings />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/notifications"
        element={
          <ProtectedRoute>
            <AppLayout>
              <Notifications />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <AppLayout>
              <Profile />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AppLayout showFooter={false}>
              <AdminDashboard />
            </AppLayout>
          </AdminRoute>
        }
      />
      <Route
        path="/admin/cars"
        element={
          <AdminRoute>
            <AppLayout showFooter={false}>
              <ManageCars />
            </AppLayout>
          </AdminRoute>
        }
      />
      <Route
        path="/admin/bookings"
        element={
          <AdminRoute>
            <AppLayout showFooter={false}>
              <ManageBookings />
            </AppLayout>
          </AdminRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
