// pages/Auth/SignUp.jsx
import React, { useEffect } from "react";
import { SignUp as ClerkSignUp, useAuth } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const customStyles = `
  .cl-footerAction {
    display: none !important;
  }
  
  /* If the above doesn't work, try these alternatives */
  .cl-footer {
    display: none !important;
  }
  
  .cl-formButtonPrimary + div, 
  div[data-localization-key="footerActionLink"] {
    display: none !important;
  }
`;

const SignUp = () => {
  const navigate = useNavigate();

  const handleSignIn = () => {
    navigate("/sign-in");
  };

  // Add effect to inject the CSS
  useEffect(() => {
    // Create a style element
    const styleElement = document.createElement("style");
    styleElement.innerHTML = customStyles;
    document.head.appendChild(styleElement);

    // Cleanup
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  return (
    <div className="d-flex flex-column min-vh-100 justify-content-center align-items-center bg-light">
      <div className="text-center mb-4">
        <h1
          className="display-5 fw-bold"
          style={{ color: "#2C3E50" }}>
          Variation Project
        </h1>
        <p className="lead">Create a new account</p>
      </div>

      <div
        className="card shadow-sm"
        style={{ width: "100%", maxWidth: "450px" }}>
        <div className="card-body p-4">
          <ClerkSignUp
            signInUrl="/sign-in"
            appearance={{
              layout: {
                socialButtonsPlacement: "bottom",
                socialButtonsVariant: "iconButton",
                termsPageUrl: "https://clerk.com/terms",
              },
              elements: {
                formButtonPrimary: "bg-blue-500 hover:bg-blue-600 text-white w-full",
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

          <div className="text-center mt-3">
            <p>Have an account?</p>
            <button
              className="btn btn-outline-primary"
              onClick={handleSignIn}>
              Sign in here
            </button>
          </div>
        </div>
      </div>
      <div className="mt-4">
        <button
          className="btn btn-link text-secondary"
          onClick={() => navigate("/")}>
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default SignUp;
