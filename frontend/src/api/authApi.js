import api from './axios';

export const registerCustomer = (data) =>
  api.post('/api/v1/auth/registerCustomer', {
    name: data.name,
    email: data.email,
    password: data.password,
    phoneNumber: data.phone || data.phoneNumber,
    address: data.address || '',
  });

export const loginCustomer = (email, password) =>
  api.post('/api/v1/auth/loginCustomer', { email, password });

export const registerCarOwner = (data) =>
  api.post('/api/v1/auth/registerCarOwner', {
    name: data.name,
    email: data.email,
    password: data.password,
    address: data.address,
    phoneNumber: data.phone || data.phoneNumber,
    licenseNumber: data.licenseNumber,
  });

export const loginCarOwner = (email, password) =>
  api.post('/api/v1/auth/loginCarOwner', { email, password });
