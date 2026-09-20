import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Car, CheckCircle, Clock } from 'lucide-react';
import { getAllCarsCustomer, mapCar } from '../api/carApi';
import { getCustomerBookings } from '../api/customerApi';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { user } = useAuth();
  const [cars, setCars] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadDashboard() {
      try {
        const [carsResponse, bookingsResponse] = await Promise.all([getAllCarsCustomer(), getCustomerBookings()]);
        if (Array.isArray(carsResponse.data)) setCars(carsResponse.data.map(mapCar));
        if (Array.isArray(bookingsResponse.data)) setBookings(bookingsResponse.data);
      } catch (err) {
        setError(err.message || 'Unable to load dashboard data');
      } finally {
        setLoading(false);
      }
    }
    loadDashboard();
  }, []);

  const pending = bookings.filter((booking) => booking.status === 'PENDING').length;
  const accepted = bookings.filter((booking) => booking.status === 'ACCEPTED').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8"><p className="text-sm text-blue-600 font-medium">Customer dashboard</p><h1 className="text-3xl font-bold text-gray-900 mt-1">Welcome back, {user?.name || 'Customer'}</h1><p className="text-gray-500 mt-2">Track your bookings and find your next car.</p></div>
      {error && <div className="mb-5 p-3 bg-red-50 border border-red-100 text-red-700 text-sm rounded-lg">{error}</div>}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[{ label: 'Available cars', value: cars.length, icon: Car, color: 'bg-blue-500' }, { label: 'Pending bookings', value: pending, icon: Clock, color: 'bg-amber-500' }, { label: 'Accepted bookings', value: accepted, icon: CheckCircle, color: 'bg-green-500' }].map((stat) => <div key={stat.label} className="card p-5 flex items-center gap-4"><div className={`${stat.color} p-3 rounded-xl text-white`}><stat.icon className="w-5 h-5" /></div><div><p className="text-xs text-gray-500">{stat.label}</p><p className="text-2xl font-bold text-gray-900">{loading ? '...' : stat.value}</p></div></div>)}
      </div>
      <div className="card p-6"><div className="flex items-center justify-between mb-5"><h2 className="font-semibold text-gray-900">Recent bookings</h2><Link to="/my-bookings" className="text-sm font-medium text-blue-600">View all</Link></div>{loading ? <p className="py-8 text-center text-gray-500">Loading your activity...</p> : bookings.length === 0 ? <div className="py-8 text-center text-gray-500"><p>No bookings yet.</p><Link to="/cars" className="text-blue-600 font-medium mt-2 inline-block">Browse cars</Link></div> : <div className="space-y-3">{bookings.slice(0, 5).map((booking) => <div key={booking.id} className="flex items-center justify-between border-b border-gray-100 pb-3"><div><p className="font-medium text-gray-900">{booking.carName}</p><p className="text-sm text-gray-500">{booking.source} → {booking.destination}</p></div><span className="badge bg-blue-100 text-blue-700">{booking.status}</span></div>)}</div>}</div>
      <div className="mt-6 flex gap-3"><Link to="/cars" className="btn-primary flex items-center gap-2"><Car className="w-4 h-4" /> Browse Cars</Link><Link to="/my-bookings" className="btn-secondary flex items-center gap-2"><Calendar className="w-4 h-4" /> My Bookings</Link></div>
    </div>
  );
}