import { useEffect, useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { useProject } from "../../contexts/ProjectContext";
import Header from "../../components/Header/index";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { PDFDownloadLink } from "@react-pdf/renderer";
import VariationPDF from "./VariationPDF"; 
import { useProfile } from "../../contexts/ProfileContext";
import ConfirmModal from "../../components/Variations/ConfirmModal"



const ProjectVariation = () => {
    const { projectId, variationId } = useParams();
    const navigate = useNavigate();
    const { fetchProjectById, currentProject, loading, error, sendForSignature } = useProject();
    const [variation, setVariation] = useState(null);
    const [fetchedProject,setFetchedProject]=useState(null);
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertType, setAlertType] = useState('success'); // 'success', 'error', 'info'
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [searchParams, setSearchParams] = useSearchParams();
    const { profileData } = useProfile();

    const isFirstVisit = searchParams.get('firstTime') === 'true';


  useEffect(() => {
    const fetchAndFindVariation = async () => {
      try {
        if (projectId) {
          const response = await fetchProjectById(projectId);
          setFetchedProject(response);
          findVariation();
        }
      } catch (error) {
        console.error("Error fetching project or finding variation:", error);
      }
    }
    fetchAndFindVariation();
  }, [projectId]);

    useEffect(() => {
      if (showConfirmModal) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "auto";
      }
      }, [showConfirmModal]);

  useEffect(() => {
    if (fetchedProject && isFirstVisit) {
      setShowConfirmModal(true);
    }
  }, [fetchedProject, isFirstVisit])


  // Find the requested variation in the current project
  const findVariation = () => {
    if (currentProject && currentProject.variations) {
      const foundVariation = currentProject.variations.find((v) => v._id === variationId);
      if (foundVariation) {
        setVariation(foundVariation);
      }
    }
  };

  // When current project changes, find the variation again
  useEffect(() => {
    findVariation();
  }, [currentProject, variationId]);

  // Auto-hide alert after 5 seconds
  useEffect(() => {
    if (showAlert) {
      const timer = setTimeout(() => {
        setShowAlert(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showAlert]);

  const showNotification = (message, type = "success") => {
    setAlertMessage(message);
    setAlertType(type);
    setShowAlert(true);
  };

  const handleBackToProject = () => {
    navigate(`/projects/${projectId}`);
  };

  const handleEditVariation = () => {
    navigate(`/projects/${projectId}/variations/${variationId}/edit`);
  };

  const handleSendVariationForSignature = async () => {

    if (!fetchedProject) {
      showNotification("Project data not loaded. Please try again.", "error");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await sendForSignature(
        projectId,
        variationId,
        variation,
        fetchedProject.clientEmail
      );

      if (response.success) {
        showNotification(
          `Variation sent successfully to ${fetchedProject.clientEmail}. The client will receive an email with a signature link.`,
          "success"
        );

        // Refresh the project data to get updated status
        await fetchProjectById(projectId);

        // Update local variation state with the new status
        setVariation((prev) => ({
          ...prev,
          status: "submitted",
        }));
      } else {
        showNotification(
          response.error || "Failed to send variation for signature. Please try again.",
          "error"
        );
      }
    } catch (error) {
      console.error("Error sending variation for approval:", error);
      showNotification(
        error.response?.data?.message ||
          "An error occurred while sending the variation. Please try again.",
        "error"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Format date strings
  const formatDate = (dateString) => {
    if (!dateString) return "Not set";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Format date and time for signatures
  const formatDateTime = (dateString) => {
    if (!dateString) return "Not set";
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  // Get status badge style
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "approved":
        return "bg-success";
      case "submitted":
        return "bg-primary";
      case "draft":
        return "bg-warning";
      case "rejected":
        return "bg-danger";
      default:
        return "bg-secondary";
    }
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-AU", {
      style: "currency",
      currency: "AUD",
    }).format(amount || 0);
  };

  // Calculate contract price with this variation
  const calculateContractPrice = () => {
    if (!currentProject) return 0;

    // If this variation is approved, it's already included in currentContractPrice
    if (variation && variation.status === "approved") {
      return currentProject.currentContractPrice || 0;
    }

    // If not approved, calculate what the price would be if approved
    if (variation) {
      const basePrice = currentProject.currentContractPrice || currentProject.contractPrice || 0;
      return basePrice + (variation.cost || 0);
    }

    return currentProject.currentContractPrice || currentProject.contractPrice || 0;
  };

  const setApprovalRecipient = () => {
    // If project has an architect send to Architect instead of owner/client
    if (currentProject.architect.hasArchitect === true) {
      const architectName = currentProject.architect.details.contactName;
      const architectEmail = currentProject.architect.details.email;
      return {name: architectName, email: architectEmail, type: 'Architect/Project Manager'}
    } else {
      return {name: fetchedProject.clientName, email: fetchedProject.clientEmail, type: 'Owner'}
    }

  }

  if (loading) {
    return (
      <div>
        <Header />
        <div className="d-flex justify-content-center align-items-center vh-100">
          <div
            className="spinner-border text-primary"
            role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Header />
        <div className="container py-4">
          <div className="alert alert-danger">{error}</div>
          <button
            className="btn btn-primary"
            onClick={handleBackToProject}>
            Back to Project
          </button>
        </div>
      </div>
    );
  }

  if (!variation) {
    return (
      <div>
        <Header />
        <div className="container py-4">
          <div className="alert alert-warning">Variation not found</div>
          <button
            className="btn btn-primary"
            onClick={handleBackToProject}>
            Back to Project
          </button>
        </div>
      </div>
    );
  }

  const contractPriceWithVariation = calculateContractPrice();

  return (
    <div>
      <Header />
      <div className="container py-4">
        {showAlert && (
          <div
            className={`alert alert-${alertType} alert-dismissible fade show`}
            role="alert">
            <div className="d-flex align-items-center">
              <i
                className={`bi ${alertType === "success" ? "bi-check-circle" : alertType === "error" ? "bi-exclamation-triangle" : "bi-info-circle"} me-2`}></i>
              <div>{alertMessage}</div>
            </div>
            <button
              type="button"
              className="btn-close"
              onClick={() => setShowAlert(false)}></button>
          </div>
        )}

          <div className="d-flex justify-content-between align-items-center mb-4">
            <div className="d-flex align-items-center">
              <button
                className="btn btn-outline-secondary me-3"
                onClick={handleBackToProject}
              >
                <i className="bi bi-arrow-left"></i>
              </button>
              <h2 className="mb-0">Variation Details</h2>
              <span
                className={`badge ms-3 ${getStatusBadgeClass(variation.status)}`}
              >
                {variation.status.charAt(0).toUpperCase() +
                  variation.status.slice(1)}
              </span>
            </div>
            <div>
              
            {variation?.status !== 'approved' && (
              <button
              className="btn btn-outline-primary"
              onClick={handleEditVariation}
              >
            <i className="bi bi-pencil me-1"></i>
              Edit Variation
            </button>
      )}

            </div>
          </div>

        {/* Project Info */}
        <div className="alert alert-info mb-4">
          <div className="row">
            <div className="col-md-6">
              <strong>Project:</strong> {currentProject?.projectName}
            </div>
            <div className="col-md-6">
              <strong>Property Address:</strong> {currentProject?.propertyAddress}
            </div>
          </div>
        </div>

        {/* Contract Price Summary */}
        {currentProject && (
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
                      {formatCurrency(currentProject.contractPrice || 0)}
                    </h4>
                  </div>
                </div>
                <div className="col-md-4 mb-3">
                  <div className="border rounded p-3 bg-light h-100">
                    <div className="d-flex align-items-center mb-2">
                      <i className="bi bi-check-circle text-success me-2"></i>
                      <h6 className="mb-0 text-muted">Current Contract Price</h6>
                    </div>
                    <h4 className="mb-0 text-success">
                      {formatCurrency(
                        currentProject.currentContractPrice || currentProject.contractPrice || 0
                      )}
                    </h4>
                    <small className="text-muted">Including all approved variations</small>
                  </div>
                </div>
                <div className="col-md-4 mb-3">
                  <div className="border rounded p-3 bg-light h-100">
                    <div className="d-flex align-items-center mb-2">
                      <i
                        className={`bi ${variation.status === "approved" ? "bi-check-circle text-success" : "bi-clock text-warning"} me-2`}></i>
                      <h6 className="mb-0 text-muted">
                        {variation.status === "approved"
                          ? "Contract Price"
                          : "Projected Contract Price"}
                      </h6>
                    </div>
                    <h4
                      className={`mb-0 ${variation.status === "approved" ? "text-success" : "text-warning"}`}>
                      {formatCurrency(contractPriceWithVariation)}
                    </h4>
                    <small className="text-muted">
                      {variation.status === "approved"
                        ? "This variation is approved"
                        : "If this variation is approved"}
                    </small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="d-flex justify-content-between my-4">
            <button className="btn btn-secondary" onClick={handleBackToProject}>
              Back to Project
            </button>
            {variation.status === 'draft' && (
              <button 
                className='btn btn-primary'
                onClick={() => setShowConfirmModal(true)}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Sending...
                  </>
                ) : (
                  <>
                    <i className="bi bi-envelope me-2"></i>
                    {currentProject.architect.hasArchitect === true 
                    ? `Send To Architect ${variation.permitVariation === "Yes" ? `And Surveyor` : ""} For Approval` 
                    : `Send To Owner ${variation.permitVariation === "Yes" ? `And Surveyor` : ""} For Approval`}
                  </>
                )}
              </button>
            )}
            {variation.status !== 'approved' && (
              <button
                className="btn btn-primary"
                onClick={handleEditVariation}
              >
                Edit Variation
              </button>
            )}
            <PDFDownloadLink
              document={
                <VariationPDF project={currentProject} variation={variation} profile={profileData}/>
              }
              fileName={`variation-${variation._id}.pdf`}
              className="btn btn-danger"
            >
              {({ loading }) => (loading ? "Preparing PDF..." : "Download PDF")}
            </PDFDownloadLink>
        </div>

        {/* Variation Details Card */}
        <div className="card mb-4">
          <div className="card-header bg-light">
            <h4 className="mb-0">Variation Information</h4>
          </div>
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
                  <span className={`badge ${getStatusBadgeClass(variation.status)}`}>
                    {variation.status.charAt(0).toUpperCase() + variation.status.slice(1)}
                  </span>
                </p>
              </div>
            </div>

            <div className="row">
              <div className="col-md-12">
                <div className="card bg-light">
                  <div className="card-body text-center">
                    <h5 className="card-title">Variation Cost</h5>
                    <p className="display-6 text-primary">{formatCurrency(variation.cost)}</p>
                    <small className="text-muted">
                      {variation.status === "approved"
                        ? "This amount has been added to the contract price"
                        : "This amount will be added if the variation is approved"}
                    </small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Signature Information */}
        {variation.status === "approved" && variation.signedBy && (
          <div className="card mb-4">
            <div className="card-header bg-success text-white">
              <h4 className="mb-0">
                <i className="bi bi-check-circle me-2"></i>
                Signature Information
              </h4>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6">
                  <h5>Signed By</h5>
                  <p className="ms-3">{variation.signedBy.name}</p>
                </div>
                <div className="col-md-6">
                  <h5>Date & Time Signed</h5>
                  <p className="ms-3">{formatDateTime(variation.signedAt)}</p>
                </div>
              </div>
              <div className="row">
                <div className="col-md-6">
                  <h5>Email</h5>
                  <p className="ms-3">{variation.signedBy.email}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Status History */}
        <div className="card mb-4">
          <div className="card-header bg-light">
            <h4 className="mb-0">Status Information</h4>
          </div>
          <div className="card-body">
            <div className="d-flex position-relative pb-5">
              {/* Status Timeline */}
              <div
                className="position-absolute h-100"
                style={{
                  left: "120px",
                  width: "4px",
                  backgroundColor: "#e0e0e0",
                  zIndex: "1",
                }}></div>

              {/* Status Points */}
              <div
                className="position-relative w-100"
                style={{ zIndex: "2" }}>
                <div
                  className={`d-flex align-items-center mb-4 ${
                    variation.status === "draft" ||
                    variation.status === "submitted" ||
                    variation.status === "approved" ||
                    variation.status === "rejected"
                      ? "opacity-100"
                      : "opacity-50"
                  }`}>
                  <div style={{ width: "120px" }}>
                    <span className="badge bg-warning">Draft</span>
                  </div>
                  <div
                    className="rounded-circle bg-warning d-flex align-items-center justify-content-center"
                    style={{
                      width: "24px",
                      height: "24px",
                      marginRight: "10px",
                    }}>
                    <i className="bi bi-check-lg text-white"></i>
                  </div>
                  <div>Created on {formatDate(variation.dateCreated)}</div>
                </div>

                <div
                  className={`d-flex align-items-center mb-4 ${
                    variation.status === "submitted" ||
                    variation.status === "approved" ||
                    variation.status === "rejected"
                      ? "opacity-100"
                      : "opacity-50"
                  }`}>
                  <div style={{ width: "120px" }}>
                    <span className="badge bg-primary">Submitted</span>
                  </div>
                  <div
                    className={`rounded-circle d-flex align-items-center justify-content-center ${
                      variation.status === "submitted" ||
                      variation.status === "approved" ||
                      variation.status === "rejected"
                        ? "bg-primary"
                        : "bg-secondary"
                    }`}
                    style={{
                      width: "24px",
                      height: "24px",
                      marginRight: "10px",
                    }}>
                    <i className="bi bi-check-lg text-white"></i>
                  </div>
                  <div>
                    {variation.status === "submitted" ||
                    variation.status === "approved" ||
                    variation.status === "rejected"
                      ? "Submitted to client"
                      : "Not yet submitted"}
                  </div>
                </div>

                <div
                  className={`d-flex align-items-center ${
                    variation.status === "approved" || variation.status === "rejected"
                      ? "opacity-100"
                      : "opacity-50"
                  }`}>
                  <div style={{ width: "120px" }}>
                    <span
                      className={`badge ${
                        variation.status === "approved"
                          ? "bg-success"
                          : variation.status === "rejected"
                            ? "bg-danger"
                            : "bg-secondary"
                      }`}>
                      {variation.status === "approved"
                        ? "Approved"
                        : variation.status === "rejected"
                          ? "Rejected"
                          : "Pending"}
                    </span>
                  </div>
                  <div
                    className={`rounded-circle d-flex align-items-center justify-content-center ${
                      variation.status === "approved"
                        ? "bg-success"
                        : variation.status === "rejected"
                          ? "bg-danger"
                          : "bg-secondary"
                    }`}
                    style={{
                      width: "24px",
                      height: "24px",
                      marginRight: "10px",
                    }}>
                    <i
                      className={`bi ${
                        variation.status === "approved"
                          ? "bi-check-lg"
                          : variation.status === "rejected"
                            ? "bi-x-lg"
                            : "bi-dash-lg"
                      } text-white`}></i>
                  </div>
                  <div>
                    {variation.status === "approved"
                      ? `Approved by client on ${formatDateTime(variation.signedAt)}`
                      : variation.status === "rejected"
                        ? "Rejected by client"
                        : "Awaiting client decision"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

            {showConfirmModal && 
            <ConfirmModal 
              setShowConfirmModal={setShowConfirmModal} 
              handleSendVariationForSignature={handleSendVariationForSignature}
              isSubmitting={isSubmitting}
              recipientDetails={setApprovalRecipient()}
            />}

        </div>
      </div>
    );
  };

export default ProjectVariation;
