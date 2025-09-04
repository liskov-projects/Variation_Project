import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useProject } from "../../contexts/ProjectContext";
import Header from "../../components/Header/index";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { PDFDownloadLink } from "@react-pdf/renderer";
import VariationPDF from "./VariationPDF";
import { useProfile } from "../../contexts/ProfileContext";
import filterSearch from "../../utils/filterSearch";
const ProjectDetails = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { fetchProjectById, currentProject, loading, deleteVariation } = useProject();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [variationToDelete, setVariationToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);
  const [lastFetchTime, setLastFetchTime] = useState(Date.now());
  const { profileData } = useProfile();
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (projectId && !hasFetched) {
      fetchProjectById(projectId).then(() => setHasFetched(true));
    }
  }, [projectId, fetchProjectById, hasFetched]);

  // Add polling to check for updates every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (projectId && Date.now() - lastFetchTime > 30000) {
        fetchProjectById(projectId);
        setLastFetchTime(Date.now());
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [projectId, fetchProjectById, lastFetchTime]);

  // Manual refresh function
  const handleRefresh = async () => {
    if (projectId) {
      await fetchProjectById(projectId);
      setLastFetchTime(Date.now());
    }
  };

  const handleEditProject = () => {
    navigate(`/projects/${projectId}/edit`);
  };

  const handleBackToProjects = () => {
    navigate("/projects");
  };

  const handleCreateVariation = () => {
    navigate(`/projects/${projectId}/variations/start`);
  };

  const handleViewVariation = (variationId) => {
    navigate(`/projects/${projectId}/variations/${variationId}`);
  };

  const handleEditVariation = (variationId, e) => {
    e.stopPropagation();
    navigate(`/projects/${projectId}/variations/${variationId}/edit`);
  };

  const confirmDeleteVariation = (variation, e) => {
    e.stopPropagation();
    setVariationToDelete(variation);
    setShowDeleteModal(true);
  };

  const handleDeleteVariation = async () => {
    if (!variationToDelete) return;

    setDeleteLoading(true);
    const result = await deleteVariation(projectId, variationToDelete._id);
    setDeleteLoading(false);

    if (result.success) {
      setShowDeleteModal(false);
      setVariationToDelete(null);
      // Refresh the project data after deletion
      await handleRefresh();
    }
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setVariationToDelete(null);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Not set";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "active":
        return "bg-success";
      case "on-hold":
        return "bg-warning";
      case "completed":
        return "bg-info";
      case "cancelled":
        return "bg-danger";
      default:
        return "bg-secondary";
    }
  };

  const getVariationStatusBadgeClass = (status) => {
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

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-AU", {
      style: "currency",
      currency: "AUD",
    }).format(amount || 0);
  };

  const formatAustralianMobile = (value) => {
    if (!value) return "";
    const cleaned = value.replace(/\D/g, "");
    if (cleaned.startsWith("04")) {
      return cleaned.replace(/^(\d{4})(\d{3})(\d{0,3}).*/, "$1 $2 $3").trim();
    }
    return value; // fallback if not matching
  };

  if (loading && !currentProject) {
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

  if (!currentProject) {
    return (
      <div>
        <Header />
        <div className="container py-4">
          <div className="alert alert-warning">Project not found</div>
          <button
            className="btn btn-primary"
            onClick={handleBackToProjects}>
            Back to Projects
          </button>
        </div>
      </div>
    );
  }

  function handleChange(e) {
    setQuery(e.target.value);
  }

  const variationsToShow = filterSearch(currentProject.variations, query);

  return (
    <div>
      <Header />
      <div className="container py-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div className="d-flex align-items-center">
            <button
              className="btn btn-outline-secondary me-3"
              onClick={handleBackToProjects}>
              <i className="bi bi-arrow-left"></i>
            </button>
            <h2 className="mb-0">{currentProject.projectName}</h2>
            {currentProject.status && (
              <span className={`badge ms-3 ${getStatusBadgeClass(currentProject.status)}`}>
                {currentProject.status.charAt(0).toUpperCase() + currentProject.status.slice(1)}
              </span>
            )}
          </div>
          <div>
            <button
              className="btn btn-outline-secondary me-2"
              onClick={handleRefresh}
              disabled={loading}
              title="Refresh project data">
              <i className={`bi bi-arrow-clockwise ${loading ? "spin" : ""}`}></i>
            </button>
            <button
              className="btn btn-outline-primary me-2"
              onClick={handleEditProject}>
              <i className="bi bi-pencil me-1"></i>
              Edit Project
            </button>
            <button
              className="btn btn-primary"
              onClick={handleCreateVariation}>
              <i className="bi bi-plus-lg me-1"></i>
              New Variation
            </button>
          </div>
        </div>

        {/* Project Details Card */}
        <div className="card mb-4">
          <div className="card-header bg-light">
            <h4 className="mb-0">Project Details</h4>
          </div>
          <div className="card-body">
            <div className="row mb-3">
              <div className="col-md-6">
                <h5>Project Information</h5>
                <div className="ms-3 mb-3">
                  <div className="row mb-2">
                    <div className="col-md-4 fw-bold">Property Address:</div>
                    <div className="col-md-8">{currentProject.propertyAddress}</div>
                  </div>
                  <div className="row mb-2">
                    <div className="col-md-4 fw-bold">Start Date:</div>
                    <div className="col-md-8">{formatDate(currentProject.startDate)}</div>
                  </div>
                  <div className="row mb-2">
                    <div className="col-md-4 fw-bold">Expected End:</div>
                    <div className="col-md-8">{formatDate(currentProject.expectedEndDate)}</div>
                  </div>
                  <div className="row">
                    <div className="col-md-4 fw-bold">Description:</div>
                    <div className="col-md-8">
                      {currentProject.description || "No description provided"}
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <h5>Client Information</h5>
                <div className="ms-3">
                  <div className="row mb-2">
                    <div className="col-md-4 fw-bold">Name:</div>
                    <div className="col-md-8">{currentProject.clientName}</div>
                  </div>
                  <div className="row mb-2">
                    <div className="col-md-4 fw-bold">Email:</div>
                    <div className="col-md-8">{currentProject.clientEmail}</div>
                  </div>
                  <div className="row">
                    <div className="col-md-4 fw-bold">Phone:</div>
                    <div className="col-md-8">
                      {formatAustralianMobile(currentProject.clientPhone)}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contract Price Summary */}
            <div className="border-top pt-3">
              <h5>Contract Price Summary</h5>
              <div className="ms-3">
                <div className="row">
                  <div className="col-md-6">
                    <div className="row mb-2">
                      <div className="col-md-6 fw-bold">Original Contract Price:</div>
                      <div className="col-md-6">
                        <span className="text-primary fs-5">
                          {formatCurrency(currentProject.contractPrice || 0)}
                        </span>
                      </div>
                    </div>
                    {currentProject.variations && currentProject.variations.length > 0 && (
                      <div className="row mb-2">
                        <div className="col-md-6 fw-bold">Current Contract Price:</div>
                        <div className="col-md-6">
                          <span className="text-success fs-5">
                            {formatCurrency(
                              currentProject.currentContractPrice || currentProject.contractPrice
                            )}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="col-md-6">
                    {currentProject.variations && currentProject.variations.length > 0 && (
                      <>
                        <div className="row mb-2">
                          <div className="col-md-6 fw-bold">Total Variations:</div>
                          <div className="col-md-6">{currentProject.variations.length}</div>
                        </div>
                        <div className="row mb-2">
                          <div className="col-md-6 fw-bold">Total Variation Cost:</div>
                          <div className="col-md-6">
                            <span className="text-info">
                              {formatCurrency(
                                currentProject.variations.reduce((total, variation) => {
                                  if (variation.status === "approved") {
                                    return total + (variation.cost || 0);
                                  }
                                  return total;
                                }, 0)
                              )}
                            </span>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Variations Section */}
        <div className="card">
          <div className="card-header bg-light d-flex justify-content-between align-items-center">
            <h4 className="mb-0">Variations</h4>
            <div>
              {loading && (
                <small className="text-muted me-3">
                  <i className="bi bi-arrow-clockwise spin"></i>
                  Refreshing...
                </small>
              )}
              <button
                className="btn btn-sm btn-primary"
                onClick={handleCreateVariation}>
                <i className="bi bi-plus-lg me-1"></i>
                Add Variation
              </button>
            </div>
          </div>
          <div className="col-md-6 m-2">
            <label className="form-label">
              <b>Search for</b>
            </label>
            <input
              placeholder="variation description, reason, effect..."
              className="form-control mb-2"
              value={query}
              onChange={handleChange}
            />
          </div>
          <div className="card-body">
            {!currentProject.variations || currentProject.variations.length === 0 ? (
              <div className="text-center py-4">
                <i
                  className="bi bi-clipboard-plus"
                  style={{ fontSize: "3rem", color: "#ccc" }}></i>
                <h5 className="mt-3">No Variations Yet</h5>
                <p className="text-muted">
                  You haven't created any variations for this project yet.
                </p>
                <button
                  className="btn btn-primary mt-2"
                  onClick={handleCreateVariation}>
                  Create First Variation
                </button>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Description</th>
                      <th>Reason</th>
                      <th>Variation Cost</th>
                      <th>Date Created</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {variationsToShow.map((variation) => (
                      <tr
                        key={variation._id}
                        onClick={() => handleViewVariation(variation._id)}
                        style={{ cursor: "pointer" }}>
                        <td>
                          {variation.description
                            ? variation.description.length > 30
                              ? `${variation.description.substring(0, 30)}...`
                              : variation.description
                            : "No description"}
                        </td>
                        <td>
                          {variation.reason
                            ? variation.reason.length > 30
                              ? `${variation.reason.substring(0, 30)}...`
                              : variation.reason
                            : "No reason provided"}
                        </td>
                        <td>
                          <span
                            className={
                              variation.status === "approved" ? "text-success fw-bold" : ""
                            }>
                            {formatCurrency(variation.cost || 0)}
                          </span>
                        </td>
                        <td>{formatDate(variation.dateCreated)}</td>
                        <td>
                          <span
                            className={`badge ${getVariationStatusBadgeClass(variation.status)}`}>
                            {variation.status.charAt(0).toUpperCase() + variation.status.slice(1)}
                          </span>
                          {/* {variation.status === 'approved' && variation.signedAt && (
                            <div>
                              <small className="text-muted">
                                Signed: {formatDate(variation.signedAt)}
                              </small>
                            </div>
                          )} */}
                        </td>
                        <td className="d-flex gap-1">
                          {variation.status !== "approved" && (
                            <button
                              className="btn btn-sm btn-outline-primary"
                              onClick={(e) => handleEditVariation(variation._id, e)}
                              title="Edit variation">
                              <i className="bi bi-pencil"></i>
                            </button>
                          )}
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={(e) => confirmDeleteVariation(variation, e)}
                            title="Delete variation">
                            <i className="bi bi-trash"></i>
                          </button>
                          <PDFDownloadLink
                            document={
                              <VariationPDF
                                variation={variation}
                                project={currentProject}
                                profile={profileData}
                              />
                            }
                            fileName={`variation-${variation._id}.pdf`}
                            className="btn btn-sm btn-outline-success"
                            onClick={(e) => e.stopPropagation()}
                            title="Download PDF">
                            {({ loading }) =>
                              loading ? (
                                <i className="bi bi-download spin"></i>
                              ) : (
                                <i className="bi bi-download"></i>
                              )
                            }
                          </PDFDownloadLink>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div
          className="modal show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Delete Variation</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={closeDeleteModal}></button>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to delete this variation?</p>
                <p className="text-danger">This action cannot be undone.</p>
                {variationToDelete && (
                  <div className="bg-light p-3 rounded">
                    <strong>Variation:</strong> {variationToDelete.description}
                    <br />
                    <strong>Cost:</strong> {formatCurrency(variationToDelete.cost)}
                    <br />
                    <strong>Status:</strong>{" "}
                    <span
                      className={`badge ${getVariationStatusBadgeClass(variationToDelete.status)}`}>
                      {variationToDelete.status.charAt(0).toUpperCase() +
                        variationToDelete.status.slice(1)}
                    </span>
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={closeDeleteModal}
                  disabled={deleteLoading}>
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={handleDeleteVariation}
                  disabled={deleteLoading}>
                  {deleteLoading ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"></span>
                      Deleting...
                    </>
                  ) : (
                    "Delete Variation"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetails;
