import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProject } from '../../contexts/ProjectContext';
import Header from '../../components/Header/index';
import 'bootstrap/dist/css/bootstrap.min.css';

const VariationEdit = () => {
    const { projectId, variationId } = useParams();
    const navigate = useNavigate();
    const { fetchProjectById, currentProject, updateVariation, loading, error } = useProject();
    const [variationData, setVariationData] = useState(null);
    const [formErrors, setFormErrors] = useState({});
    const [success, setSuccess] = useState(false);
    const [hasFetched, setHasFetched] = useState(false);

    // Fetch project data
    useEffect(() => {
        if (projectId && !hasFetched) {
            fetchProjectById(projectId)
            .then(() => setHasFetched(true));
        }
        }, [projectId, hasFetched]);
            
    useEffect(() => {
        if (currentProject && hasFetched) {
        findVariation();
        }
    }, [currentProject, hasFetched]);
    // Find the requested variation in the current project
  const findVariation = () => {
    if (currentProject && currentProject.variations) {
      const foundVariation = currentProject.variations.find(v => v._id === variationId);
      if (foundVariation) {
        setVariationData({...foundVariation});
      }
    }
  };

  // When current project changes, find the variation again
  useEffect(() => {
    findVariation();
  }, [currentProject, variationId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setVariationData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear validation error when field is updated
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  const validateForm = () => {
    const errors = {};
    
    // Required fields
    const requiredFields = [
      'description', 
      'reason', 
      'effect', 
      'permitVariation', 
      'delay',
      'cost',
      'newContractPrice',
      'dateCreated'
    ];
    
    requiredFields.forEach(field => {
      if (!variationData[field]) {
        errors[field] = 'This field is required';
      }
    });
    
    // Validate cost and newContractPrice as numbers
    if (isNaN(parseFloat(variationData.cost))) {
      errors.cost = 'Cost must be a valid number';
    }
    
    if (isNaN(parseFloat(variationData.newContractPrice))) {
      errors.newContractPrice = 'New contract price must be a valid number';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Make sure dates are properly formatted before sending to backend
const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    // TODO: contract price (display why the addition is happening)
    // Ensure numbers and dates are properly formatted
    const formattedData = {
      ...variationData,
      cost: parseFloat(variationData.cost),
      newContractPrice: parseFloat(variationData.newContractPrice),
      // Ensure dateCreated is a valid ISO string
      dateCreated: new Date(variationData.dateCreated).toISOString()
    };
    
    console.log("Submitting data:", formattedData); // Debug what's being sent
    
    const result = await updateVariation(projectId, variationId, formattedData);
    
    if (result.success) {
      setSuccess(true);
      
      // Show success message briefly then redirect
      setTimeout(() => {
        navigate(`/projects/${projectId}/variations/${variationId}`);
      }, 1500);
    }
  };

  const handleCancel = () => {
    navigate(`/projects/${projectId}/variations/${variationId}`);
  };

  // Format date for input fields (YYYY-MM-DD)
  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  if (!variationData) {
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
                <h3 className="mb-0">Edit Variation</h3>
                {currentProject && (
                  <span>Project: {currentProject.projectName}</span>
                )}
              </div>
              <div className="card-body">
                {error && <div className="alert alert-danger">{error}</div>}
                {success && <div className="alert alert-success">Variation updated successfully!</div>}
                
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label">Description *</label>
                    <textarea
                      className={`form-control ${formErrors.description ? 'is-invalid' : ''}`}
                      name="description"
                      value={variationData.description || ''}
                      onChange={handleChange}
                      rows="3"
                      required
                    ></textarea>
                    {formErrors.description && <div className="invalid-feedback">{formErrors.description}</div>}
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label">Reason for Variation *</label>
                    <textarea
                      className={`form-control ${formErrors.reason ? 'is-invalid' : ''}`}
                      name="reason"
                      value={variationData.reason || ''}
                      onChange={handleChange}
                      rows="2"
                      required
                    ></textarea>
                    {formErrors.reason && <div className="invalid-feedback">{formErrors.reason}</div>}
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label">Effect on Project *</label>
                    <textarea
                      className={`form-control ${formErrors.effect ? 'is-invalid' : ''}`}
                      name="effect"
                      value={variationData.effect || ''}
                      onChange={handleChange}
                      rows="2"
                      required
                    ></textarea>
                    {formErrors.effect && <div className="invalid-feedback">{formErrors.effect}</div>}
                  </div>
                  
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label className="form-label">Permit Variation Required? *</label>
                      <select
                        className={`form-select ${formErrors.permitVariation ? 'is-invalid' : ''}`}
                        name="permitVariation"
                        value={variationData.permitVariation || ''}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select...</option>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
                      {formErrors.permitVariation && <div className="invalid-feedback">{formErrors.permitVariation}</div>}
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Delay to Project Timeline? *</label>
                      <select
                        className={`form-select ${formErrors.delay ? 'is-invalid' : ''}`}
                        name="delay"
                        value={variationData.delay || ''}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select...</option>
                        <option value="None">None</option>
                        <option value="1-3 days">1-3 days</option>
                        <option value="4-7 days">4-7 days</option>
                        <option value="1-2 weeks">1-2 weeks</option>
                        <option value="2-4 weeks">2-4 weeks</option>
                        <option value="More than 4 weeks">More than 4 weeks</option>
                      </select>
                      {formErrors.delay && <div className="invalid-feedback">{formErrors.delay}</div>}
                    </div>
                  </div>
                  
                  <div className="row mb-3">
                    <div className="col-md-4">
                      <label className="form-label">Variation Cost *</label>
                      <div className="input-group">
                        <span className="input-group-text">$</span>
                        <input
                          type="number"
                          step="0.01"
                          className={`form-control ${formErrors.cost ? 'is-invalid' : ''}`}
                          name="cost"
                          value={variationData.cost || ''}
                          onChange={handleChange}
                          required
                        />
                        {formErrors.cost && <div className="invalid-feedback">{formErrors.cost}</div>}
                      </div>
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">New Contract Price *</label>
                      <div className="input-group">
                        <span className="input-group-text">$</span>
                        <input
                          type="number"
                          step="0.01"
                          className={`form-control ${formErrors.newContractPrice ? 'is-invalid' : ''}`}
                          name="newContractPrice"
                          value={variationData.newContractPrice || ''}
                          onChange={handleChange}
                          required
                        />
                        {formErrors.newContractPrice && <div className="invalid-feedback">{formErrors.newContractPrice}</div>}
                      </div>
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">Date Created *</label>
                      <input
                        type="date"
                        className={`form-control ${formErrors.dateCreated ? 'is-invalid' : ''}`}
                        name="dateCreated"
                        value={formatDateForInput(variationData.dateCreated)}
                        onChange={handleChange}
                        required
                      />
                      {formErrors.dateCreated && <div className="invalid-feedback">{formErrors.dateCreated}</div>}
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label">Status</label>
                    <select
                      className="form-select"
                      name="status"
                      value={variationData.status || 'draft'}
                      onChange={handleChange}
                    >
                      <option value="draft">Draft</option>
                      <option value="submitted">Submitted</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                    </select>
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
                          Saving...
                        </>
                      ) : 'Save Changes'}
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

export default VariationEdit;