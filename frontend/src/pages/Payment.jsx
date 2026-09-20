import { useState } from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { CreditCard, Smartphone, Building2 } from 'lucide-react';

export default function Payment() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [method, setMethod] = useState('card');
  const [loading, setLoading] = useState(false);
  const [card, setCard] = useState({ number: '1234 5678 9012 3456', expiry: '', cvv: '' });

  if (!state) return <Navigate to="/cars" replace />;

  const handlePay = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate('/confirmation', { state });
    }, 1200);
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      {/* Steps */}
      <div className="flex items-center justify-center gap-2 mb-10">
        {[
          { n: 1, label: 'Booking', done: true },
          { n: 2, label: 'Payment', active: true },
          { n: 3, label: 'Confirmation', active: false },
        ].map((s, i) => (
          <div key={s.n} className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
              s.done ? 'bg-green-500 text-white' : s.active ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
            }`}>
              {s.done ? '✓' : s.n}
            </div>
            <span className={`text-sm font-medium ${s.active || s.done ? 'text-blue-600' : 'text-gray-400'}`}>{s.label}</span>
            {i < 2 && <div className="w-12 h-0.5 bg-gray-200 mx-1" />}
          </div>
        ))}
      </div>

      <div className="card p-6 sm:p-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Payment Method</h2>

        <div className="space-y-3 mb-6">
          {[
            { id: 'card', icon: CreditCard, label: 'Credit/Debit Card' },
            { id: 'upi', icon: Smartphone, label: 'UPI (Google Pay, PhonePe, etc.)' },
            { id: 'netbanking', icon: Building2, label: 'Net Banking' },
          ].map((m) => (
            <label
              key={m.id}
              className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition ${
                method === m.id ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <input type="radio" name="method" value={m.id} checked={method === m.id} onChange={() => setMethod(m.id)} className="w-4 h-4 text-blue-600" />
              <m.icon className={`w-5 h-5 ${method === m.id ? 'text-blue-600' : 'text-gray-400'}`} />
              <span className={`text-sm font-medium ${method === m.id ? 'text-blue-700' : 'text-gray-700'}`}>{m.label}</span>
            </label>
          ))}
        </div>

        {method === 'card' && (
          <form onSubmit={handlePay} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Card Number</label>
              <input
                value={card.number}
                onChange={(e) => setCard({ ...card, number: e.target.value })}
                className="input-field"
                placeholder="1234 5678 9012 3456"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Expiry Date</label>
                <input
                  value={card.expiry}
                  onChange={(e) => setCard({ ...card, expiry: e.target.value })}
                  className="input-field"
                  placeholder="MM/YY"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">CVV</label>
                <input
                  value={card.cvv}
                  onChange={(e) => setCard({ ...card, cvv: e.target.value })}
                  className="input-field"
                  placeholder="123"
                  maxLength={4}
                  required
                />
              </div>
            </div>
            <div className="flex justify-between items-center pt-4 border-t border-gray-100">
              <div>
                <p className="text-sm text-gray-500">Total Amount</p>
                <p className="text-2xl font-bold text-gray-900">₹{state.total?.toLocaleString()}</p>
              </div>
              <button type="submit" disabled={loading} className="btn-primary px-8 py-3 disabled:opacity-60">
                {loading ? 'Processing...' : 'Pay Now'}
              </button>
            </div>
          </form>
        )}

        {(method === 'upi' || method === 'netbanking') && (
          <div>
            <div className="flex justify-between items-center pt-2">
              <div>
                <p className="text-sm text-gray-500">Total Amount</p>
                <p className="text-2xl font-bold text-gray-900">₹{state.total?.toLocaleString()}</p>
              </div>
              <button onClick={handlePay} disabled={loading} className="btn-primary px-8 py-3 disabled:opacity-60">
                {loading ? 'Processing...' : 'Pay Now'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
