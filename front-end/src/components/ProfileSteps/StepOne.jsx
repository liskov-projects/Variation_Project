import React from "react";
import { useProfile } from "../../contexts/ProfileContext";

const StepOne = ({ setFormError }) => {
  const { profileData, updateProfile } = useProfile();

  const validateEmailOnBlur = () => {
    setFormError("")
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(profileData.email)) setFormError("A valid email is required");
  }

  return (
    <div>
      <h4 className="mb-3">Builder Information</h4>

      <div className="mb-3">
        <label className="form-label">Builder Name *</label>
        <input
          type="text"
          placeholder="John Doe"
          className="form-control"
          value={profileData.fullName || ""}
          onChange={(e) => updateProfile({ fullName: e.target.value })}
          required
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Address *</label>
        <input
          type="text"
          placeholder="123 Main Street, City, State, Postcode"
          className="form-control"
          value={profileData.address || ""}
          onChange={(e) => updateProfile({ address: e.target.value })}
          required
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Email *</label>
        <input
          type="email"
          placeholder="john.doe@email.com"
          className="form-control"
          value={profileData.email || ""}
          onBlur={validateEmailOnBlur}
          onChange={(e) => updateProfile({ email: e.target.value })}
          required
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Telephone/Mobile Number *</label>
        <input
          type="text"
          placeholder="0412 345 678"
          className="form-control"
          value={profileData.phoneNumber || ""}
          onChange={(e) => updateProfile({ phoneNumber: e.target.value })}
          required
        />
      </div>
    </div>
  );
};

export default StepOne;
