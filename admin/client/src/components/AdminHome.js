import React from 'react';
import { Link } from 'react-router-dom';

const AdminHome = () => {
  return (
    <div>
      <h2>Welcome to the health insurance admin portal</h2>
      <div>
        <Link to="/admin/register">
          <button>Register as an Admin</button>
        </Link>
        <Link to="/admin/login">
          <button>Login</button>
        </Link>
      </div>
    </div>
  );
};

export default AdminHome;