import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import axios from "axios";
import useFormStorage from "../hooks/useFormStorage";
// import Header from '../components/Header';
import Header from "../components/Header/index";
import API_BASE_URL from "../api";
import { isValidEmail } from "../utils/isValidEmail";
import Footer from "../components/Footer";

// NOTE: where is this used?
const UserProfile = () => {
  const navigate = useNavigate();
  const { userId, getToken } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const { updateFormData } = useFormStorage();
  const [userInfo, setUserInfo] = useState({
    // Personal Information
    fullName: "",
    address: "",
    email: "",
    phonenumber: "",
    dob: "",
    gender: "",

    // Company Information
    company: "No",
    companyName: "",

    // Partnership Information
    partnership: "No",
    numberOfPartners: "",
    partners: [],

    // Individual Information (Builder specific)
    acn: "",
    abn: "",
    brn: "",
  });

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      if (!userId) return;

      setLoading(true);
      try {
        const token = await getToken();
        const response = await axios.get(`${API_BASE_URL}/api/user/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data && response.data.formData && response.data.formData.length > 0) {
          // Use the latest form data
          const latestFormData = response.data.formData[response.data.formData.length - 1];
          setUserInfo((prevState) => ({ ...prevState, ...latestFormData }));
          updateFormData(latestFormData);
        }
      } catch (err) {
        if (err.response && err.response.status === 404) {
          // User not found, probably first time setup
          // We keep the default empty state
        } else {
          setError("Failed to load user data. Please try again later.");
          console.error("Error fetching user data:", err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId, getToken, updateFormData]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    setUserInfo((prevState) => {
      const newState = {
        ...prevState,
        [name]: value,
      };

      // If changing partnership status or number of partners,
      // update partners array here instead of in a separate effect
      if (name === "businessType" || name === "numberOfPartners") {
        // Only process partners if partnership is 'Yes' and numberOfPartners is a valid number
        if (
          (name === "businessType" && value === "Partnership" && prevState.numberOfPartners) ||
          (name === "numberOfPartners" && value && prevState.businessType === "Partnership")
        ) {
          const numPartners = parseInt(
            name === "numberOfPartners" ? value : prevState.numberOfPartners
          );
          let updatedPartners = [...(prevState.partners || [])];

          // If we need more partners, add empty ones
          while (updatedPartners.length < numPartners) {
            updatedPartners.push({ name: "", address: "" });
          }

          // If we need fewer partners, remove excess ones
          if (updatedPartners.length > numPartners) {
            updatedPartners = updatedPartners.slice(0, numPartners);
          }

          newState.partners = updatedPartners;
        }

        // If partnership is set to 'No', clear partners
        if (name === "businessType" && value !== "Partnership") {
          newState.partners = [];
          newState.numberOfPartners = "";
        }
      }

      return newState;
    });
  };

  // Handle partner input changes
  const handlePartnerChange = (index, field, value) => {
    const updatedPartners = [...(userInfo.partners || [])];
    if (!updatedPartners[index]) {
      updatedPartners[index] = { name: "", address: "" };
    }
    updatedPartners[index][field] = value;

    setUserInfo((prevState) => ({
      ...prevState,
      partners: updatedPartners,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaveLoading(true);
    setError(null);
    setSuccess(false);

    // Validate ACN and ABN
    if (userInfo.acn && userInfo.acn.toString().length !== 9) {
      setError("ACN must be exactly 9 digits");
      setSaveLoading(false);
      return;
    }

    if (userInfo.abn && userInfo.abn.toString().length !== 11) {
      setError("ABN must be exactly 11 digits");
      setSaveLoading(false);
      return;
    }

    // Validate email
    const isValid = isValidEmail(userInfo.email);
    if (!isValid) {
      setError("Invalid email");
      setSaveLoading(false);
      return;
    }

    try {
      const token = await getToken();

      // Check if user already exists
      let userExists = false;
      try {
        const checkResponse = await axios.get(`${API_BASE_URL}/api/user/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        userExists = checkResponse.status === 200;
      } catch (err) {
        userExists = false;
      }

      let response;
      if (userExists) {
        // Update existing user
        response = await axios.put(
          `${API_BASE_URL}/api/user/${userId}`,
          {
            userId,
            email: userInfo.email,
            formData: userInfo,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } else {
        // Create new user
        response = await axios.post(
          `${API_BASE_URL}/api/forms/submit`,
          {
            userId,
            email: userInfo.email,
            formData: userInfo,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }

      setSuccess(true);
      updateFormData(userInfo);

      // Show success message for 2 seconds then redirect
      setTimeout(() => {
        navigate("/welcome");
      }, 2000);
    } catch (err) {
      setError("Failed to update profile. Please try again later.");
      console.error("Error updating profile:", err);
    } finally {
      setSaveLoading(false);
    }
  };

  if (loading) {
    return (
      <div>
        <Header />
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ height: "calc(100vh - 56px)" }}>
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
      <div className="container py-4">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="card shadow-sm">
              <div className="card-header bg-primary text-white">
                <h3 className="mb-0">Client Information</h3>
              </div>
              <div className="card-body">
                {error && <div className="alert alert-danger">{error}</div>}
                {success && (
                  <div className="alert alert-success">Profile updated successfully!</div>
                )}

                <form onSubmit={handleSubmit}>
                  {/* Personal Information Section */}
                  <h4 className="mb-3 border-bottom pb-2">Builder Information</h4>
                  <div className="mb-3">
                    <label className="form-label">Builder Name *</label>
                    <input
                      type="text"
                      className="form-control"
                      name="fullName"
                      value={userInfo.fullName || ""}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Address *</label>
                    <input
                      type="text"
                      className="form-control"
                      name="address"
                      value={userInfo.address || ""}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Email *</label>
                    <input
                      type="email"
                      className="form-control"
                      name="email"
                      value={userInfo.email || ""}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Telephone/Mobile Number *</label>
                    <input
                      type="text"
                      className="form-control"
                      name="phonenumber"
                      value={userInfo.phonenumber || ""}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  {/* Company Section */}
                  <h4 className="mb-3 mt-4 border-bottom pb-2">Company Details</h4>

                  {userInfo.businessType === "Company" && (
                    <div className="mb-3">
                      <label className="form-label">Company Name *</label>
                      <input
                        type="text"
                        className="form-control"
                        name="companyName"
                        value={userInfo.companyName || ""}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  )}

                  {/* Partnership Section */}
                  <h4 className="mb-3 mt-4 border-bottom pb-2">Partnership Details</h4>

                  {userInfo.businessType === "Partnership" && (
                    <div className="mb-4">
                      <div className="mb-3">
                        <label className="form-label">Number of Partners *</label>
                        <input
                          type="number"
                          className="form-control"
                          name="numberOfPartners"
                          value={userInfo.numberOfPartners || ""}
                          onChange={handleChange}
                          min="1"
                          required
                        />
                      </div>

                      {userInfo.partners &&
                        userInfo.partners.map((partner, index) => (
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
                                  onChange={(e) =>
                                    handlePartnerChange(index, "name", e.target.value)
                                  }
                                  required
                                />
                              </div>
                              <div className="mb-2">
                                <label className="form-label">Address *</label>
                                <input
                                  type="text"
                                  className="form-control"
                                  value={partner.address || ""}
                                  onChange={(e) =>
                                    handlePartnerChange(index, "address", e.target.value)
                                  }
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
                    <label className="form-label">ACN (9 digits) *</label>
                    <input
                      type="number"
                      className="form-control"
                      name="acn"
                      value={userInfo.acn || ""}
                      onChange={handleChange}
                      required
                      pattern="[0-9]{9}"
                      title="ACN must be exactly 9 digits"
                    />
                    <small className="text-muted">Must be exactly 9 digits</small>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">ABN (11 digits) *</label>
                    <input
                      type="number"
                      className="form-control"
                      name="abn"
                      value={userInfo.abn || ""}
                      onChange={handleChange}
                      required
                      pattern="[0-9]{11}"
                      title="ABN must be exactly 11 digits"
                    />
                    <small className="text-muted">Must be exactly 11 digits</small>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Builder Registration # *</label>
                    <input
                      type="text"
                      className="form-control"
                      name="brn"
                      value={userInfo.brn || ""}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="d-flex justify-content-between mt-4">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => navigate("/welcome")}>
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={saveLoading}>
                      {saveLoading ? "Saving..." : "Save Changes"}
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

export default UserProfile;
