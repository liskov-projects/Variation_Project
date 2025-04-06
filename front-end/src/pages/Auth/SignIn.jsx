// pages/Auth/SignIn.jsx
import React from 'react';
import { SignIn as ClerkSignIn } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const SignIn = () => {
  const navigate = useNavigate();

  const handleSignUp = () => {
    console.log("Sign up button clicked - navigating to /sign-up");
    navigate('/sign-up');
  };

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
            signUpUrl="/sign-up"
            appearance={{
              layout: {
                socialButtonsPlacement: "bottom",
                socialButtonsVariant: "iconButton",
                termsPageUrl: "https://clerk.com/terms"
              },
              elements: {
                formButtonPrimary: 
                  "bg-blue-500 hover:bg-blue-600 text-white w-full",
                card: "shadow-xl rounded-lg p-6",
                headerTitle: "text-2xl font-bold text-center text-gray-900",
                headerSubtitle: "text-center text-gray-500",
                dividerLine: "bg-gray-200",
                dividerText: "text-gray-500",
                formFieldLabel: "text-gray-700",
                formFieldInput: "border-gray-300 focus:ring-blue-500 focus:border-blue-500",
              },
            }}
          />
          
          {/* Add this extra manual sign-up button */}
          <div className="text-center mt-3">
            <p>Don't have an account?</p>
            <button 
              className="btn btn-outline-primary"
              onClick={handleSignUp}
            >
              Sign up here
            </button>
            
            {/* Alternative direct link if the button doesn't work */}
            <div className="mt-2">
              <small>If the button doesn't work, <a href="/sign-up">click here</a> to sign up</small>
            </div>
          </div>
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