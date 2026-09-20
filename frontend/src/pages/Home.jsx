import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAllCarsCustomer, mapCar } from '../api/carApi';
import { Search, Star, MapPin, Calendar, Shield, Headphones, CreditCard, Car } from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();
  const [pickup, setPickup] = useState('Noida');
  const today = new Date().toISOString().split('T')[0];
  const [pickupDate, setPickupDate] = useState(today);
  const [returnDate, setReturnDate] = useState(today);
  const [popularCars, setPopularCars] = useState([]);

  useEffect(() => {
    getAllCarsCustomer().then((response) => {
      if (Array.isArray(response.data)) setPopularCars(response.data.map(mapCar).slice(0, 4));
    }).catch(() => setPopularCars([]));
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/cars?pickup=${pickup}&from=${pickupDate}&to=${returnDate}`);
  };

  return (
    <div>
      {/* Hero */}
      <section className="relative h-[520px] sm:h-[580px] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1600&q=80"
          alt="Hero car"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 via-slate-900/50 to-transparent" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight max-w-2xl">
            Find Your Perfect Car
          </h1>
          <p className="mt-3 text-lg sm:text-xl text-blue-100 max-w-lg">
            Affordable. Reliable. Anywhere.
          </p>

          {/* Search Card */}
          <form onSubmit={handleSearch} className="mt-8 bg-white rounded-2xl shadow-2xl p-4 sm:p-6 max-w-4xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Pickup Location</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <select value={pickup} onChange={(e) => setPickup(e.target.value)} className="input-field pl-9 text-sm">
                    <option>Noida</option>
                    <option>Delhi</option>
                    <option>Gurgaon</option>
                    <option>Mumbai</option>
                    <option>Bangalore</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Pickup Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input type="date" min={today} value={pickupDate} onChange={(e) => setPickupDate(e.target.value)} className="input-field pl-9 text-sm" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Return Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input type="date" min={pickupDate} value={returnDate} onChange={(e) => setReturnDate(e.target.value)} className="input-field pl-9 text-sm" />
                </div>
              </div>
              <div className="flex items-end">
                <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2 py-2.5">
                  <Search className="w-4 h-4" />
                  Search
                </button>
              </div>
            </div>
          </form>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: Car, title: 'Wide Range', desc: '100+ cars available' },
            { icon: CreditCard, title: 'Best Prices', desc: 'Transparent pricing' },
            { icon: Headphones, title: '24/7 Support', desc: 'Always here to help' },
            { icon: Shield, title: 'Easy Booking', desc: 'Book in minutes' },
          ].map((f, i) => (
            <div key={i} className="bg-white rounded-xl shadow-md p-5 flex items-center gap-4 hover:shadow-lg transition">
              <div className="bg-blue-50 p-3 rounded-xl">
                <f.icon className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-sm">{f.title}</h3>
                <p className="text-xs text-gray-500">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Popular Cars */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Popular Cars</h2>
          <Link to="/cars" className="text-blue-600 font-semibold text-sm hover:text-blue-700 flex items-center gap-1">
            View All →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {popularCars.map((car) => (
            <div key={car.id} className="card group hover:shadow-xl transition-all duration-300">
              <div className="relative h-44 overflow-hidden">
                <img src={car.image} alt={car.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                <span className="absolute top-3 left-3 badge bg-white/90 text-gray-700 backdrop-blur-sm">{car.type}</span>
                <span className={`absolute top-3 right-3 badge ${car.status === 'AVAILABLE' ? 'bg-green-100 text-green-700' : car.status === 'PENDING' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>{car.status === 'AVAILABLE' ? 'Available' : car.status === 'PENDING' ? 'Pending' : 'Occupied'}</span>
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900">{car.name}</h3>
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                      <span className="text-sm font-medium text-gray-700">{car.rating}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-blue-600">₹{car.price.toLocaleString()}</p>
                    <p className="text-xs text-gray-400">/day</p>
                    <p className="text-xs text-gray-500 mt-1">₹{Number(car.pricePerKm).toLocaleString()}/km</p>
                  </div>
                </div>
                {car.status === 'AVAILABLE' ? <Link to={`/cars/${car.id}`} className="mt-4 block btn-primary text-center text-sm py-2">Book Now</Link> : <span className="mt-4 block text-center text-sm py-2 rounded-lg bg-gray-100 text-gray-500">Not Available</span>}
              </div>
            </div>
          ))}
          {popularCars.length === 0 && <p className="col-span-full text-center py-12 text-gray-500">No cars are available right now.</p>}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-blue-600 py-16">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to hit the road?</h2>
          <p className="text-blue-100 mb-8 text-lg">Browse our collection of premium cars and book your next adventure today.</p>
          <Link to="/cars" className="inline-flex items-center gap-2 bg-white text-blue-600 font-semibold px-8 py-3 rounded-lg hover:bg-blue-50 transition shadow-lg">
            Explore Cars
          </Link>
        </div>
      </section>
    </div>
  );
}
