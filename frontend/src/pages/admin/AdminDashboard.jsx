import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Car, Calendar, LayoutDashboard, LogOut, CheckCircle, Clock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getAllCarsOwner, getAllBookingsOwner, mapCar } from '../../api/carApi';

export default function AdminDashboard() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [cars, setCars] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadOwnerData() {
      try {
        const [carsResponse, bookingsResponse] = await Promise.all([getAllCarsOwner(), getAllBookingsOwner()]);
        if (!Array.isArray(carsResponse.data)) throw new Error(carsResponse.data || 'Unable to load cars');
        if (!Array.isArray(bookingsResponse.data)) throw new Error(bookingsResponse.data || 'Unable to load bookings');
        setCars(carsResponse.data.map(mapCar));
        setBookings(bookingsResponse.data);
      } catch (err) {
        setError(err.message || 'Unable to load dashboard data');
      } finally {
        setLoading(false);
      }
    }
    loadOwnerData();
  }, []);

  const stats = [
    { label: 'Your Cars', value: cars.length, icon: Car, color: 'bg-green-500' },
    { label: 'Available Cars', value: cars.filter((car) => car.status === 'AVAILABLE').length, icon: CheckCircle, color: 'bg-blue-500' },
    { label: 'Pending Bookings', value: bookings.filter((booking) => booking.status === 'PENDING').length, icon: Calendar, color: 'bg-amber-500' },
    { label: 'Total Bookings', value: bookings.length, icon: Calendar, color: 'bg-purple-500' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex gap-6">
        {/* Sidebar */}
        <aside className="hidden md:block w-56 shrink-0">
          <div className="card p-4 sticky top-24">
            <nav className="space-y-1">
              <Link to="/admin" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium bg-blue-50 text-blue-700">
                <LayoutDashboard className="w-4 h-4" /> Dashboard
              </Link>
              <Link to="/admin/cars" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
                <Car className="w-4 h-4" /> Cars
              </Link>
              <Link to="/admin/bookings" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
                <Calendar className="w-4 h-4" /> Bookings
              </Link>
              <button
                onClick={() => { logout(); navigate('/login'); }}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-600 hover:bg-red-50 w-full"
              >
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </nav>
          </div>
        </aside>

        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>

          {/* Stats */}
          {error && <div className="mb-4 p-3 bg-red-50 border border-red-100 text-red-700 text-sm rounded-lg">{error}</div>}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((s) => (
              <div key={s.label} className="card p-5 flex items-center gap-4">
                <div className={`${s.color} p-3 rounded-xl text-white`}>
                  <s.icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">{s.label}</p>
                  <p className="text-xl font-bold text-gray-900">{s.value}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-900">All Booking Requests</h2>
              <Link to="/admin/bookings" className="text-sm font-medium text-blue-600 hover:text-blue-700">View all</Link>
            </div>
            {loading ? <p className="py-8 text-center text-gray-500">Loading dashboard...</p> : bookings.length === 0 ? <p className="py-8 text-center text-gray-500">No booking requests yet.</p> : <div className="space-y-3">{bookings.slice(0, 5).map((booking) => <div key={booking.id} className="flex items-center justify-between border-b border-gray-100 pb-3"><div><p className="font-medium text-gray-900">{booking.carName || 'Car'} <span className="font-normal text-gray-500">({booking.vehicleNumber || 'No vehicle number'})</span></p><p className="text-sm text-gray-500">{booking.source || '—'} → {booking.destination || '—'}</p></div><span className={`badge ${booking.status === 'ACCEPTED' ? 'bg-green-100 text-green-700' : booking.status === 'REJECTED' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>{booking.status}</span></div>)}</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
