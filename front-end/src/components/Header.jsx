import React from "react";
import { useClerk, SignedIn, SignedOut } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const Header = () => {
  const { signOut } = useClerk();
  const navigate = useNavigate();

  const handleSignOut = () => {
    signOut({ redirectUrl: "/" });
  };

  return (
    <header className="bg-dark text-white py-3">
      <div className="container d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center">
          <h1 className="h3 mb-0">My Application</h1>
        </div>
        <div className="d-flex align-items-center">
          <SignedIn>
            <button
              className="btn btn-outline-light me-2"
              onClick={() => navigate("/profile")}>
              My Profile
            </button>
            <button
              className="btn btn-outline-light"
              onClick={handleSignOut}>
              Sign Out
            </button>
          </SignedIn>
          <SignedOut>
            <button
              className="btn btn-outline-light"
              onClick={() => navigate("/sign-in")}>
              Sign In
            </button>
          </SignedOut>
        </div>
      </div>
    </header>
  );
};

export default Header;
