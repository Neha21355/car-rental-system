import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllCarsCustomer, mapCar } from '../api/carApi';
import { Star, Search, SlidersHorizontal, AlertCircle } from 'lucide-react';

export default function CarListing() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState('');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('price-asc');
  const [filters, setFilters] = useState({ type: [], fuel: [], transmission: [], maxPrice: 50000 });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setApiError('');
      try {
        const res = await getAllCarsCustomer();
        const data = res.data;
        if (typeof data === 'string') {
          setApiError(data);
        } else if (Array.isArray(data)) {
          setCars(data.map(mapCar));
        } else {
          setApiError('Unexpected server response');
        }
      } catch (err) {
        setApiError(err.message || 'We could not load the cars right now. Please try again.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  const toggleFilter = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: prev[key].includes(value) ? prev[key].filter((v) => v !== value) : [...prev[key], value],
    }));
  };

  const filtered = useMemo(() => {
    let result = [...cars];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((c) => c.name.toLowerCase().includes(q) || c.brand?.toLowerCase().includes(q));
    }
    if (filters.type.length) result = result.filter((c) => filters.type.includes(c.type));
    if (filters.fuel.length) result = result.filter((c) => filters.fuel.includes(c.fuel));
    result = result.filter((c) => c.price <= filters.maxPrice);
    if (sort === 'price-asc') result.sort((a, b) => a.price - b.price);
    if (sort === 'price-desc') result.sort((a, b) => b.price - a.price);
    if (sort === 'rating') result.sort((a, b) => b.rating - a.rating);
    return result;
  }, [cars, search, filters, sort]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {apiError && (
        <div className="mb-4 flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" /><span>{apiError}</span>
        </div>
      )}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Available Cars</h1>
          <p className="text-sm text-gray-500 mt-1">{loading ? 'Loading...' : `${filtered.length} cars`}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search..." className="input-field pl-9 text-sm py-2" />
          </div>
          <select value={sort} onChange={(e) => setSort(e.target.value)} className="input-field text-sm py-2 w-auto">
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Top Rated</option>
          </select>
          <button onClick={() => setShowFilters(!showFilters)} className="lg:hidden btn-secondary py-2 px-3"><SlidersHorizontal className="w-4 h-4" /></button>
        </div>
      </div>
      <div className="flex gap-8">
        <aside className={`${showFilters ? 'block' : 'hidden'} lg:block w-full lg:w-64 shrink-0`}>
          <div className="card p-5 sticky top-24 space-y-6">
            <h3 className="font-semibold">Filters</h3>
            <div>
              <h4 className="text-sm font-medium mb-2">Fuel</h4>
              {['Petrol', 'Diesel', 'Electric'].map((f) => (
                <label key={f} className="flex items-center gap-2 py-1 cursor-pointer">
                  <input type="checkbox" checked={filters.fuel.includes(f)} onChange={() => toggleFilter('fuel', f)} className="w-4 h-4 text-blue-600 rounded" />
                  <span className="text-sm">{f}</span>
                </label>
              ))}
            </div>
            <div>
              <h4 className="text-sm font-medium mb-2">Max Price: ₹{filters.maxPrice.toLocaleString()}</h4>
              <input type="range" min="0" max="50000" step="500" value={filters.maxPrice} onChange={(e) => setFilters({ ...filters, maxPrice: Number(e.target.value) })} className="w-full accent-blue-600" />
            </div>
          </div>
        </aside>
        <div className="flex-1">
          {loading ? (
            <div className="text-center py-20 text-gray-500">Loading cars...</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {filtered.map((car) => (
                <div key={car.id} className="card group hover:shadow-lg transition">
                  <div className="relative h-40 overflow-hidden">
                    <img src={car.image} alt={car.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                    <span className={`absolute top-3 left-3 badge ${car.status === 'AVAILABLE' ? 'bg-green-100 text-green-700' : car.status === 'PENDING' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>{car.status === 'AVAILABLE' ? 'Available' : car.status === 'PENDING' ? 'Pending' : 'Occupied'}</span>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900">{car.name}</h3>
                    <p className="text-xs text-gray-500">{car.fuel} · {car.seats} seats</p>
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-lg font-bold text-blue-600">₹{Number(car.price).toLocaleString()}<span className="text-xs text-gray-400 font-normal">/day</span></span>
                      <Link to={`/cars/${car.id}`} className="text-sm font-semibold text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded-lg">View Details</Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          {!loading && filtered.length === 0 && (
            <div className="text-center py-20 text-gray-500">
              <p>No cars are available right now.</p>
              <p className="text-sm mt-2">Please check back soon.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
