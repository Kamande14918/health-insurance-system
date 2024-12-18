import { useState, useEffect } from 'react';
import axios from 'axios';
import './MpesaPayment.css';

const MpesaPayment = () => {
  const [phone, setPhone] = useState('');
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [user_id, setUserId] = useState('');

  useEffect(() => {
    const userId = localStorage.getItem('user_id'); // Assuming user_id is stored in local storage
    if (userId) {
      setUserId(userId);
    } else {
      console.error('User ID not found in local storage');
      setError('User ID is empty. Please log in.');
    }
  }, []);

  const formatPhoneNumber = (phone) => {
    // Remove any non-numeric characters
    phone = phone.replace(/\D/g, '');
    // Ensure the phone number starts with '254'
    if (phone.startsWith('0')) {
      phone = '254' + phone.slice(1);
    } else if (!phone.startsWith('254')) {
      phone = '254' + phone;
    }
    return phone;
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    if (!user_id) {
      setError('User ID is empty. Please log in.');
      return;
    }
    const formattedPhone = formatPhoneNumber(phone);
    const formData = {
      phone: formattedPhone,
      amount,
      user_id,
    };

    console.log('Form Data:', formData); // Debugging message

    try {
      const token = localStorage.getItem('token'); // Get the token from local storage
      await axios.post('http://localhost:5000/api/mpesa/stkpush', formData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Include the token in the request headers
        },
      });
      setMessage('STK Push initiated successfully');
      setError('');
    } catch (err) {
      console.error('Error initiating STK Push:', err);
      setError('Error initiating STK Push');
      setMessage('');
    }
  };

  return (
    <div className="form-container">
      <div className="payment-form">
        <h2>M-Pesa Payment</h2>
        {message && <p className="message">{message}</p>}
        {error && <p className="error">{error}</p>}
        <form onSubmit={handlePayment}>
          <div className="form-group">
            <label htmlFor="phone">Phone Number</label>
            <input
              type="text"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="amount">Amount</label>
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>
          <button type="submit">Make Payment</button>
        </form>
      </div>
    </div>
  );
};

export default MpesaPayment;