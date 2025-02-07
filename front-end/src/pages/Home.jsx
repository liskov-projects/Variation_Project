import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const Home = () => {
  // Navigation and scroll handlers remain the same
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div className="min-h-screen">
      {/* Navigation Bar remains the same */}
      <nav className={`navbar navbar-expand-lg fixed-top transition-all duration-300 ${
        isScrolled ? 'py-2' : 'py-3'
      }`} style={{ 
        backgroundColor: isScrolled ? '#2C3E50' : 'rgba(44, 62, 80, 0.9)',
        backdropFilter: 'blur(8px)',
        borderBottom: isScrolled ? '1px solid rgba(255, 255, 255, 0.1)' : 'none'
      }}>
        <div className="container">
          <a className="navbar-brand fw-bold text-white" href="/">CompanyName</a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <a className="nav-link text-white" href="#about">About</a>
              </li>
              <li className="nav-item">
                <a className="nav-link text-white" href="#contact">Contact</a>
              </li>
              <li className="nav-item">
                <button 
                  className="btn btn-outline-light ms-2" 
                  onClick={() => handleNavigation('/contact')}
                  style={{ 
                    borderRadius: '25px',
                    backgroundColor: isScrolled ? 'transparent' : 'rgba(255, 255, 255, 0.1)'
                  }}
                >
                  Get Started
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Hero Section remains the same */}
      <section className="position-relative vh-100 d-flex align-items-center" style={{ backgroundColor: '#2C3E50' }}>
        <div className="position-absolute w-100 h-100" style={{ 
          background: 'linear-gradient(45deg, rgba(22, 160, 133, 0.8), rgba(44, 62, 80, 0.9))',
          zIndex: 1 
        }}></div>
        <div className="container position-relative" style={{ zIndex: 2 }}>
          <div className="row align-items-center">
            <div className="col-lg-8 text-white">
              <h1 className="display-3 fw-bold mb-4">Innovate. Create.<br/>Transform.</h1>
              <p className="lead mb-5" style={{ fontSize: '1.4rem' }}>Empowering businesses with next-generation solutions for the digital era.</p>
              <div className="d-flex gap-4">
                <button 
                  className="btn btn-lg px-5"
                //   onClick={() => handleNavigation('/services')}
                onClick={() => handleNavigation('/step1')}
                  style={{ 
                    backgroundColor: '#16A085', 
                    color: 'white',
                    borderRadius: '25px'
                  }}
                >
                  Start Journey
                </button>
                <button 
                  className="btn btn-outline-light btn-lg px-5"
                  onClick={() => handleNavigation('/about')}
                  style={{ borderRadius: '25px' }}
                >
                  Learn More
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Restructured About Section */}
      <section id="about" className="py-6 position-relative" style={{ 
        backgroundColor: '#E8F6EF',
        padding: '150px 0'
      }}>
        <div className="container">
          <div className="row g-5">
            {/* Who We Are - Left Column */}
            <div className="col-lg-6">
              <h2 className="display-4 fw-bold mb-4" style={{ color: '#2C3E50' }}>Who We Are</h2>
              <p className="lead mb-4" style={{ color: '#34495E', fontSize: '1.2rem' }}>
                We're not just another company - we're your partner in digital transformation. 
                Our innovative approach combines cutting-edge technology with creative solutions.
              </p>
              <div className="d-flex flex-column gap-3">
                {['Vision', 'Innovation', 'Excellence', 'Partnership'].map((value, index) => (
                  <div key={index} className="d-flex align-items-center gap-3">
                    <div style={{ 
                      width: '48px',
                      height: '48px',
                      backgroundColor: '#16A085',
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: '24px'
                    }}>
                      {index + 1}
                    </div>
                    <div style={{ color: '#34495E', fontSize: '1.1rem' }}>{value}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* About Us - Right Column */}
            <div className="col-lg-6">
              <h2 className="display-4 fw-bold mb-4" style={{ color: '#2C3E50' }}>About Us</h2>
              <p className="lead mb-4" style={{ color: '#34495E', fontSize: '1.2rem' }}>
                Our company is dedicated to providing top-notch services and solutions to our clients. 
                We believe in the power of innovation and strive to stay ahead of the curve in the ever-evolving tech landscape.
              </p>
              <p className="lead mb-4" style={{ color: '#34495E', fontSize: '1.2rem' }}>
                Our team of experts is passionate about delivering excellence and ensuring customer satisfaction. 
                We work closely with our clients to understand their unique needs and tailor our services to meet their specific requirements.
              </p>
              <p className="lead" style={{ color: '#34495E', fontSize: '1.2rem' }}>
                Join us on our journey to transform the digital world and make a lasting impact. 
                Together, we can achieve great things and drive success for your business.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section with Curved Design */}
      <section id="contact" className="position-relative" style={{ 
        backgroundColor: '#FFFFFF',
        padding: '100px 0'
      }}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-10">
              <div className="p-5 rounded-4 shadow-lg" style={{ backgroundColor: '#2C3E50' }}>
                <div className="row align-items-center">
                  <div className="col-lg-6 text-white">
                    <h2 className="display-4 fw-bold mb-4">Let's Build Together</h2>
                    <p className="lead mb-4">Ready to transform your business? We're here to help you take the next step.</p>
                  </div>
                  <div className="col-lg-6 text-center text-lg-end">
                    <button 
                      className="btn btn-lg px-5"
                      onClick={() => handleNavigation('/contact')}
                      style={{ 
                        backgroundColor: '#16A085', 
                        color: 'white',
                        borderRadius: '25px',
                        padding: '15px 40px'
                      }}
                    >
                      Get Started Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ backgroundColor: '#2C3E50' }} className="text-white py-4">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6">
              <h5 className="mb-0">CompanyName</h5>
            </div>
            <div className="col-md-6 text-md-end">
              <div className="d-flex gap-4 justify-content-md-end">
                <a href="#" className="text-white text-decoration-none">Privacy</a>
                <a href="#" className="text-white text-decoration-none">Terms</a>
                <a href="#" className="text-white text-decoration-none">Contact</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;





      {/* Features Section
      <section className="py-5" id="services">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="display-5 fw-bold">Our Services</h2>
            <p className="lead text-muted">Comprehensive solutions for your business needs</p>
          </div>
          <div className="row g-4">
            {[
              {
                title: 'Custom Solutions',
                description: 'Tailored solutions designed specifically for your unique business requirements',
                icon: '💡'
              },
              {
                title: 'Expert Consultation',
                description: 'Strategic guidance from industry experts to help you make informed decisions',
                icon: '🤝'
              },
              {
                title: 'Innovation Focus',
                description: 'Cutting-edge technologies and approaches to keep you ahead of the curve',
                icon: '🚀'
              }
            ].map((feature, index) => (
              <div key={index} className="col-md-4">
                <div className="card h-100 border-0 shadow-sm">
                  <div className="card-body text-center p-4">
                    <div className="display-5 mb-3">{feature.icon}</div>
                    <h3 className="h4 mb-3">{feature.title}</h3>
                    <p className="text-muted mb-0">{feature.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section> */}