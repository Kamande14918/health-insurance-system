import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './payments.css';

const PaymentHistory = () => {
  const [payments, setPayments] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login'); // Redirect to login if not authenticated
    } else {
      const fetchPayments = async () => {
        try {
          const response = await axios.get('http://localhost:5000/api/payments', {
            headers: {
              'Authorization': `Bearer ${token}`, // Include token in headers
            },
            withCredentials: true
          });
          setPayments(response.data);
        } catch (err) {
          console.error('Error fetching payments:', err);
          setError('Error fetching payments');
        }
      };

      fetchPayments();
    }
  }, [navigate]);

  return (
    <div className="payment-history">
      <h2>Your Payment History</h2>
      {error && <p className="error">{error}</p>}
      <ul>
        {payments.map((payment) => (
          <li key={payment.id}>
            <p>Phone Number: {payment.phone_number}</p>
            <p>Amount: {payment.amount}</p>
            <p>Account Reference: {payment.account_reference}</p>
            <p>Transaction Description: {payment.transaction_desc}</p>
            <p>Status: {payment.status}</p>
            <p>Created At: {new Date(payment.created_at).toLocaleString()}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PaymentHistory;