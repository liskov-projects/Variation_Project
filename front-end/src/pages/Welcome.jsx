import React from "react";
import { useNavigate } from "react-router-dom";
import { useProfile } from "../contexts/ProfileContext";
import "bootstrap/dist/css/bootstrap.min.css";
// import Header from '../components/Header';
import Header from "../components/Header/index";
import Footer from "../components/Footer";

const Welcome = () => {
  const navigate = useNavigate();
  const { isProfileComplete, loading } = useProfile();

  const handleContinue = () => {
    if (isProfileComplete) {
      navigate("/dashboard");
    } else {
      navigate("/profile-setup");
    }
  };

  if (loading) {
    return (
      <div>
        <Header />
        <div className="d-flex justify-content-center align-items-center vh-100">
          <div
            className="spinner-border text-primary"
            role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
        <Footer/>
      </div>
    );
  }

  return (
    <div>
      <Header />
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div
          className="container text-center p-5"
          style={{
            backgroundColor: "#FFFFFF",
            borderRadius: "15px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
            maxWidth: "800px",
          }}>
          <h1
            className="display-4 fw-bold mb-4"
            style={{ color: "#2C3E50" }}>
            {isProfileComplete ? "Welcome Back!" : "Welcome to the Variation Project App!"}
          </h1>

          <p
            className="lead mb-5"
            style={{ color: "#34495E" }}>
            {isProfileComplete
              ? "Continue to your dashboard to manage your projects."
              : "Let's get started by setting up your builder profile. This information will be used for all your future projects."}
          </p>

          <button
            className="btn btn-primary btn-lg"
            onClick={handleContinue}
            style={{
              borderRadius: "25px",
              padding: "15px 40px",
              backgroundColor: "#16A085",
              borderColor: "#16A085",
            }}>
            {isProfileComplete ? "Go to Dashboard" : "Continue to Profile Setup"}
          </button>
        </div>
      </div>
      <Footer/>
    </div>
  );
};

export default Welcome;
