import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfile } from '../contexts/ProfileContext';
// import Header from '../components/Header';
import Header from '../components/Header/index';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const { isProfileComplete, profileData, loading } = useProfile();

  // TODO: phone number validation

  // Redirect if profile is not complete
  useEffect(() => {
    if (!isProfileComplete && !loading) {
      navigate('/profile-setup');
    }
  }, [isProfileComplete, loading, navigate]);

  if (loading) {
    return (
      <div>
        <Header />
        <div className="d-flex justify-content-center align-items-center vh-100">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
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
            onClick={() => navigate('/new-project')}
          >
            <i className="bi bi-plus-lg me-2"></i>
            New Variation Project
          </button>
        </div>

        {/* Welcome card */}
        <div className="card mb-4">
          <div className="card-body">
            <h5 className="card-title">Welcome, {profileData.fullName}!</h5>
            <p className="card-text">
              This is your dashboard where you can manage all your variation projects. 
              Create a new project or manage your existing ones.
            </p>
          </div>
        </div>

        {/* Project List Placeholder */}
        <div className="card">
          <div className="card-header bg-light">
            <h5 className="mb-0">Your Projects</h5>
          </div>
          <div className="card-body">
            <div className="text-center py-5">
              <i className="bi bi-folder-plus" style={{ fontSize: '3rem', color: '#ccc' }}></i>
              <h5 className="mt-3">No Projects Yet</h5>
              <p className="text-muted">
                You haven't created any variation projects yet. 
                Click the "New Variation Project" button to get started.
              </p>
              <button 
                className="btn btn-primary mt-2"
                onClick={() => navigate('/new-project')}
              >
                Create Your First Project
              </button>
            </div>
          </div>
        </div>

        {/* Future Implementation Note */}
        <div className="alert alert-info mt-4">
          <i className="bi bi-info-circle me-2"></i>
          The Variation Project functionality will be implemented in the next phase. 
          For now, you can view and edit your builder profile.
        </div>

        {/* Quick Profile Summary */}
        <div className="card mt-4">
          <div className="card-header bg-light d-flex justify-content-between align-items-center">
            <h5 className="mb-0">Your Profile Summary</h5>
            <button 
              className="btn btn-sm btn-outline-primary"
              onClick={() => navigate('/profile-edit')}
            >
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
              <div className="col-md-3 fw-bold">Company:</div>
              <div className="col-md-9">
                {profileData.company === 'Yes'
                  ? `Yes (${profileData.companyName})`
                  : 'No'}
              </div>
            </div>
            <div className="row mb-3">
              <div className="col-md-3 fw-bold">Partnership:</div>
              <div className="col-md-9">
                {profileData.partnership === 'Yes'
                  ? `Yes (${profileData.numberOfPartners} partners)`
                  : 'No'}
              </div>
            </div>
            <div className="row mb-3">
              <div className="col-md-3 fw-bold">Builder Reg #:</div>
              <div className="col-md-9">{profileData.brn}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;