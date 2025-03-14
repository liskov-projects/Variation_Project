// pages/Auth/SignIn.jsx
import React from 'react';
import { SignIn as ClerkSignIn } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const SignIn = () => {
  const navigate = useNavigate();

  return (
    <div className="d-flex flex-column min-vh-100 justify-content-center align-items-center bg-light">
      <div className="text-center mb-4">
        <h1 className="display-5 fw-bold" style={{ color: '#2C3E50' }}>
          Variation Project
        </h1>
        <p className="lead">Sign in to your account</p>
      </div>
      
      <div className="card shadow-sm" style={{ width: '100%', maxWidth: '450px' }}>
        <div className="card-body p-4">
          <ClerkSignIn 
            routing="path"
            path="/sign-in"
            signUpUrl="/sign-up"
            redirectUrl="/welcome"
            appearance={{
              elements: {
                rootBox: 'mx-auto',
                card: '',
                formButtonPrimary: 'btn btn-primary w-100',
                footerAction: 'text-center mt-3',
                formContainer: 'gap-4'
              },
            }}
          />
        </div>
      </div>
      
      <div className="mt-4">
        <button
          className="btn btn-link text-secondary"
          onClick={() => navigate('/')}
        >
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default SignIn;

