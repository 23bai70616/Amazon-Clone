import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const validatePincodeUrl = async (pincode) => {
  // Mocking pincode validation since no specific service was found
  // In a real app, this would call a real backend endpoint
  return {
    valid: true,
    city: 'Mumbai',
    pincode: pincode
  };
};

// Order Services
export const placeOrder = async (orderData) => {
  const { data } = await axios.post(`${API_URL}/orders`, orderData, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('amazon_token')}`
    }
  });
  return data;
};

export const getMyOrders = async () => {
  const { data } = await axios.get(`${API_URL}/orders/me`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('amazon_token')}`
    }
  });
  return data;
};

export const cancelOrder = async (orderId) => {
  const { data } = await axios.patch(`${API_URL}/orders/${orderId}/cancel`, {}, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('amazon_token')}`
    }
  });
  return data;
};

// Selection Services
export const getProductById = async (id) => {
  const { data } = await axios.get(`${API_URL}/products/${id}`);
  return data;
};

const api = axios.create({
  baseURL: API_URL,
});

export default api;
