import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  getCustomerNotifications,
  getOwnerNotifications,
} from "../api/customerApi";
import {
  Car,
  Bell,
  User,
  LogOut,
  Menu,
  X,
  LayoutDashboard,
} from "lucide-react";
import { useEffect, useState } from "react";

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false);

  useEffect(() => {
    if (!user || (user.role !== "customer" && user.role !== "owner")) {
      setHasUnreadNotifications(false);
      return;
    }
    const getNotifications =
      user.role === "owner" ? getOwnerNotifications : getCustomerNotifications;
    getNotifications()
      .then((response) =>
        setHasUnreadNotifications(
          response.data.some((notification) => !notification.seen),
        ),
      )
      .catch(() => setHasUnreadNotifications(false));
  }, [user, location.pathname]);

  useEffect(() => {
    const refreshNotifications = () => {
      if (!user || (user.role !== "customer" && user.role !== "owner")) return;
      const getNotifications =
        user.role === "owner"
          ? getOwnerNotifications
          : getCustomerNotifications;
      getNotifications()
        .then((response) =>
          setHasUnreadNotifications(
            response.data.some((notification) => !notification.seen),
          ),
        )
        .catch(() => setHasUnreadNotifications(false));
    };
    window.addEventListener("notifications-updated", refreshNotifications);
    return () =>
      window.removeEventListener("notifications-updated", refreshNotifications);
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-blue-600 p-2 rounded-lg group-hover:bg-blue-700 transition">
              <Car className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">
              Car<span className="text-blue-600">Rent</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link
              to="/"
              className={`text-sm font-medium transition ${isActive("/") ? "text-blue-600" : "text-gray-600 hover:text-blue-600"}`}
            >
              Home
            </Link>
            <Link
              to="/cars"
              className={`text-sm font-medium transition ${isActive("/cars") ? "text-blue-600" : "text-gray-600 hover:text-blue-600"}`}
            >
              Cars
            </Link>
            <Link
              to="/about"
              className={`text-sm font-medium transition ${isActive("/about") ? "text-blue-600" : "text-gray-600 hover:text-blue-600"}`}
            >
              About
            </Link>
            <Link
              to="/contact"
              className={`text-sm font-medium transition ${isActive("/contact") ? "text-blue-600" : "text-gray-600 hover:text-blue-600"}`}
            >
              Contact
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-blue-600 px-3 py-2 rounded-lg hover:bg-blue-50 transition"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    Admin
                  </Link>
                )}
                <Link
                  to="/notifications"
                  className="relative p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                >
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                  {hasUnreadNotifications && (
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                  )}
                </Link>
                <Link
                  to="/profile"
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition"
                >
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    {user.name?.split(" ")[0]}
                  </span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-sm font-medium text-gray-600 hover:text-blue-600 px-4 py-2 transition"
                >
                  Login
                </Link>
                <Link to="/register" className="btn-primary text-sm py-2 px-4">
                  Sign Up
                </Link>
              </>
            )}
          </div>

          <button
            className="md:hidden p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-4 space-y-3">
          <Link
            to="/"
            onClick={() => setMobileOpen(false)}
            className="block text-sm font-medium text-gray-700 py-2"
          >
            Home
          </Link>
          <Link
            to="/cars"
            onClick={() => setMobileOpen(false)}
            className="block text-sm font-medium text-gray-700 py-2"
          >
            Cars
          </Link>
          <Link
            to="/about"
            onClick={() => setMobileOpen(false)}
            className="block text-sm font-medium text-gray-700 py-2"
          >
            About
          </Link>
          <Link
            to="/contact"
            onClick={() => setMobileOpen(false)}
            className="block text-sm font-medium text-gray-700 py-2"
          >
            Contact
          </Link>
          {user ? (
            <>
              <Link
                to="/my-bookings"
                onClick={() => setMobileOpen(false)}
                className="block text-sm font-medium text-gray-700 py-2"
              >
                My Bookings
              </Link>
              <Link
                to="/notifications"
                onClick={() => setMobileOpen(false)}
                className="block text-sm font-medium text-gray-700 py-2"
              >
                Notifications
              </Link>
              <Link
                to="/profile"
                onClick={() => setMobileOpen(false)}
                className="block text-sm font-medium text-gray-700 py-2"
              >
                Profile
              </Link>
              {isAdmin && (
                <Link
                  to="/admin"
                  onClick={() => setMobileOpen(false)}
                  className="block text-sm font-medium text-gray-700 py-2"
                >
                  Admin Dashboard
                </Link>
              )}
              <button
                onClick={() => {
                  handleLogout();
                  setMobileOpen(false);
                }}
                className="block text-sm font-medium text-red-600 py-2"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                onClick={() => setMobileOpen(false)}
                className="block text-sm font-medium text-gray-700 py-2"
              >
                Login
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileOpen(false)}
                className="block btn-primary text-center text-sm"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
