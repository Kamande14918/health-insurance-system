// Utility function to validate email
export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
};

// Utility function to validate phone number
export const validatePhoneNumber = (phoneNumber) => {
  const re = /^\d{10}$/;
  return re.test(String(phoneNumber));
};

// Utility function to validate password (at least 6 characters)
export const validatePassword = (password) => {
  return password.length >= 6;
};