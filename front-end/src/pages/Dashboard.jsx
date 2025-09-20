import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useProfile } from "../contexts/ProfileContext";
import { useProject } from "../contexts/ProjectContext";
// import Header from '../components/Header';
import Header from "../components/Header/index";
import Footer from "../components/Footer";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

const Dashboard = () => {
  const navigate = useNavigate();
  const { isProfileComplete, profileData, loading } = useProfile();
  const { projects, loading: projectsLoading, fetchProjects } = useProject();
  // TODO: phone number validation

  // Redirect if profile is not complete
  useEffect(() => {
    if (!isProfileComplete && !loading) {
      navigate("/profile-setup");
    }
  }, [isProfileComplete, loading, navigate]);

  // useEffect(() => {
  //   if (isProfileComplete) {
  //     fetchProjects();
  //   }
  // }, []);

  console.log(profileData);

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
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <Header />
      <div className="container py-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>Dashboard</h2>
          <button
            className="btn btn-primary"
            onClick={() => navigate("/projects/new")}>
            <i className="bi bi-plus-lg me-2"></i>
            New Project
          </button>
        </div>

        {/* Welcome card */}
        <div className="card mb-4">
          <div className="card-body d-flex justify-content-between">
            <div>
              <h5 className="card-title">Welcome, {profileData.fullName}!</h5>
              <p className="card-text">
                This is your dashboard where you can manage all your variation projects. Create a new
                project or manage your existing ones.
              </p>
            </div>
            {profileData.logo !== "" && <img className="rounded bg-dark-subtle" src={profileData.logo} alt="Builder's Logo" width="150px" height="150px"/>}
          </div>
        </div>

        <div className="card mt-4 mb-4">
          <div className="card-header bg-light d-flex justify-content-between align-items-center">
            <h5 className="mb-0">Your Profile Summary</h5>
            <button
              className="btn btn-sm btn-outline-primary"
              onClick={() => navigate("/profile-edit")}>
              Edit Profile
            </button>
          </div>
          <div className="card-body">
            <div className="row mb-3">
              <div className="col-md-3 fw-bold">Builder Name:</div>
              <div className="col-md-9">{profileData.fullName}</div>
            </div>
            <div className="row mb-3">
              <div className="col-md-3 fw-bold">Email:</div>
              <div className="col-md-9">{profileData.email}</div>
            </div>
            <div className="row mb-3">
              <div className="col-md-3 fw-bold">Business Type:</div>
              <div className="col-md-9">
                {profileData.businessType}
              </div>
            </div>
            {profileData.businessType === "Partnership" && 
            <div className="row mb-3">
              <div className="col-md-3 fw-bold">Number Of Partners:</div>
              <div className="col-md-9">
                {profileData.partners.length}
              </div>
            </div>
            }

            <div className="row mb-3">
              <div className="col-md-3 fw-bold">Builder Reg #:</div>
              <div className="col-md-9">{profileData.brn}</div>
            </div>
          </div>
        </div>

        {/* Project List Placeholder */}
        <div className="card">
          <div className="card-header bg-light d-flex justify-content-between align-items-center">
            <h5 className="mb-0">Your Projects</h5>
            <button
              className="btn btn-sm btn-outline-primary"
              onClick={() => navigate("/projects")} // Add this to view all projects
            >
              View All
            </button>
          </div>
          <div className="card-body">
            {projectsLoading ? (
              <div className="text-center py-3">
                <div
                  className="spinner-border text-primary"
                  role="status">
                  <span className="visually-hidden">Loading projects...</span>
                </div>
              </div>
            ) : projects && projects.length > 0 ? (
              <div>
                {/* Show most recent 3 projects */}
                {projects.slice(0, 3).map((project) => (
                  <div
                    key={project._id}
                    className="card mb-2 shadow-sm"
                    onClick={() => navigate(`/projects/${project._id}`)}
                    style={{ cursor: "pointer", transition: "background-color 0.2s" }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f8f9fa")}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "")}>
                    <div className="card-body p-3">
                      <div className="d-flex justify-content-between align-items-center">
                        <h6 className="mb-0">{project.projectName}</h6>
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => navigate(`/projects/${project._id}`)}>
                          View
                        </button>
                      </div>
                      <small className="text-muted">
                        {project.propertyAddress} | Variations: {project.variations?.length || 0}
                      </small>
                    </div>
                  </div>
                ))}
                {projects.length > 3 && (
                  <div className="text-center mt-3">
                    <button
                      className="btn btn-outline-primary btn-sm"
                      onClick={() => navigate("/projects")}>
                      View All Projects
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-5">
                <i
                  className="bi bi-folder-plus"
                  style={{ fontSize: "3rem", color: "#ccc" }}></i>
                <h5 className="mt-3">No Projects Yet</h5>
                <p className="text-muted">
                  You haven't created any variation projects yet. Click the "New Variation Project"
                  button to get started.
                </p>
                <button
                  className="btn btn-primary mt-2"
                  onClick={() => navigate("/projects/new")} // Changed from '/new-project'
                >
                  Create Your First Project
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Future Implementation Note */}
        {/* <div className="alert alert-info mt-4">
          <i className="bi bi-info-circle me-2"></i>
          The Variation Project functionality will be implemented in the next phase. 
          For now, you can view and edit your builder profile.
        </div> */}

        {/* Quick Profile Summary */}
        
      </div>
      <Footer/>
    </div>
  );
};

export default Dashboard;
