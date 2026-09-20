import { createContext, useContext, useState, useEffect } from 'react';
import { loginCustomer, loginCarOwner, registerCustomer, registerCarOwner } from '../api/authApi';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('carrent_user');
    if (saved) {
      try { setUser(JSON.parse(saved)); } catch { localStorage.removeItem('carrent_user'); }
    }
    setLoading(false);
  }, []);

  const persist = (userData) => {
    setUser(userData);
    localStorage.setItem('carrent_user', JSON.stringify(userData));
  };

  const login = async ({ email, password, role = 'customer' }) => {
    if (role === 'owner' || role === 'admin') {
      const res = await loginCarOwner(email, password);
      const userData = { name: email.split('@')[0], email, role: role === 'admin' ? 'admin' : 'owner', message: res.data };
      persist(userData);
      return userData;
    }
    const res = await loginCustomer(email, password);
    const userData = { name: email.split('@')[0], email, role: 'customer', message: res.data };
    persist(userData);
    return userData;
  };

  const register = async (form) => {
    const isOwner = form.role === 'owner';
    const res = isOwner ? await registerCarOwner(form) : await registerCustomer(form);
    const dto = res.data;
    const userData = {
      id: dto.id, name: dto.name, email: dto.email,
      phone: dto.phoneNumber, address: dto.address,
      ...(isOwner ? { licenseNumber: dto.licenseNumber, role: 'owner' } : { role: 'customer' }),
    };
    if (isOwner) {
      await loginCarOwner(form.email, form.password);
    } else {
      await loginCustomer(form.email, form.password);
    }
    persist(userData);
    return userData;
  };

  const logout = () => { setUser(null); localStorage.removeItem('carrent_user'); };

  const updateProfile = (data) => {
    const updated = { ...user, ...data };
    setUser(updated);
    localStorage.setItem('carrent_user', JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider value={{
      user, login, register, logout, updateProfile, loading,
      isAdmin: user?.role === 'admin' || user?.role === 'owner',
      isOwner: user?.role === 'owner',
      isCustomer: user?.role === 'customer',
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
