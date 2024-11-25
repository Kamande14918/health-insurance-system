import { Link } from 'react-router-dom';
import './navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <ul>
        <li><Link to="/submit-claim">Submit Claim</Link></li>
        <li><Link to="/make-payment">Make Payment</Link></li>
        <li><Link to="/claim-history">Claim History</Link></li>
        <li><Link to="/payment-history">Payment History</Link></li>
        <li><Link to="/reports">Reports</Link></li>
      </ul>
      {/* <div className="profile-icon"> */}
        {/* <Link to="/profile"> */}
          {/* <img src="/path/to/profile-icon.png" alt="Profile" /> */}
        {/* </Link> */}
      {/* </div> */}
    </nav>
  );
};

export default Navbar;
