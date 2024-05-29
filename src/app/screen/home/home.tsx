import React, { useEffect, useState } from 'react';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import SelectLocation from '../../components/selectLocation/selectLocation.tsx';
import axios from 'axios';
import './home.css'; 

function Home() {
    return (
      <div className="Home">
        <Hero />
        <SelectLocation/>
        <Features />
        <Footer />
      </div>
    );
  }
  
  export default Home;

function Hero() {
  return (
    <section className="hero">
      <div className="background-image"></div>
      <div className="hero-content">
        <h1>Welcome to Hotel - Clinic Matching/Routing App</h1>
        <p>A brief description of your product or service</p>
      </div>
    </section>
  );
}
async function fetchTreatments() {
  try {
    const response = await axios.get('https://healthcareintourism-test.azurewebsites.net/api/Treatment/GetAllTreatments');
    return response.data.data.items;
  } catch (error) {
    console.error('Error fetching treatments:', error);
    return [];
  }
}

function Features() {
  const [treatments, setTreatments] = useState([]);

  useEffect(() => {
    async function loadTreatments() {
      const treatmentsData = await fetchTreatments();
      setTreatments(treatmentsData);
    }
    loadTreatments();
  }, []);

  return (
    <section className="features">
      {treatments.map((treatment, index) => (
        <div className="feature" key={index}>
          <img src={treatment.imageUrl} alt={treatment.name} style={{ width: '100px', height: '100px', display: 'block', margin:'auto' }}/>
          <p>{treatment.name}</p>
        </div>
      ))}
    </section>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="social-links">
        <a href="/">Facebook</a>
        <a href="/">Twitter</a>
        <a href="/">Instagram</a>
      </div>
      <p>
        Contact us at: <a href="mailto:healthcareintourism@gmail.com">healthcareintourism@gmail.com</a>
      </p>
    </footer>
  );
}