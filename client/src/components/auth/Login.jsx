import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './auth.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      console.log('Response data:', response.data); // Log the entire response data
      setMessage('Login successful');
      setError('');
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user_id', response.data.user_id); // Store user_id in local storage
      console.log('User ID:', response.data.user_id); // Log the user ID
      navigate('/dashboard');
    } catch (err) {
      console.error('Login error details:', err);
      setError('Invalid email or password.');
    }
  };

  return (
    <div className="form-container stylish-background">
      <div className="login-form modern-card">
        <h2 className="form-title">Welcome Back!</h2>
        {message && <p className="message success-message">{message}</p>}
        {error && <p className="message error-message">{error}</p>}
        <form onSubmit={handleSubmit} className="styled-form">
          <div className="form-group">
            <label htmlFor="email" className="styled-label">Email</label>
            <input
              type="email"
              id="email"
              className="styled-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password" className="styled-label">Password</label>
            <input
              type="password"
              id="password"
              className="styled-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="styled-button">Login</button>
        </form>
        <p className="additional-options">Don&apos;t have an account? <a href="/register" className="styled-link">Sign Up</a></p>
      </div>
    </div>
  );
};

export default Login;