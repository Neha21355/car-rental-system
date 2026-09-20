import api from './axios';

export const getCustomerProfile = () => api.get('/api/v1/customer/profile');
export const updateCustomerProfile = (data) => api.put('/api/v1/customer/profile', {
  name: data.name,
  email: data.email,
  phoneNumber: data.phone,
  address: data.address,
});
export const getCustomerBookings = () => api.get('/api/v1/customer/bookings');
export const getCustomerNotifications = () => api.get('/api/v1/customer/notifications');
export const markNotificationSeen = (id) => api.patch(`/api/v1/customer/notifications/${id}/seen`);
export const getOwnerNotifications = () => api.get('/api/v1/carOwner/notifications');
export const markOwnerNotificationSeen = (id) => api.patch(`/api/v1/carOwner/notifications/${id}/seen`);