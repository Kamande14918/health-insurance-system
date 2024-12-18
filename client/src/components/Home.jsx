import { Link } from 'react-router-dom';
import './Home.css'; // Import CSS for styling

const Home = () => {
  return (
    <div className="home-container">
      <header className="home-header">una
        <h1>Social Health Authority</h1>
        <p>Ensuring a healthier, more equitable future for all through comprehensive coverage and quality care without financial worry.</p>
      </header>
      <section className="home-content">
        <div className="home-card">
          <h2>Overview</h2>
          <p>SHA facilitates healthcare services from enlisted providers by pooling contributions—ensuring equitable distribution of quality healthcare.</p>
          <p>The Social Health Authority is established under section 25 of the Act and is utilized to pool all contributions made under the Act.
SHA is designed to provide healthcare services from empaneled and contracted healthcare providers and healthcare facilities on referral from primary health facilities. The Social Health Authority ensures that every resident in Kenya can access a comprehensive range of quality health services they need without the burden of financial hardship.</p>
        </div>
        <div className="home-card">
          <h2>Benefits</h2>
          <p>The benefits under the Social Health Authority include Preventive, Promotive, Curative, Rehabilitative and Palliative health services. These are provided at level 4, 5, and 6 health facilities under the fund.</p>
        </div>
        <div className="home-card">
          <h2>Who Qualifies</h2>
          <p>Every person resident in Kenya is required to apply for registration to the Authority as a member of the Social Health Authority within ninety days upon the coming into force of these Regulations.
          The application must be accompanied by a copy of the national identification document or any other approved document, and for children without identification, documentation provided by the state department responsible for social protection</p>
          <Link to="/login" className="home-button">Log In</Link>
          <Link to="/register" className="home-button">Register</Link>
        </div>
      </section>
    </div>
  );
};

export default Home;