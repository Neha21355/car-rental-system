import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, LayoutDashboard, Calendar, Bell, LogOut } from 'lucide-react';
import { getCustomerProfile, updateCustomerProfile } from '../api/customerApi';

export default function Profile() {
  const { user, updateProfile, logout } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getCustomerProfile().then((response) => setForm({ name: response.data.name || '', email: response.data.email || '', phone: response.data.phoneNumber || '', address: response.data.address || '' })).catch((err) => setError(err.message)).finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const response = await updateCustomerProfile(form);
      updateProfile({ name: response.data.name, email: response.data.email, phone: response.data.phoneNumber, address: response.data.address });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) { setError(err.message); }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sidebar */}
        <aside className="card p-4 h-fit">
          <nav className="space-y-1">
            <Link to="/dashboard" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
              <LayoutDashboard className="w-4 h-4" /> Dashboard
            </Link>
            <Link to="/my-bookings" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
              <Calendar className="w-4 h-4" /> My Bookings
            </Link>
            <Link to="/profile" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium bg-blue-50 text-blue-700">
              <User className="w-4 h-4" /> Profile
            </Link>
            <Link to="/notifications" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
              <Bell className="w-4 h-4" /> Notifications
            </Link>
            <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-600 hover:bg-red-50 w-full">
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </nav>
        </aside>

        {/* Main */}
        <div className="md:col-span-3">
          <div className="card p-6 sm:p-8">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">{user?.name}</h1>
                <p className="text-sm text-gray-500">{user?.email}</p>
              </div>
            </div>

            <form onSubmit={handleSave} className="space-y-5 max-w-md">
              {error && <div className="p-3 bg-red-50 text-red-700 text-sm rounded-lg">{error}</div>}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Name</label>
                <input name="name" value={form.name} onChange={handleChange} className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                <input type="email" name="email" value={form.email} onChange={handleChange} className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone</label>
                <input name="phone" value={form.phone} onChange={handleChange} className="input-field" />
              </div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Address</label><input name="address" value={form.address} onChange={handleChange} className="input-field" /></div>
              <button type="submit" className="btn-primary">
                {saved ? '✓ Updated!' : 'Update Profile'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
