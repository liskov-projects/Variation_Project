import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useProfile } from "../contexts/ProfileContext";
// import Header from '../components/Header';
import "bootstrap/dist/css/bootstrap.min.css";
import Header from "../components/Header/index";
import { useAuth } from "@clerk/clerk-react";
import axios from "axios";
import API_BASE_URL from "../api"; // adjust if needed
import { isValidEmail } from "../utils/isValidEmail";
import Footer from "../components/Footer";

const ProfileEdit = () => {
  const navigate = useNavigate();
  const { profileData, updateProfile, updatePartner, saveProfile, loading, error } = useProfile();
  const fileInputRef = useRef(null);
  const [success, setSuccess] = useState(false);
  const { getToken, userId } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate ACN and ABN
    if (
      profileData.companyDetails?.acn &&
      profileData.companyDetails?.acn.toString().length !== 9
    ) {
      alert("ACN must be exactly 9 digits");
      return;
    }

    if (profileData.abn && profileData.abn.toString().length !== 11) {
      alert("ABN must be exactly 11 digits");
      return;
    }

    // Validate email
    const isValid = isValidEmail(profileData.email);
    !isValid && alert("Invalid email");

    const result = await saveProfile(true);
    if (result.success) {
      setSuccess(true);
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    }
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setUploadError("");

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

      const logoPath = response.data.logo;

      const fullURL = `${API_BASE_URL}/${logoPath.replace(/^\/?/, "")}`;
      updateProfile({ logo: fullURL, logoPath });
    } catch (err) {
      setUploadError(err?.response?.data?.message || err.message || "Upload failed");
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
      <Header />
      <div className="container py-4">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="card shadow-sm">
              <div className="card-header bg-primary text-white">
                <h3 className="mb-0">Edit Profile</h3>
              </div>
              <div className="card-body">
                {error && <div className="alert alert-danger">{error}</div>}
                {success && (
                  <div className="alert alert-success">Profile updated successfully!</div>
                )}

                <form onSubmit={handleSubmit}>
                  {/* Builder Information Section */}
                  <h4 className="mb-3 border-bottom pb-2">Builder Information</h4>
                  <div className="mb-3">
                    <label className="form-label">Builder Name *</label>
                    <input
                      type="text"
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
                      className="form-control light-grey-placeholder-text"
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
                      value={formatAustralianMobile(profileData.phoneNumber) || ""}
                      onChange={(e) => {
                        const formatted = formatAustralianMobile(e.target.value);
                        updateProfile({ phoneNumber: formatted });
                      }}
                      placeholder="04XX XXX XXX"
                      required
                    />
                  </div>

                  {/* Logo Upload */}
                  <h4 className="mb-3 mt-4 border-bottom pb-2">Logo</h4>
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
                    {uploadError && <div className="text-danger">{uploadError}</div>}
                    {profileData.logo && (
                      <div className="mt-2">
                        <img
                          src={profileData.logo}
                          alt="Logo preview"
                          style={{
                            maxWidth: "150px",
                            maxHeight: "100px",
                            border: "1px solid #ccc",
                          }}
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

                  {/* Company Section */}
                  <h4 className="mb-3 mt-4 border-bottom pb-2">Company Details</h4>

                  {profileData.businessType === "Company" && (
                    <div className="mb-3">
                      <label className="form-label">Company Name *</label>
                      <input
                        type="text"
                        className="form-control"
                        value={profileData.companyDetails?.companyName || ""}
                        onChange={(e) =>
                          updateProfile({
                            companyDetails: {
                              ...profileData.companyDetails,
                              companyName: e.target.value,
                            },
                          })
                        }
                        required
                      />
                    </div>
                  )}

                  {profileData.businessType === "Company" && (
                    <div className="mb-3">
                      <label className="form-label">ACN *</label>
                      <input
                        type="number"
                        className="form-control"
                        value={profileData.companyDetails?.acn || ""}
                        onChange={(e) =>
                          updateProfile({
                            companyDetails: {
                              ...profileData.companyDetails,
                              acn: e.target.value,
                            },
                          })
                        }
                        required
                      />
                    </div>
                  )}
                  <small className="text-muted">Must be exactly 9 digits</small>

                  {/* Partnership Section */}
                  <h4 className="mb-3 mt-4 border-bottom pb-2">Partnership Details</h4>

                  {profileData.businessType === "Partnership" && (
                    <div className="mb-4">
                      <div className="mb-3">
                        <label className="form-label">Number of Partners *</label>
                        <input
                          type="number"
                          className="form-control"
                          value={profileData.numberOfPartners || ""}
                          onChange={(e) => updateProfile({ numberOfPartners: e.target.value })}
                          min="1"
                          required
                        />
                      </div>

                      {profileData.partners &&
                        profileData.partners.map((partner, index) => (
                          <div
                            key={index}
                            className="card mb-3 border-light bg-light">
                            <div className="card-body">
                              <h5 className="card-title">Partner {index + 1}</h5>
                              <div className="mb-2">
                                <label className="form-label">Name *</label>
                                <input
                                  type="text"
                                  className="form-control"
                                  value={partner.name || ""}
                                  onChange={(e) => updatePartner(index, "name", e.target.value)}
                                  required
                                />
                              </div>
                              <div className="mb-2">
                                <label className="form-label">Address *</label>
                                <input
                                  type="text"
                                  className="form-control"
                                  value={partner.address || ""}
                                  onChange={(e) => updatePartner(index, "address", e.target.value)}
                                  required
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  )}

                  {/* Individual Information */}
                  <h4 className="mb-3 mt-4 border-bottom pb-2">Individual (Default)</h4>
                  <div className="mb-3">
                    <label className="form-label">ABN (11 digits) *</label>
                    <input
                      type="number"
                      className="form-control"
                      name="abn"
                      value={profileData.abn || ""}
                      onChange={(e) => updateProfile({ abn: e.target.value })}
                      required
                    />
                    <small className="text-muted">Must be exactly 11 digits</small>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Builder Registration # *</label>
                    <input
                      type="text"
                      className="form-control"
                      name="brn"
                      value={profileData.brn || ""}
                      onChange={(e) => updateProfile({ brn: e.target.value })}
                      required
                    />
                  </div>

                  <div className="d-flex justify-content-between mt-4">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => navigate("/dashboard")}>
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={loading}>
                      {loading ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer/>
    </div>
  );
};

export default ProfileEdit;
