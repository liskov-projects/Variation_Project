import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProject } from '../../contexts/ProjectContext';
import Header from '../../components/Header/index';
import 'bootstrap/dist/css/bootstrap.min.css';

const VariationLogicTree = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { fetchProjectById, currentProject, loading } = useProject();

  const [userType, setUserType] = useState('');

  useEffect(() => {
    if (projectId) {
      fetchProjectById(projectId);
    }
  }, [projectId]);

  const handleUserTypeSelection = (type) => {
    setUserType(type);
    if (type === 'builder') {
      navigate(`/projects/${projectId}/variations/builder/new`);
    } else if (type === 'owner') {
      navigate(`/projects/${projectId}/variations/owner/new/1`);
    }
  };

  if (loading && !currentProject) {
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
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="card shadow-sm">
              <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
                <h3 className="mb-0">Create Variation</h3>
                {currentProject && (
                  <span>Project: {currentProject.projectName}</span>
                )}
              </div>
              <div className="card-body">
                <h5 className="mb-4">Who is creating this variation?</h5>
                <div className="d-grid gap-3">
                  <button
                    className="btn btn-outline-primary btn-lg d-flex align-items-center justify-content-center"
                    onClick={() => handleUserTypeSelection('builder')}
                    style={{ minHeight: '80px' }}
                  >
                    <div>
                      <i className="bi bi-hammer fs-3 d-block mb-2"></i>
                      <strong>Builder</strong>
                      <div className="small text-muted">Construction company or contractor</div>
                    </div>
                  </button>

                  <button
                    className="btn btn-outline-success btn-lg d-flex align-items-center justify-content-center"
                    onClick={() => handleUserTypeSelection('owner')}
                    style={{ minHeight: '80px' }}
                  >
                    <div>
                      <i className="bi bi-person-check fs-3 d-block mb-2"></i>
                      <strong>Owner</strong>
                      <div className="small text-muted">Property owner or client</div>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VariationLogicTree;
