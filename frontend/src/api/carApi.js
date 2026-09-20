import api from './axios';

export function mapCar(c) {
  if (!c) return null;
  const name = [c.brand, c.model].filter(Boolean).join(' ') || 'Car';
  return {
    id: c.id,
    name,
    brand: c.brand || '',
    model: c.model || '',
    type: 'SUV',
    fuel: c.fuelType || '',
    transmission: 'Automatic',
    seats: c.seatingCapacity || 5,
    price: c.pricePerDay || 0,
    pricePerKm: c.pricePerKm || 0,
    rating: 4.5,
    reviews: 0,
    vehicleNumber: c.vehicleNumber || '',
    status: c.carStatus || 'AVAILABLE',
    image: `https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&q=80&sig=${c.id}`,
    images: [`https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&q=80&sig=${c.id}`],
    description: `${name} — ${c.fuelType || ''} · ${c.seatingCapacity || 5} seats · ₹${c.pricePerDay}/day`,
    available: (c.carStatus || 'AVAILABLE') === 'AVAILABLE',
    raw: c,
  };
}

export const getAllCarsCustomer = () => api.get('/api/v1/customer/getAllCars');
export const getAllCarsOwner = () => api.get('/api/v1/carOwner/getAllCars');
export const registerCar = (data) => api.post('/api/v1/carOwner/registerCar', data);
export const updateCar = (id, data) => api.put(`/api/v1/carOwner/updateCar/${id}`, data);
export const deleteCar = (id) => api.delete(`/api/v1/carOwner/deleteCar/${id}`);
export const bookCar = (carId, booking) =>
  api.post(`/api/v1/customer/bookCar/${carId}`, {
    journeyDate: booking.journeyDate,
    source: booking.source,
    destination: booking.destination,
  });
export const getPendingBookings = () => api.get('/api/v1/carOwner/getPendingBookingForCarOwner');
export const getAllBookingsOwner = () => api.get('/api/v1/carOwner/getAllBookingsForCarOwner');
export const updateBookingStatus = (bookingId, status) =>
  api.post(`/api/v1/carOwner/confirmedOrRejectBookingStatus/${bookingId}/${status}`);
