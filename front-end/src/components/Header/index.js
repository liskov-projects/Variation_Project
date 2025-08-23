import React from "react";
import { useNavigate } from "react-router-dom";
import { useClerk, SignedIn, SignedOut } from "@clerk/clerk-react";
import { useProfile } from "../../contexts/ProfileContext";
import "bootstrap/dist/css/bootstrap.min.css";

const Header = () => {
  const { signOut } = useClerk();
  const navigate = useNavigate();
  const { isProfileComplete } = useProfile();

  const handleSignOut = () => {
    signOut({ redirectUrl: "/" });
  };

  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    <header className="text-white py-3" style={{backgroundColor: "rgb(44, 62, 80)", borderBottom: "3px ridge rgba(74, 234, 255, 0.5)"}}>
      <div className="container d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center">
          <img className="me-2" src="/logo192.png" alt="Variation Logo" width="36px"/>
          <h1
            className="fw-bold text-white mb-0"
            style={{ cursor: "pointer", fontSize: "24px"}}
            onClick={() => handleNavigate("/")}>
            Variation
          </h1>
        </div>

        <div className="d-flex align-items-center">
          <SignedIn>
            {isProfileComplete && (
              <>
                <button
                  className="btn btn-outline-light me-2"
                  onClick={() => handleNavigate("/dashboard")}>
                  Dashboard
                </button>
                <button
                  className="btn btn-outline-light me-2"
                  onClick={() => handleNavigate("/profile-edit")}>
                  Edit Profile
                </button>
              </>
            )}
            <button
              className="btn btn-outline-light"
              onClick={handleSignOut}>
              Sign Out
            </button>
          </SignedIn>

          <SignedOut>
            <button
              className="btn btn-outline-light me-2"
              onClick={() => handleNavigate("/sign-in")}>
              Sign In
            </button>
            <button
              className="btn btn-primary"
              onClick={() => handleNavigate("/sign-up")}>
              Sign Up
            </button>
          </SignedOut>
        </div>
      </div>
    </header>
  );
};

export default Header;
