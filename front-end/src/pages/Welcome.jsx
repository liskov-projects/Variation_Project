import React from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const Welcome = () => {
  const navigate = useNavigate();

  const handleContinue = () => {
    navigate('/step1');
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100" >
      <div className="container text-center p-5" style={{ backgroundColor: '#FFFFFF', borderRadius: '15px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)' }}>
        <h1 className="display-4 fw-bold mb-4" style={{ color: '#2C3E50' }}>Hey, Welcome to Our Product!</h1>
        <p className="lead mb-5" style={{ color: '#34495E' }}>
          We're excited to have you here. First, let's set up your profile and get some information about you.
        </p>
        <button 
          className="btn btn-primary btn-lg"
          onClick={handleContinue}
          style={{ borderRadius: '25px', padding: '15px 40px', backgroundColor: '#16A085', borderColor: '#16A085' }}
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default Welcome;