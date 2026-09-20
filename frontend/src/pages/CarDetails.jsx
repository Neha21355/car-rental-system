import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getAllCarsCustomer, mapCar } from '../api/carApi';
import { Star, Fuel, Users, Settings, Calendar, ChevronLeft } from 'lucide-react';

export default function CarDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);

  useEffect(() => {
    let cancelled = false;
    async function loadCar() {
      try {
        const response = await getAllCarsCustomer();
        if (Array.isArray(response.data) && !cancelled) {
          setCar(response.data.map(mapCar).find((item) => String(item.id) === String(id)) || null);
        }
      } catch {
        if (!cancelled) setCar(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    loadCar();
    return () => { cancelled = true; };
  }, [id]);

  if (loading) {
    return <div className="max-w-7xl mx-auto px-4 py-20 text-center text-gray-500">Loading car details...</div>;
  }

  if (!car) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <p className="text-gray-500 text-lg">Car not found</p>
        <Link to="/cars" className="text-blue-600 font-medium mt-4 inline-block">← Back to cars</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-sm text-gray-500 hover:text-blue-600 mb-6">
        <ChevronLeft className="w-4 h-4" /> Back
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Images */}
        <div>
          <div className="rounded-2xl overflow-hidden bg-gray-100 h-72 sm:h-96">
            <img src={car.images?.[activeImg] || car.image} alt={car.name} className="w-full h-full object-cover" />
          </div>
          {car.images?.length > 1 && (
            <div className="flex gap-3 mt-3">
              {car.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`w-20 h-16 rounded-lg overflow-hidden border-2 transition ${activeImg === i ? 'border-blue-600' : 'border-transparent'}`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{car.name}</h1>
              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <span className="font-semibold text-gray-800">{car.rating}</span>
                </div>
                <span className="text-sm text-gray-400">({car.reviews} reviews)</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-blue-600">₹{car.price.toLocaleString()}</p>
              <p className="text-sm text-gray-400">/day</p>
              <p className="text-sm text-gray-500 mt-1">₹{Number(car.pricePerKm).toLocaleString()}/km</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
            {[
              { icon: Settings, label: car.type },
              { icon: Fuel, label: car.fuel },
              { icon: Settings, label: car.transmission },
              { icon: Users, label: `${car.seats} Seats` },
            ].map((s, i) => (
              <div key={i} className="bg-gray-50 rounded-xl p-3 text-center">
                <s.icon className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                <p className="text-xs font-medium text-gray-700">{s.label}</p>
              </div>
            ))}
          </div>

          <div className="mt-6">
            <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
            <p className="text-gray-600 text-sm leading-relaxed">{car.description}</p>
          </div>

          <div className="mt-6 flex items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              Available from 10 Sep 2026
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              to 12 Sep 2026
            </div>
          </div>

          <div className={`mt-6 inline-flex badge ${car.status === 'AVAILABLE' ? 'bg-green-100 text-green-700' : car.status === 'PENDING' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>
            {car.status === 'AVAILABLE' ? 'Available' : car.status === 'PENDING' ? 'Pending booking' : 'Occupied'}
          </div>
          {car.status === 'AVAILABLE' ? <Link to={`/booking/${car.id}`} className="mt-4 btn-primary w-full block text-center py-3.5 text-base">Book Now</Link> : <button type="button" disabled className="mt-4 w-full py-3.5 rounded-lg bg-gray-200 text-gray-500 font-semibold cursor-not-allowed">Not Available</button>}
        </div>
      </div>
    </div>
  );
}
