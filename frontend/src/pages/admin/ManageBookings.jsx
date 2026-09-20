import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAllBookingsOwner, updateBookingStatus } from '../../api/carApi';
import { LayoutDashboard, Car, Calendar, LogOut, Check, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const statusColors = {
  PENDING: 'bg-amber-100 text-amber-700',
  ACCEPTED: 'bg-green-100 text-green-700',
  REJECTED: 'bg-red-100 text-red-700',
};

export default function ManageBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);
  const [error, setError] = useState('');
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    async function loadBookings() {
      try {
        const response = await getAllBookingsOwner();
        if (!Array.isArray(response.data)) throw new Error(response.data || 'Unable to load bookings');
        setBookings(response.data);
      } catch (err) {
        setError(err.message || 'Unable to load bookings');
      } finally {
        setLoading(false);
      }
    }
    loadBookings();
  }, []);

  const handleStatus = async (bookingId, status) => {
    setUpdating(bookingId);
    setError('');
    try {
      await updateBookingStatus(bookingId, status);
      setBookings((current) => current.filter((booking) => booking.id !== bookingId));
    } catch (err) {
      setError(err.message || 'Unable to update booking');
    } finally {
      setUpdating(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex gap-6">
        <aside className="hidden md:block w-56 shrink-0">
          <div className="card p-4 sticky top-24">
            <nav className="space-y-1">
              <Link to="/admin" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
                <LayoutDashboard className="w-4 h-4" /> Dashboard
              </Link>
              <Link to="/admin/cars" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
                <Car className="w-4 h-4" /> Cars
              </Link>
              <Link to="/admin/bookings" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium bg-blue-50 text-blue-700">
                <Calendar className="w-4 h-4" /> Bookings
              </Link>
              <button onClick={() => { logout(); navigate('/login'); }} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-600 hover:bg-red-50 w-full">
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </nav>
          </div>
        </aside>

        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Manage Bookings</h1>
          {error && <div className="mb-4 p-3 bg-red-50 border border-red-100 text-red-700 text-sm rounded-lg">{error}</div>}

          <div className="card overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-left text-gray-500">
                  <th className="px-4 py-3 font-medium">#</th>
                  <th className="px-4 py-3 font-medium">Car</th>
                  <th className="px-4 py-3 font-medium">Journey Date</th>
                  <th className="px-4 py-3 font-medium">Route</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading && <tr><td colSpan="6" className="px-4 py-10 text-center text-gray-500">Loading booking requests...</td></tr>}
                {!loading && bookings.map((b) => (
                  <tr key={b.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                    <td className="px-4 py-3 text-gray-500">{b.id}</td>
                    <td className="px-4 py-3 text-gray-600">{b.carName || 'Car'}<br /><span className="text-xs text-gray-400">{b.vehicleNumber || 'No vehicle number'}</span></td>
                    <td className="px-4 py-3 text-gray-600">{b.journeyDate || '—'}</td>
                    <td className="px-4 py-3 text-gray-600">{b.source || '—'} → {b.destination || '—'}</td>
                    <td className="px-4 py-3">
                      <span className={`badge ${statusColors[b.status]}`}>{b.status}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        {b.status === 'PENDING' ? <><button onClick={() => handleStatus(b.id, 'ACCEPTED')} disabled={updating === b.id} className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-green-700 bg-green-50 hover:bg-green-100 rounded-lg disabled:opacity-60"><Check className="w-3.5 h-3.5" /> Approve</button><button onClick={() => handleStatus(b.id, 'REJECTED')} disabled={updating === b.id} className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-red-700 bg-red-50 hover:bg-red-100 rounded-lg disabled:opacity-60"><X className="w-3.5 h-3.5" /> Reject</button></> : b.status === 'ACCEPTED' ? <button onClick={() => handleStatus(b.id, 'COMPLETED')} disabled={updating === b.id} className="px-2.5 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg disabled:opacity-60">Complete ride</button> : <span className="text-xs text-gray-400">Processed</span>}
                      </div>
                    </td>
                  </tr>
                ))}
                {!loading && bookings.length === 0 && <tr><td colSpan="6" className="px-4 py-10 text-center text-gray-500">No pending booking requests.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
