import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './auth.css';

const Register = () => {
  const [username, setUsername] = useState('');
  const [nationalId, setNationalId] = useState('');
  const [biometricData, setBiometricData] = useState(null);
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setBiometricData(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('username', username);
    formData.append('nationalId', nationalId);
    formData.append('biometricData', biometricData);
    formData.append('email', email);
    formData.append('phoneNumber', phoneNumber);
    formData.append('password', password);

    // Validate the payload
    if (!username || !nationalId || !biometricData || !email || !password || !phoneNumber) {
      setError('All fields are required');
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/auth/register', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setMessage('User registered successfully');
      setError('');
      // Redirect to the login page
      navigate('/login');
    } catch (err) {
      console.error('Error registering user:', err);
      setError('Error registering user');
    }
  };

  return (
    <div className="form-container">
      <div className="register-form">
        <h2>Register</h2>
        {message && <p className="message">{message}</p>}
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="nationalId">National ID</label>
            <input
              type="text"
              id="nationalId"
              value={nationalId}
              onChange={(e) => setNationalId(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="biometricData">Biometric Data</label>
            <input
              type="file"
              id="biometricData"
              onChange={handleFileChange}
              required
            />
          </div>
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
          <button type="submit">Register</button>
        </form>
      </div>
    </div>
  );
};

export default Register;
