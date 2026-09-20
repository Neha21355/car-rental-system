import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getAllCarsCustomer, mapCar, bookCar } from '../api/carApi';

export default function Booking() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [car, setCar] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const today = new Date().toISOString().split('T')[0];
  const [form, setForm] = useState({
    pickupDate: today,
    pickupLocation: 'Noida',
    dropLocation: 'Delhi',
    name: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || '',
  });

  useEffect(() => {
    async function load() {
      try {
        const res = await getAllCarsCustomer();
        if (Array.isArray(res.data)) {
          setCar(res.data.map(mapCar).find((c) => c.id === Number(id)) || null);
        }
      } catch { setCar(null); }
    }
    load();
  }, [id]);

  if (!car) return <div className="p-20 text-center text-gray-500">Car not found</div>;

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await bookCar(car.id, {
        journeyDate: form.pickupDate,
        source: form.pickupLocation,
        destination: form.dropLocation,
      });
      const booking = res.data?.booking;
      navigate('/confirmation', {
        state: {
          car, ...form,
          bookingId: booking?.id ? `CRN${booking.id}` : 'CRN' + Math.floor(100000 + Math.random() * 900000),
          apiMessage: res.data?.message,
        },
      });
    } catch (err) {
      setError(err.message || 'Booking failed. Login as Customer required.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {error && <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg">{error}</div>}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <form onSubmit={handleSubmit} className="lg:col-span-3 space-y-6">
          <div className="card p-6">
            <h2 className="text-lg font-semibold mb-4">Booking Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Journey Date</label>
                <input type="date" name="pickupDate" value={form.pickupDate} min={today} onChange={handleChange} className="input-field" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Source</label>
                <select name="pickupLocation" value={form.pickupLocation} onChange={handleChange} className="input-field">
                  <option>Noida</option><option>Delhi</option><option>Gurgaon</option><option>Mumbai</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Destination</label>
                <select name="dropLocation" value={form.dropLocation} onChange={handleChange} className="input-field">
                  <option>Delhi</option><option>Noida</option><option>Gurgaon</option><option>Mumbai</option>
                </select>
              </div>
            </div>
          </div>
          <div className="card p-6">
            <h2 className="text-lg font-semibold mb-4">Personal Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input name="name" value={form.name} onChange={handleChange} className="input-field" placeholder="Name" required />
              <input name="phone" value={form.phone} onChange={handleChange} className="input-field" placeholder="Phone" required />
              <input type="email" name="email" value={form.email} onChange={handleChange} className="input-field sm:col-span-2" placeholder="Email" required />
            </div>
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full py-3.5 disabled:opacity-60">
            {loading ? 'Confirming booking...' : 'Confirm booking'}
          </button>
        </form>
        <div className="lg:col-span-2">
          <div className="card p-6 sticky top-24">
            <div className="flex gap-4 mb-4">
              <img src={car.image} alt={car.name} className="w-24 h-20 object-cover rounded-lg" />
              <div>
                <h3 className="font-semibold">{car.name}</h3>
                <p className="text-sm font-bold text-blue-600 mt-1">₹{Number(car.price).toLocaleString()}/day</p>
              </div>
            </div>
            <div className="border-t pt-4 flex justify-between font-bold">
              <span>Price per day</span>
              <span className="text-blue-600">₹{Number(car.price).toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
