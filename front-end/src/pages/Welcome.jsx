import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const Welcome = () => {
  const navigate = useNavigate();
  const { userId, getToken } = useAuth();
  const [hasProfile, setHasProfile] = useState(false);
  const [loading, setLoading] = useState(false);

  // Check if user already has profile information
  useEffect(() => {
    const checkUserProfile = async () => {
      if (!userId) return;
      
      try {
        setLoading(true);
        const token = await getToken();
        const response = await axios.get(`/api/user/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        // If user has form data, they've completed their profile
        if (response.data && response.data.formData && response.data.formData.length > 0) {
          setHasProfile(true);
        }
      } catch (error) {
        // If 404 error, user doesn't have a profile yet
        if (error.response && error.response.status === 404) {
          setHasProfile(false);
        } else {
          console.error('Error checking user profile:', error);
        }
      } finally {
        setLoading(false);
      }
    };

    checkUserProfile();
  }, [userId, getToken]);

  const handleContinue = () => {
    navigate('/step1');
  };

  const handleGoToDashboard = () => {
    // Navigate to a dashboard or main app page
    // For now, just keep them on welcome page
    navigate('/step1');
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="container text-center p-5" style={{ backgroundColor: '#FFFFFF', borderRadius: '15px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)' }}>
        <h1 className="display-4 fw-bold mb-4" style={{ color: '#2C3E50' }}>
          {hasProfile ? 'Welcome Back!' : 'Hey, Welcome to Our Product!'}
        </h1>
        
        {hasProfile ? (
          <div>
            <p className="lead mb-5" style={{ color: '#34495E' }}>
              Good to see you again. Would you like to edit your profile information or continue to the application?
            </p>
            <div className="d-flex justify-content-center gap-3">
              <button 
                className="btn btn-outline-primary btn-lg"
                onClick={() => navigate('/profile')}
                style={{ borderRadius: '25px', padding: '15px 40px' }}
              >
                Edit Profile
              </button>
              <button 
                className="btn btn-primary btn-lg"
                onClick={handleGoToDashboard}
                style={{ borderRadius: '25px', padding: '15px 40px', backgroundColor: '#16A085', borderColor: '#16A085' }}
              >
                Continue
              </button>
            </div>
          </div>
        ) : (
          <div>
            <p className="lead mb-5" style={{ color: '#34495E' }}>
              We're excited to have you here. First, let's set up your profile by completing your client information.
            </p>
            <button 
              className="btn btn-primary btn-lg"
              onClick={handleContinue}
              style={{ borderRadius: '25px', padding: '15px 40px', backgroundColor: '#16A085', borderColor: '#16A085' }}
            >
              Set Up Profile
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Welcome;