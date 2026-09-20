import { useLocation, Link, Navigate } from 'react-router-dom';
import { CheckCircle, Car, MapPin, Calendar } from 'lucide-react';

export default function BookingConfirmation() {
  const { state } = useLocation();
  if (!state) return <Navigate to="/" replace />;

  return (
    <div className="max-w-lg mx-auto px-4 py-12">
      <div className="card p-8 text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-12 h-12 text-green-500" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed!</h1>
        <p className="text-gray-500 mb-6">Your booking has been successfully confirmed.</p>

        <div className="bg-gray-50 rounded-xl p-5 text-left space-y-3 mb-6">
          <p className="text-sm text-gray-500">Booking ID: <span className="font-semibold text-gray-900">{state.bookingId}</span></p>
          
          <div className="flex items-center gap-3 pt-2">
            <img src={state.car?.image} alt="" className="w-16 h-12 object-cover rounded-lg" />
            <div>
              <p className="font-semibold text-gray-900">{state.car?.name}</p>
              <p className="text-xs text-gray-500">{state.car?.type}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600 pt-1">
            <Calendar className="w-4 h-4 text-blue-500" />
            {state.pickupDate}
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin className="w-4 h-4 text-blue-500" />
            {state.pickupLocation} → {state.dropLocation}
          </div>
          <div className="flex items-center gap-2 text-sm font-semibold text-gray-900 pt-1 border-t border-gray-200">
            Price per day: ₹{Number(state.car?.price || 0).toLocaleString()}
          </div>
        </div>

        <Link to="/my-bookings" className="btn-primary w-full block text-center py-3">
          Go to My Bookings
        </Link>
        <Link to="/" className="block mt-3 text-sm text-gray-500 hover:text-blue-600">
          Back to Home
        </Link>
      </div>
    </div>
  );
}
