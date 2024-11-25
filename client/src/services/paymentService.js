import axios from 'axios';

const API_URL = '/api/payments/';

const makePayment = (paymentData) => {
  const token = localStorage.getItem('token');
  return axios.post(API_URL, paymentData, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

const getPaymentHistory = () => {
  const token = localStorage.getItem('token');
  return axios.get(API_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export default {
  makePayment,
  getPaymentHistory,
};