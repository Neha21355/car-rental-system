import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Car, Eye, EyeOff, Mail, Lock, User, Phone, MapPin, FileText } from 'lucide-react';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', address: '', licenseNumber: '' });
  const [role, setRole] = useState('customer');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { register, user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (!authLoading && user) navigate(user.role === 'owner' || user.role === 'admin' ? '/admin' : '/dashboard', { replace: true });
  }, [authLoading, user, navigate]);
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await register({ ...form, role });
      navigate(user.role === 'owner' ? '/admin' : '/dashboard', { replace: true });
    } catch (err) {
      setError(err.message || 'We could not create your account. Please review your details and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 relative">
        <img src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200&q=80" alt="Car" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/60 to-transparent" />
        <div className="relative z-10 flex flex-col justify-end p-12 text-white">
          <h2 className="text-4xl font-bold mb-3">Join the Journey</h2>
          <p className="text-lg text-blue-100">A better way to find and share your next ride.</p>
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 bg-slate-50">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-xl p-8 sm:p-10">
            <div className="flex flex-col items-center mb-8">
              <div className="bg-blue-600 p-3 rounded-xl mb-3"><Car className="w-8 h-8 text-white" /></div>
              <h1 className="text-2xl font-bold text-gray-900">CarRent</h1>
            </div>
            <h2 className="text-xl font-semibold text-center mb-1">Create Account</h2>
            <p className="text-sm text-gray-500 text-center mb-6">Register for your CarRent account</p>
            {error && <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg break-words">{error}</div>}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Register as</label>
                <div className="grid grid-cols-2 gap-2">
                  <button type="button" onClick={() => setRole('customer')} className={`py-2 rounded-lg text-sm font-medium border ${role === 'customer' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-300'}`}>Customer</button>
                  <button type="button" onClick={() => setRole('owner')} className={`py-2 rounded-lg text-sm font-medium border ${role === 'owner' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-300'}`}>Car Owner</button>
                </div>
              </div>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input name="name" value={form.name} onChange={handleChange} className="input-field pl-10" placeholder="Full Name" required />
              </div>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input type="email" name="email" value={form.email} onChange={handleChange} className="input-field pl-10" placeholder="Email" required />
              </div>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input name="phone" value={form.phone} onChange={handleChange} className="input-field pl-10" placeholder="Phone (9876543210)" pattern="[6-9][0-9]{9}" required />
              </div>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input name="address" value={form.address} onChange={handleChange} className="input-field pl-10" placeholder="Address" required />
              </div>
              {role === 'owner' && (
                <div className="relative">
                  <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input name="licenseNumber" value={form.licenseNumber} onChange={handleChange} className="input-field pl-10" placeholder="Driving License Number" minLength={5} maxLength={30} required />
                </div>
              )}
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input type={showPass ? 'text' : 'password'} name="password" value={form.password} onChange={handleChange} className="input-field pl-10 pr-10" placeholder="Password (min 8)" required minLength={8} />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">{showPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}</button>
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full py-3 disabled:opacity-60">{loading ? 'Creating...' : 'Sign Up'}</button>
            </form>
            <p className="mt-6 text-center text-sm text-gray-500">Already have an account? <Link to="/login" className="text-blue-600 font-semibold">Login</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
}
