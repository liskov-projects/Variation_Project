import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import API_BASE_URL from "../api";
import { formatDisplayCurrency } from "../utils/formatCurrency";
import Footer from "../components/Footer";

const SignaturePage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [project, setProject] = useState(null);
  const [variation, setVariation] = useState(null);
  const [error, setError] = useState(null);
  const [clientName, setClientName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVariation = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${API_BASE_URL}/api/projects/variations/validate-token?token=${token}`
        );
        setProject(response.data.project);
        setVariation(response.data.variation);
        setLoading(false);
      } catch (error) {
        setError(error.response?.data?.message || "Invalid or expired token");
        setLoading(false);
      }
    };
    if (token) {
      fetchVariation();
    } else {
      setError("No token provided");
      setLoading(false);
    }
  }, [token]);

  const handleSubmitSignature = async (e) => {
    e.preventDefault();
    if (!clientName.trim()) {
      setError("Please enter your name to sign this variation");
      return;
    }

    // Check if the checkbox is checked
    const agreementCheck = document.getElementById("agreementCheck");
    if (!agreementCheck.checked) {
      setError("Please acknowledge the agreement by checking the box");
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null); // Clear any previous errors

      const response = await axios.post(`${API_BASE_URL}/api/projects/variations/sign`, {
        token,
        signedBy: {
          name: clientName.trim(),
          userAgent: navigator.userAgent,
        },
      });

      if (response.data.success) {
        setSuccessMessage("Variation successfully signed and approved! Thank you.");
        // Update local state with the signed variation
        setVariation(response.data.variation);
        setProject(response.data.project);
      } else {
        setError("Failed to sign variation. Please try again.");
      }
    } catch (error) {
      console.error("Error signing variation:", error);
      setError(error.response?.data?.message || "Failed to submit signature. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container py-5">
        <div className="d-flex justify-content-center align-items-center vh-50">
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
  if (error) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger">
          <h4 className="alert-heading">Error</h4>
          <p>{error}</p>
        </div>
      </div>
    );
  }
  if (successMessage) {
    return (
      <div className="container py-5">
        <div className="alert alert-success">
          <h4 className="alert-heading">Success!</h4>
          <p>{successMessage}</p>
        </div>
      </div>
    );
  }
  if (!variation || !project) {
    return (
      <div className="container py-5">
        <div className="alert alert-warning">
          <h4 className="alert-heading">Not Found</h4>
          <p>The requested variation could not be found or has expired.</p>
        </div>
      </div>
    );
  }

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "Not set";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-AU", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Calculate contract price with this variation
  const currentContractPrice = project.currentContractPrice || project.contractPrice || 0;
  const contractPriceWithVariation = currentContractPrice + (variation.cost || 0);

  return (
    <div className="container py-5">
      <div className="card border-0 shadow">
        <div className="card-header bg-primary text-white">
          <h2 className="mb-0">Project Variation Approval</h2>
        </div>
        <div className="card-body">
          {/* Project Info */}
          <div className="alert alert-info mb-4">
            <div className="row">
              <div className="col-md-6">
                <strong>Project:</strong> {project.projectName}
              </div>
              <div className="col-md-6">
                <strong>Property Address:</strong> {project.propertyAddress}
              </div>
            </div>
          </div>

          {/* Contract Price Summary */}
          <div className="card mb-4">
            <div className="card-header bg-light">
              <h4 className="mb-0">Contract Price Summary</h4>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-4 mb-3">
                  <div className="border rounded p-3 bg-light h-100">
                    <div className="d-flex align-items-center mb-2">
                      <i className="bi bi-file-text text-primary me-2"></i>
                      <h6 className="mb-0 text-muted">Original Contract Price</h6>
                    </div>
                    <h4 className="mb-0 text-primary">
                      {formatDisplayCurrency(project.contractPrice || 0)}
                    </h4>
                  </div>
                </div>
                <div className="col-md-4 mb-3">
                  <div className="border rounded p-3 bg-light h-100">
                    <div className="d-flex align-items-center mb-2">
                      <i className="bi bi-check-circle text-success me-2"></i>
                      <h6 className="mb-0 text-muted">Current Contract Price</h6>
                    </div>
                    <h4 className="mb-0 text-success">{formatDisplayCurrency(currentContractPrice)}</h4>
                    <small className="text-muted">Including all approved variations</small>
                  </div>
                </div>
                <div className="col-md-4 mb-3">
                  <div className="border rounded p-3 bg-light h-100">
                    <div className="d-flex align-items-center mb-2">
                      <i className="bi bi-arrow-up-circle text-warning me-2"></i>
                      <h6 className="mb-0 text-muted">New Contract Price</h6>
                    </div>
                    <h4 className="mb-0 text-warning">
                      {formatDisplayCurrency(contractPriceWithVariation)}
                    </h4>
                    <small className="text-muted">If this variation is approved</small>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Variation Details */}
          <h4>Variation Details</h4>
          <div className="card mb-4">
            <div className="card-body">
              <div className="row mb-4">
                <div className="col-md-12">
                  <h5>Description</h5>
                  <p className="ms-3">{variation.description}</p>
                </div>
              </div>

              <div className="row mb-4">
                <div className="col-md-6">
                  <h5>Reason for Variation</h5>
                  <p className="ms-3">{variation.reason}</p>
                </div>
                <div className="col-md-6">
                  <h5>Effect on Project</h5>
                  <p className="ms-3">{variation.effect}</p>
                </div>
              </div>

              <div className="row mb-4">
                <div className="col-md-3">
                  <h5>Permit Required</h5>
                  <p className="ms-3">{variation.permitVariation}</p>
                </div>
                <div className="col-md-3">
                  <h5>Timeline Delay</h5>
                  <p className="ms-3">{variation.delay}</p>
                </div>
                <div className="col-md-3">
                  <h5>Date Created</h5>
                  <p className="ms-3">{formatDate(variation.dateCreated)}</p>
                </div>
                <div className="col-md-3">
                  <h5>Status</h5>
                  <p className="ms-3">
                    <span className="badge bg-primary">Awaiting Approval</span>
                  </p>
                </div>
              </div>

              <div className="row">
                <div className="col-md-12">
                  <div className="card bg-light">
                    <div className="card-body text-center">
                      <h5 className="card-title">Variation Cost</h5>
                      <p className="display-6 text-primary">{formatDisplayCurrency(variation.cost)}</p>
                      <small className="text-muted">
                        This amount will be added to your contract price if approved
                      </small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Signature Section */}
          <div className="card border-warning">
            <div className="card-header bg-warning text-dark">
              <h4 className="mb-0">
                <i className="bi bi-pen me-2"></i>
                Digital Signature Required
              </h4>
            </div>
            <div className="card-body">
              <div className="alert alert-info">
                <h5>
                  <i className="bi bi-info-circle me-2"></i>
                  Please Review Carefully
                </h5>
                <p className="mb-0">
                  By signing below, you acknowledge that you have reviewed the variation details
                  above and approve the additional cost of{" "}
                  <strong>{formatDisplayCurrency(variation.cost)}</strong>
                  to be added to your project contract.
                </p>
              </div>

              <form onSubmit={handleSubmitSignature}>
                <div className="mb-3">
                  <label
                    htmlFor="clientName"
                    className="form-label">
                    <strong>Full Name (Electronic Signature)</strong>
                  </label>
                  <input
                    type="text"
                    className="form-control form-control-lg"
                    id="clientName"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="Enter your full name as it appears on the contract"
                    required
                  />
                  <div className="form-text">
                    Your name will be recorded as your electronic signature with timestamp and IP
                    address.
                  </div>
                </div>

                <div className="border rounded p-3 bg-light mb-3">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="agreementCheck"
                      required
                    />
                    <label
                      className="form-check-label"
                      htmlFor="agreementCheck">
                      <strong>I acknowledge and agree that:</strong>
                      <ul className="mt-2 mb-0">
                        <li>I have reviewed all variation details above</li>
                        <li>I approve the additional cost of {formatDisplayCurrency(variation.cost)}</li>
                        <li>
                          I understand this will increase the total contract price to{" "}
                          {formatDisplayCurrency(contractPriceWithVariation)}
                        </li>
                        <li>This electronic signature is legally binding</li>
                      </ul>
                    </label>
                  </div>
                </div>

                <div className="d-grid gap-2">
                  <button
                    type="submit"
                    className="btn btn-success btn-lg"
                    disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                          aria-hidden="true"></span>
                        Processing Signature...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-check-circle me-2"></i>
                        Sign and Approve Variation
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className="card-footer bg-light">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <small className="text-muted">
                <i className="bi bi-calendar-event me-1"></i>
                Submitted: {formatDate(variation.dateCreated)}
              </small>
            </div>
            <div>
              <small className="text-muted">
                <i className="bi bi-clock me-1"></i>
                Link expires 24 hours from receipt
              </small>
            </div>
          </div>
        </div>
      </div>
      <Footer/>
    </div>
  );
};

export default SignaturePage;
