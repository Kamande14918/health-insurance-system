import { useState } from 'react';
import axios from 'axios';
import './payments.css';

const PaymentForm = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [accountReference, setAccountReference] = useState('');
  const [transactionDesc, setTransactionDesc] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/payments', {
        phoneNumber,
        amount,
        accountReference,
        transactionDesc,
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        withCredentials: true,
      });
      setMessage('Payment made successfully');
      setError('');
    } catch (err) {
      console.error('Error making payment:', err);
      setError('Error making payment');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="form-container">
      <div className="payment-form">
        <h2>Make a Payment</h2>
        {message && <p className="message">{message}</p>}
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="phoneNumber">Phone Number</label>
            <input
              type="text"
              id="phoneNumber"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
              disabled={isLoading}
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
              disabled={isLoading}
            />
          </div>
          <div className="form-group">
            <label htmlFor="accountReference">Account Reference</label>
            <input
              type="text"
              id="accountReference"
              value={accountReference}
              onChange={(e) => setAccountReference(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          <div className="form-group">
            <label htmlFor="transactionDesc">Transaction Description</label>
            <textarea
              id="transactionDesc"
              value={transactionDesc}
              onChange={(e) => setTransactionDesc(e.target.value)}
              required
              disabled={isLoading}
            ></textarea>
          </div>
          <button type="submit" disabled={isLoading}>Make Payment</button>
        </form>
      </div>
    </div>
  );
};

export default PaymentForm;