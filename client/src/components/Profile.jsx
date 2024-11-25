import { useState } from 'react';
import { validateEmail, validatePhoneNumber, validatePassword } from '../utils/validators';
import { formatCurrency, formatDate } from '../utils/formetters';

const Profile = () => {
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      setError('Invalid email address');
      return;
    }
    if (!validatePhoneNumber(phoneNumber)) {
      setError('Invalid phone number');
      return;
    }
    if (!validatePassword(password)) {
      setError('Password must be at least 6 characters long');
      return;
    }
    setError('');
    // Submit the form
  };

  return (
    <div className="profile-container">
      <h2>Profile</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="phoneNumber">Phone Number</label>
          <input
            type="text"
            id="phoneNumber"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Update Profile</button>
      </form>
      <div className="formatted-examples">
        <h3>Formatted Examples</h3>
        <p>Formatted Currency: {formatCurrency(12345.67)}</p>
        <p>Formatted Date: {formatDate('2023-10-01')}</p>
      </div>
    </div>
  );
};

export default Profile;