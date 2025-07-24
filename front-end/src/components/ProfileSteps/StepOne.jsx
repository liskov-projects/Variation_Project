import React from "react";
import { useProfile } from "../../contexts/ProfileContext";

const StepOne = () => {
  const { profileData, updateProfile } = useProfile();

  const formatAustralianMobile = (input) => {
  // Remove all non-digit characters
  const digits = input.replace(/\D/g, "");

  // Format: 0412 345 678
  if (digits.length <= 4) return digits;
  if (digits.length <= 7) return `${digits.slice(0, 4)} ${digits.slice(4)}`;
  return `${digits.slice(0, 4)} ${digits.slice(4, 7)} ${digits.slice(7, 10)}`;
};


  return (
    <div>
      <h4 className="mb-3">Builder Information</h4>

      <div className="mb-3">
        <label className="form-label">Builder Name *</label>
        <input
          type="text"
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
          className="form-control"
          value={profileData.email || ""}
          onChange={(e) => updateProfile({ email: e.target.value })}
          required
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Telephone/Mobile Number *</label>
        <input
          type="text"
          className="form-control"
          value={profileData.phoneNumber || ""}
          onChange={(e) => {
              const formatted = formatAustralianMobile(e.target.value);
               updateProfile({ phoneNumber: formatted });
     }}
          placeholder="04XX XXX XXX"
          required
        />
      </div>
    </div>
  );
};

export default StepOne;
