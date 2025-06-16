import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useProfile } from "../contexts/ProfileContext";
// import Header from '../components/Header';
import "bootstrap/dist/css/bootstrap.min.css";
import Header from "../components/Header/index";

const ProfileComplete = () => {
  const navigate = useNavigate();
  const { isProfileComplete } = useProfile();

  // Ensure the user has completed their profile
  useEffect(() => {
    if (!isProfileComplete) {
      navigate("/profile-setup");
    }
  }, [isProfileComplete, navigate]);

  const handleGoToDashboard = () => {
    navigate("/dashboard");
  };

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
          <div className="mb-4">
            <i
              className="bi bi-check-circle-fill text-success"
              style={{ fontSize: "4rem" }}></i>
          </div>

          <h1
            className="display-4 fw-bold mb-4"
            style={{ color: "#2C3E50" }}>
            Profile Setup Complete!
          </h1>

          <p
            className="lead mb-5"
            style={{ color: "#34495E" }}>
            Thank you for completing your profile. You're now ready to start creating variation
            projects. You can return to your profile at any time to make updates.
          </p>

          <button
            className="btn btn-primary btn-lg"
            onClick={handleGoToDashboard}
            style={{
              borderRadius: "25px",
              padding: "15px 40px",
              backgroundColor: "#16A085",
              borderColor: "#16A085",
            }}>
            Go to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileComplete;
