import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllCarsOwner, mapCar, registerCar, updateCar, deleteCar } from '../../api/carApi';
import { Plus, Pencil, Trash2, LayoutDashboard, Car, Calendar, Users, LogOut, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function ManageCars() {
  const emptyForm = { vehicleNumber: '', brand: '', model: '', fuelType: 'Petrol', seatingCapacity: '', pricePerDay: '', pricePerKm: '' };
  const [carList, setCarList] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const { logout } = useAuth();
  const navigate = useNavigate();

  const loadCars = async () => {
    setLoading(true);
    try {
      const response = await getAllCarsOwner();
      if (!Array.isArray(response.data)) throw new Error(response.data || 'Unable to load your cars');
      setCarList(response.data.map(mapCar));
    } catch (err) {
      setError(err.message || 'Unable to load your cars');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadCars(); }, []);

  const openAddForm = () => { setEditingId(null); setForm(emptyForm); setError(''); setShowForm(true); };
  const openEditForm = (car) => {
    setEditingId(car.id);
    setForm({ vehicleNumber: car.vehicleNumber, brand: car.brand, model: car.model, fuelType: car.raw?.fuelType || car.fuel, seatingCapacity: car.raw?.seatingCapacity || car.seats, pricePerDay: car.raw?.pricePerDay || car.price, pricePerKm: car.raw?.pricePerKm || car.pricePerKm });
    setError('');
    setShowForm(true);
  };
  const handleChange = (event) => setForm({ ...form, [event.target.name]: event.target.value });
  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    const payload = { ...form, seatingCapacity: Number(form.seatingCapacity), pricePerDay: Number(form.pricePerDay), pricePerKm: Number(form.pricePerKm) };
    try {
      if (editingId) await updateCar(editingId, payload);
      else await registerCar(payload);
      setShowForm(false);
      setForm(emptyForm);
      setEditingId(null);
      await loadCars();
    } catch (err) {
      setError(err.message || 'Unable to save car');
    } finally {
      setSaving(false);
    }
  };
  const handleDelete = async (car) => {
    if (!window.confirm(`Delete ${car.name}? Only available cars can be deleted.`)) return;
    try {
      await deleteCar(car.id);
      setCarList((current) => current.filter((item) => item.id !== car.id));
    } catch (err) {
      setError(err.message || 'Unable to delete car');
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
              <Link to="/admin/cars" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium bg-blue-50 text-blue-700">
                <Car className="w-4 h-4" /> Cars
              </Link>
              <Link to="/admin/bookings" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
                <Calendar className="w-4 h-4" /> Bookings
              </Link>
              <Link to="/admin" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
                <Users className="w-4 h-4" /> Users
              </Link>
              <button onClick={() => { logout(); navigate('/login'); }} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-600 hover:bg-red-50 w-full">
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </nav>
          </div>
        </aside>

        <div className="flex-1">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Manage Cars</h1>
            <button onClick={openAddForm} className="btn-primary flex items-center gap-2 text-sm py-2">
              <Plus className="w-4 h-4" /> Add New Car
            </button>
          </div>

          {error && <div className="mb-4 p-3 bg-red-50 border border-red-100 text-red-700 text-sm rounded-lg">{error}</div>}
          {showForm && <form onSubmit={handleSubmit} className="card p-5 mb-6">
            <div className="flex items-center justify-between mb-4"><h2 className="font-semibold text-gray-900">{editingId ? 'Edit car' : 'Add a new car'}</h2><button type="button" onClick={() => setShowForm(false)} className="p-1 text-gray-400" aria-label="Close form"><X className="w-5 h-5" /></button></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <input name="vehicleNumber" value={form.vehicleNumber} onChange={handleChange} className="input-field" placeholder="Vehicle Number" required />
              <input name="brand" value={form.brand} onChange={handleChange} className="input-field" placeholder="Brand" required />
              <input name="model" value={form.model} onChange={handleChange} className="input-field" placeholder="Model" required />
              <select name="fuelType" value={form.fuelType} onChange={handleChange} className="input-field" required><option>Petrol</option><option>Diesel</option><option>Electric</option><option>Hybrid</option></select>
              <input type="number" name="seatingCapacity" value={form.seatingCapacity} onChange={handleChange} className="input-field" placeholder="Seats" min="1" required />
              <input type="number" name="pricePerDay" value={form.pricePerDay} onChange={handleChange} className="input-field" placeholder="Price per day" min="0.01" step="0.01" required />
              <input type="number" name="pricePerKm" value={form.pricePerKm} onChange={handleChange} className="input-field" placeholder="Price per km" min="0.01" step="0.01" required />
            </div>
            <button type="submit" disabled={saving} className="btn-primary mt-4 disabled:opacity-60">{saving ? 'Saving...' : editingId ? 'Save Changes' : 'Register Car'}</button>
          </form>}

          <div className="card overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-left text-gray-500">
                  <th className="px-4 py-3 font-medium">#</th>
                  <th className="px-4 py-3 font-medium">Image</th>
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Type</th>
                  <th className="px-4 py-3 font-medium">Price/Day</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading && <tr><td colSpan="7" className="px-4 py-10 text-center text-gray-500">Loading your cars...</td></tr>}
                {!loading && carList.map((car, i) => (
                  <tr key={car.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                    <td className="px-4 py-3 text-gray-500">{i + 1}</td>
                    <td className="px-4 py-3">
                      <img src={car.image} alt="" className="w-14 h-10 object-cover rounded-lg" />
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-900">{car.name}</td>
                      <td className="px-4 py-3 text-gray-600">{car.fuel}</td>
                    <td className="px-4 py-3 font-semibold">₹{car.price.toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <span className={`badge ${car.status === 'AVAILABLE' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>{car.status}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button onClick={() => openEditForm(car)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition" title="Edit car">
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(car)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition" title="Delete car">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {!loading && carList.length === 0 && <tr><td colSpan="7" className="px-4 py-10 text-center text-gray-500">No cars registered yet. Add your first car above.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
