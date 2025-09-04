import { useState } from "react";
import { useProfile } from "../../contexts/ProfileContext";
import { useAuth } from "@clerk/clerk-react";
import axios from "axios";
import API_BASE_URL from "../../api"; // Adjust the import path as necessary
import { useEffect, useRef } from "react";
import { isValidEmail } from "../../utils/isValidEmail";

const StepOne = ({ setFormError }) => {
  const { profileData, updateProfile } = useProfile();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const { getToken, userId } = useAuth();
  const fileInputRef = useRef(null);

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("logo", file);

      const token = await getToken();

      const response = await axios.post(`${API_BASE_URL}/api/profile/${userId}/logo`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

  
      const logoURL = response.data.logo; // Assuming the response contains the logo URL
      // if (!response.ok) throw new Error(response.data.message || "Upload failed");

      const fullURL = `${API_BASE_URL}/${logoURL.replace(/^\/?/, "")}`;
      updateProfile({ logo: fullURL });
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleLogoRemove = () => {
    updateProfile({ logo: "", logoPath: "" });

    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
  };

  const validateEmailOnBlur = () => {
    setFormError("");
    const isValid = isValidEmail(profileData.email);
    !isValid && setFormError("A valid email is required");
  };

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
          placeholder="John Doe"
          className="form-control light-grey-placeholder-text"
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
          className="form-control light-grey-placeholder-text"
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
          className="form-control light-grey-placeholder-text"
          value={profileData.email || ""}
          onBlur={validateEmailOnBlur}
          onChange={(e) => {
            setFormError("");
            updateProfile({ email: e.target.value });
          }}
          required
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Telephone/Mobile Number *</label>
        <input
          type="text"
          className="form-control light-grey-placeholder-text"
          value={profileData.phoneNumber || ""}
          onChange={(e) => {
            const formatted = formatAustralianMobile(e.target.value);
            updateProfile({ phoneNumber: formatted });
          }}
          placeholder="04XX XXX XXX"
          required
        />
      </div>
      {/* 🔼 Logo Upload Section */}
      <div className="mb-3">
        <label className="form-label">Upload Logo</label>
        <input
          type="file"
          className="form-control"
          accept="image/*"
          onChange={handleLogoUpload}
          ref={fileInputRef}
        />
        {uploading && <small className="text-muted">Uploading...</small>}
        {error && <div className="text-danger">{error}</div>}
        {profileData.logo && (
          <div className="mt-2">
            <img
              src={profileData.logo}
              alt="Logo preview"
              style={{ maxWidth: "150px", maxHeight: "100px", border: "1px solid #ccc" }}
            />
            <div>
              <button
                className="btn btn-sm btn-outline-danger mt-2"
                type="button"
                onClick={handleLogoRemove}>
                Remove Logo
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StepOne;
