import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import { useProject } from '../../contexts/ProjectContext';
import Header from '../../components/Header/index';
import 'bootstrap/dist/css/bootstrap.min.css';

const ProjectCreate = ()=>{
    const navigate = useNavigate();
    const { userId } = useAuth();
    const { createProject, loading, error, createEmptyProject } = useProject();
    const [projectData, setProjectData] = useState(createEmptyProject());
    const [formErrors, setFormErrors] = useState({});

    useEffect(() => {
        const today = new Date().toISOString().split('T')[0];
        setProjectData(prev => ({
          ...prev,
          startDate: today
        }));
      }, []);

      const handleChange=(e)=>{
        const {name,value} = e.target;
        setProjectData(prev=>({
            ...prev,
            [name]:value})
        )

        if (formErrors[name]){
            setFormErrors((prev)=>({
                ...prev,
                [name]:""
            }))
        }
      };

      const validateForm=()=>{
        const errors = {};
    
        // Required fields
        const requiredFields = [
        'projectName', 
        'propertyAddress', 
        'clientName', 
        'clientEmail', 
        'clientPhone',
        'startDate'
        ];

        requiredFields.forEach(field=>{
            if (!projectData[field]){
                errors[field] = 'This field is required';
            }
        });
        if (projectData.clientEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(projectData.clientEmail)) {
            errors.clientEmail = 'Please enter a valid email address';
          }
        
        if (projectData.startDate && projectData.expectedEndDate) {
            const startDate = new Date(projectData.startDate);
            const endDate = new Date(projectData.expectedEndDate);
            
            if (endDate < startDate) {
                errors.expectedEndDate = 'End date must be after start date';
            }
        }
        setFormErrors(errors);
        // TODO: learn the return statement here
        return Object.keys(errors).length === 0;
      }

      const handleSubmit=async(e)=>{
        e.preventDefault();

        if(!validateForm()){
            return;
        }

        const projectWithUserId={
            ...projectData,
            userId
        }
        if (projectWithUserId._id === '') {
            delete projectWithUserId._id;
          }
        const result = await createProject(projectWithUserId);

        if (result.success){
            navigate(`/projects/${result.data._id}`)
        }
            
      }

      const handleCancel = () => {
        navigate('/projects');
      };

      return (
        <div>
        <Header />
        <div className="container py-4">
            <div className="row justify-content-center">
            <div className="col-lg-8">
                <div className="card shadow-sm">
                <div className="card-header bg-primary text-white">
                    <h3 className="mb-0">Create New Project</h3>
                </div>
                <div className="card-body">
                {error && <div className="alert alert-danger">{error}</div>}
                <form onSubmit={handleSubmit}>
                  {/* Project Details Section */}
                    <h4 className="mb-3 border-bottom pb-2">Project Details</h4>
                    <div className="mb-3">
                        <label className="form-label">Project Name *</label>
                        <input
                        type="text"
                        className={`form-control ${formErrors.projectName ? 'is-invalid' : ''}`}
                        name="projectName"
                        value={projectData.projectName || ''}
                        onChange={handleChange}
                        required
                        />
                    {formErrors.projectName && <div className="invalid-feedback">{formErrors.projectName}</div>}
                    </div>
                    
                    <div className="mb-3">
                        <label className="form-label">Property Address *</label>
                        <input
                        type="text"
                        className={`form-control ${formErrors.propertyAddress ? 'is-invalid' : ''}`}
                        name="propertyAddress"
                        value={projectData.propertyAddress || ''}
                        onChange={handleChange}
                        required
                        />
                        {formErrors.propertyAddress && <div className="invalid-feedback">{formErrors.propertyAddress}</div>}
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Project Description</label>
                        <textarea
                        className="form-control"
                        name="description"
                        value={projectData.description || ''}
                        onChange={handleChange}
                        rows="3"
                        />
                    </div>

                    <div className="row mb-3">
                    <div className="col-md-6">
                      <label className="form-label">Start Date *</label>
                      <input
                        type="date"
                        className={`form-control ${formErrors.startDate ? 'is-invalid' : ''}`}
                        name="startDate"
                        value={projectData.startDate || ''}
                        onChange={handleChange}
                        required
                      />
                      {formErrors.startDate && <div className="invalid-feedback">{formErrors.startDate}</div>}
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Expected End Date</label>
                      <input
                        type="date"
                        className={`form-control ${formErrors.expectedEndDate ? 'is-invalid' : ''}`}
                        name="expectedEndDate"
                        value={projectData.expectedEndDate || ''}
                        onChange={handleChange}
                      />
                      {formErrors.expectedEndDate && <div className="invalid-feedback">{formErrors.expectedEndDate}</div>}
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Project Status</label>
                    <select
                      className="form-select"
                      name="status"
                      value={projectData.status || 'active'}
                      onChange={handleChange}
                    >
                      <option value="active">Active</option>
                      <option value="on-hold">On Hold</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>

                  {/* Client Information Section */}
                  <h4 className="mb-3 mt-4 border-bottom pb-2">Client Information</h4>
                  <div className="mb-3">
                    <label className="form-label">Client Name *</label>
                    <input
                      type="text"
                      className={`form-control ${formErrors.clientName ? 'is-invalid' : ''}`}
                      name="clientName"
                      value={projectData.clientName || ''}
                      onChange={handleChange}
                      required
                    />
                    {formErrors.clientName && <div className="invalid-feedback">{formErrors.clientName}</div>}
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Client Email *</label>
                    <input
                      type="email"
                      className={`form-control ${formErrors.clientEmail ? 'is-invalid' : ''}`}
                      name="clientEmail"
                      value={projectData.clientEmail || ''}
                      onChange={handleChange}
                      required
                    />
                    {formErrors.clientEmail && <div className="invalid-feedback">{formErrors.clientEmail}</div>}
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Client Phone *</label>
                    <input
                      type="text"
                      className={`form-control ${formErrors.clientPhone ? 'is-invalid' : ''}`}
                      name="clientPhone"
                      value={projectData.clientPhone || ''}
                      onChange={handleChange}
                      required
                    />
                    {formErrors.clientPhone && <div className="invalid-feedback">{formErrors.clientPhone}</div>}
                  </div>
                
                  <div className="d-flex justify-content-between mt-4">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={handleCancel}
                      disabled={loading}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Creating...
                        </>
                      ) : 'Create Project'}
                    </button>
                  </div>
                </form>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
      )
}

export default ProjectCreate;