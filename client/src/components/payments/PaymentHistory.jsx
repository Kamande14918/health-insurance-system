import { useEffect, useState } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import './payments.css';

const PaymentHistory = () => {
  const [payments, setPayments] = useState([]);
  const [error, setError] = useState('');
  const [user_id, setUserId] = useState('');

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/auth/user-id', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        setUserId(response.data.user_id);
      } catch (err) {
        console.error('Error fetching user ID:', err);
        setError('Error fetching user ID. Please log in again.');
      }
    };

    fetchUserId();
  }, []);

  useEffect(() => {
    if (!user_id) {
      return;
    }

    const fetchPaymentHistory = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/mpesa/history/${user_id}`);
        setPayments(response.data);
      } catch (err) {
        console.error('Error fetching payment history:', err);
        setError('Error fetching payment history');
      }
    };

    fetchPaymentHistory();
  }, [user_id]);

  return (
    <div className="payment-history">
      <h2>Payment History</h2>
      {error && <p className="error">{error}</p>}
      <table>
        <thead>
          <tr>
            <th>Payment ID</th>
            <th>Phone Number</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((payment) => (
            <tr key={payment.id}>
              <td>{payment.id}</td>
              <td>{payment.phone}</td>
              <td>{payment.amount}</td>
              <td>{payment.status}</td>
              <td>{new Date(payment.created_at).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

PaymentHistory.propTypes = {
  user_id: PropTypes.string,
};

export default PaymentHistory;