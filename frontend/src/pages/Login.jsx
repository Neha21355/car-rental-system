import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Car, Eye, EyeOff, Mail, Lock } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('customer');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get('redirect');
  const destinationFor = (authenticatedUser) => redirectTo?.startsWith('/') ? redirectTo : authenticatedUser.role === 'owner' || authenticatedUser.role === 'admin' ? '/admin' : '/dashboard';

  useEffect(() => {
    if (!authLoading && user) navigate(destinationFor(user), { replace: true });
  }, [authLoading, user, navigate, redirectTo]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login({ email, password, role });
      navigate(destinationFor(user), { replace: true });
    } catch (err) {
      setError(err.message || 'We could not sign you in. Please check your details and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 relative">
        <img src="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=1200&q=80" alt="Road" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/60 to-transparent" />
        <div className="relative z-10 flex flex-col justify-end p-12 text-white">
          <h2 className="text-4xl font-bold mb-3">Drive Your Dreams</h2>
          <p className="text-lg text-blue-100 max-w-md">Your next journey starts here.</p>
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 bg-slate-50">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-xl p-8 sm:p-10">
            <div className="flex flex-col items-center mb-8">
              <div className="bg-blue-600 p-3 rounded-xl mb-3"><Car className="w-8 h-8 text-white" /></div>
              <h1 className="text-2xl font-bold text-gray-900">CarRent</h1>
              <p className="text-sm text-gray-500 mt-1">Drive Your Dreams</p>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 text-center mb-1">Welcome Back</h2>
            <p className="text-sm text-gray-500 text-center mb-6">Sign in to your account</p>
            {error && <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100 break-words">{error}</div>}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Login as</label>
                <div className="grid grid-cols-2 gap-2">
                  <button type="button" onClick={() => setRole('customer')} className={`py-2 rounded-lg text-sm font-medium border ${role === 'customer' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-300'}`}>Customer</button>
                  <button type="button" onClick={() => setRole('owner')} className={`py-2 rounded-lg text-sm font-medium border ${role === 'owner' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-300'}`}>Car Owner</button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input-field pl-10" placeholder="you@example.com" required />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input type={showPass ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} className="input-field pl-10 pr-10" placeholder="••••••••" required minLength={8} />
                  <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">{showPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}</button>
                </div>
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-base disabled:opacity-60">{loading ? 'Signing in...' : 'Login'}</button>
            </form>
            <p className="mt-6 text-center text-sm text-gray-500">Don&apos;t have an account? <Link to="/register" className="text-blue-600 font-semibold">Register</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
}
