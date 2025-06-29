import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useProfile } from "../contexts/ProfileContext";
// import Header from '../components/Header';
import "bootstrap/dist/css/bootstrap.min.css";
import Header from "../components/Header/index";

const ProfileEdit = () => {
  const navigate = useNavigate();
  const { profileData, updateProfile, updatePartner, saveProfile, loading, error } = useProfile();

  const [success, setSuccess] = useState(false);

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

    const result = await saveProfile(true);
    if (result.success) {
      setSuccess(true);
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    }
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
                      onChange={(e) => updateProfile({ phoneNumber: e.target.value })}
                      required
                    />
                  </div>

                  {/* Company Section */}
                  <h4 className="mb-3 mt-4 border-bottom pb-2">Company Details</h4>
                  <div className="mb-3">
                    <label className="form-label">Company Y/N </label>
                    <div>
                      <div className="form-check form-check-inline">
                        <input
                          type="radio"
                          className="form-check-input"
                          id="companyYes"
                          checked={profileData.company === "Yes"}
                          onChange={() => updateProfile({ company: "Yes" })}
                          required
                        />
                        <label
                          className="form-check-label"
                          htmlFor="companyYes">
                          Yes
                        </label>
                      </div>
                      <div className="form-check form-check-inline">
                        <input
                          type="radio"
                          className="form-check-input"
                          id="companyNo"
                          checked={profileData.company === "No"}
                          onChange={() => updateProfile({ company: "No" })}
                          required
                        />
                        <label
                          className="form-check-label"
                          htmlFor="companyNo">
                          No
                        </label>
                      </div>
                    </div>
                  </div>

                  {profileData.company === "Yes" && (
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

                  {profileData.company === "Yes" && (
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
                  <div className="mb-3">
                    <label className="form-label">Partnership Y/N *</label>
                    <div>
                      <div className="form-check form-check-inline">
                        <input
                          type="radio"
                          className="form-check-input"
                          id="partnershipYes"
                          checked={profileData.partnership === "Yes"}
                          onChange={() => updateProfile({ partnership: "Yes" })}
                          required
                        />
                        <label
                          className="form-check-label"
                          htmlFor="partnershipYes">
                          Yes
                        </label>
                      </div>
                      <div className="form-check form-check-inline">
                        <input
                          type="radio"
                          className="form-check-input"
                          id="partnershipNo"
                          checked={profileData.partnership === "No"}
                          onChange={() => updateProfile({ partnership: "No" })}
                          required
                        />
                        <label
                          className="form-check-label"
                          htmlFor="partnershipNo">
                          No
                        </label>
                      </div>
                    </div>
                  </div>

                  {profileData.partnership === "Yes" && (
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
    </div>
  );
};

export default ProfileEdit;
