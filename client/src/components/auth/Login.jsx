import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './auth.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!email || !password) {
      setError('Email and password are required');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email: email,
        password: password,
      });
      console.log('Login successful:', response.data);
      // Store the token in local storage or state
      localStorage.setItem('token', response.data.token);
      // Redirect to the dashboard
      navigate('/dashboard');
    } catch (err) {
      console.error('Login error details:', err);
      setError('Invalid email or password');
    }
  };

  return (
    <div className="form-container">
      <div className="login-form">
        <h2>Login</h2>
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
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
};

export default Login;