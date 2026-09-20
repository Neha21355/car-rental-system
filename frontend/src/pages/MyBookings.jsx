import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getCustomerBookings } from '../api/customerApi';
import { Calendar, MapPin } from 'lucide-react';

const statusColors = {
  PENDING: 'bg-amber-100 text-amber-700',
  ACCEPTED: 'bg-green-100 text-green-700',
  REJECTED: 'bg-red-100 text-red-700',
};
const visibleStatuses = Object.keys(statusColors);

export default function MyBookings() {
  const [filter, setFilter] = useState('All');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const tabs = ['All', 'PENDING', 'ACCEPTED', 'REJECTED'];

  useEffect(() => {
    getCustomerBookings().then((response) => setBookings(response.data.filter((booking) => visibleStatuses.includes(booking.status)))).catch((err) => setError(err.message)).finally(() => setLoading(false));
  }, []);

  const filtered = filter === 'All' ? bookings : bookings.filter((b) => b.status === filter);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Bookings</h1>
      {error && <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-lg">{error}</div>}

      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition ${
              filter === t ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {loading && <div className="text-center py-16 text-gray-500">Loading your bookings...</div>}
        {!loading && filtered.map((b) => (
          <div key={b.id} className="card p-5 flex flex-col sm:flex-row gap-4 items-start sm:items-center hover:shadow-md transition">
            <img src={`https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=400&q=80&sig=${b.carId}`} alt={b.carName} className="w-full sm:w-32 h-24 object-cover rounded-xl" />
            <div className="flex-1">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-semibold text-gray-900">{b.carName}</h3>
                  <p className="text-xs text-gray-500 mt-0.5">{b.fuelType} · {b.seatingCapacity} seats</p>
                </div>
                <span className={`badge ${statusColors[b.status]}`}>{b.status}</span>
              </div>
              <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-500">
                <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{b.journeyDate}</span>
                <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{b.source} → {b.destination}</span>
              </div>
              <p className="text-sm font-semibold text-gray-800 mt-2">₹{Number(b.pricePerDay).toLocaleString()} per day</p>
            </div>
            <Link to={`/cars/${b.carId}`} className="text-sm font-semibold text-blue-600 hover:text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-50 transition whitespace-nowrap">
              View
            </Link>
          </div>
        ))}
        {!loading && filtered.length === 0 && (
          <div className="text-center py-16 text-gray-500">
            <p>No {filter.toLowerCase()} bookings found</p>
            <Link to="/cars" className="text-blue-600 font-medium mt-2 inline-block">Browse cars</Link>
          </div>
        )}
      </div>
    </div>
  );
}
