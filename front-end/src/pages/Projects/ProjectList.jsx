import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useProject } from "../../contexts/ProjectContext";
import Header from "../../components/Header/index";
import Footer from "../../components/Footer";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import filterSearch from "../../utils/filterSearch";

const ProjectList = () => {
  const navigate = useNavigate();
  const { projects, loading, error, fetchProjects, deleteProject } = useProject();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);
  const [query, setQuery] = useState("");
  useEffect(() => {
    if (!hasFetched) {
      fetchProjects().then(() => setHasFetched(true));
    }
  }, [fetchProjects, hasFetched]);

  const handleCreateProject = () => {
    navigate("/projects/new");
  };

  const handleViewProject = (projectId) => {
    navigate(`/projects/${projectId}`);
  };

  const handleEditProject = (projectId, e) => {
    e.stopPropagation();
    navigate(`/projects/${projectId}/edit`);
  };

  const confirmDeleteProject = (project, e) => {
    e.stopPropagation();
    setProjectToDelete(project);
    setShowDeleteModal(true);
  };

  const handleDeleteProject = async () => {
    if (!projectToDelete) return;

    setDeleteLoading(true);
    const result = await deleteProject(projectToDelete._id);
    setDeleteLoading(false);

    if (result.success) {
      setShowDeleteModal(false);
      setProjectToDelete(null);
    }
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setProjectToDelete(null);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Not set";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Get status badge style
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

  // if (loading) {
  //     return (
  //       <div>
  //         <Header />
  //         <div className="d-flex justify-content-center align-items-center vh-100">
  //           <div className="spinner-border text-primary" role="status">
  //             <span className="visually-hidden">Loading...</span>
  //           </div>
  //         </div>
  //         <Footer/>
  //       </div>
  //     );
  // }

  function handleChange(e) {
    setQuery(e.target.value);
  }

  const projectsToShow = filterSearch(projects, query);

  return (
    <div>
      <Header />
      <div className="container py-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>My Projects</h2>
          <button
            className="btn btn-primary"
            onClick={handleCreateProject}>
            <i className="bi bi-plus-lg me-2"></i>
            Create New Project
          </button>
        </div>
        <div className="col-md-6">
          <label className="form-label">
            <b>Search for</b>
          </label>
          <input
            placeholder="project name, address, description, client..."
            className="form-control mb-2"
            value={query}
            onChange={handleChange}
          />
        </div>
        {error && <div className="alert alert-danger">{error}</div>}

        {projects.length === 0 ? (
          <div className="card">
            <div className="card-body text-center py-5">
              <i
                className="bi bi-house"
                style={{ fontSize: "3rem", color: "#ccc" }}></i>
              <h5 className="mt-3">No Projects Yet</h5>
              <p className="text-muted">
                You haven't created any construction projects yet. Click the "Create New Project"
                button to get started.
              </p>
              <button
                className="btn btn-primary mt-2"
                onClick={handleCreateProject}>
                Create Your First Project
              </button>
            </div>
          </div>
        ) : (
          // Maybe a separate component?
          <div className="row">
            {projectsToShow.map((project) => (
              <div
                key={project._id}
                className="col-md-6 col-lg-4 mb-4">
                <div
                  className="card h-100 shadow-sm"
                  onClick={() => handleViewProject(project._id)}
                  style={{ cursor: "pointer" }}>
                  <div className="card-header d-flex justify-content-between align-items-center">
                    <h5
                      className="mb-0 text-truncate"
                      style={{ maxWidth: "200px" }}>
                      {project.projectName}
                    </h5>
                    {project.status && (
                      <span className={`badge ${getStatusBadgeClass(project.status)}`}>
                        {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                      </span>
                    )}
                  </div>
                  <div className="card-body">
                    <p className="mb-2">
                      <strong>Address:</strong> {project.propertyAddress}
                    </p>
                    <p className="mb-2">
                      <strong>Client:</strong> {project.clientName}
                    </p>
                    <p className="mb-2">
                      <strong>Start Date:</strong> {formatDate(project.startDate)}
                    </p>
                    <p className="mb-0">
                      <strong>Variations:</strong> {project.variations?.length || 0}
                    </p>
                  </div>
                  <div className="card-footer d-flex justify-content-end gap-2">
                    <button
                      className="btn btn-sm btn-outline-primary"
                      onClick={(e) => handleEditProject(project._id, e)}>
                      <i className="bi bi-pencil me-1"></i>
                      Edit
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={(e) => confirmDeleteProject(project, e)}>
                      <i className="bi bi-trash me-1"></i>
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
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
                <h5 className="modal-title">Delete Project</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={closeDeleteModal}></button>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to delete the project "{projectToDelete?.projectName}"?</p>
                <p className="text-danger">
                  This action cannot be undone and will delete all associated variations.
                </p>
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
                  onClick={handleDeleteProject}
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
                    "Delete Project"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <Footer/>
    </div>
  );
};

export default ProjectList;
