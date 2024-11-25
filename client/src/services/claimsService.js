import axios from 'axios';

const API_URL = '/api/claims/';

const submitClaim = (claimData) => {
  const token = localStorage.getItem('token');
  const formData = new FormData();
  for (const key in claimData) {
    if (Array.isArray(claimData[key])) {
      claimData[key].forEach((file) => formData.append(key, file));
    } else {
      formData.append(key, claimData[key]);
    }
  }
  return axios.post(API_URL, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
  });
};

const getClaims = () => {
  const token = localStorage.getItem('token');
  return axios.get(API_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export default {
  submitClaim,
  getClaims,
};