import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useProject } from '../../contexts/ProjectContext';
import Header from '../../components/Header/index';

const OwnerVariationForm = () => {
  const { projectId } = useParams();
  const { currentProject, addVariation } = useProject();
  const navigate = useNavigate();

  const [ownerAnswers, setOwnerAnswers] = useState({
    variationPrice: '',
    delayDays: '',
    permitVariation: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [isCreating, setIsCreating] = useState(false);

  const handleOwnerAnswerChange = (field, value) => {
    setOwnerAnswers(prev => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateOwnerAnswers = () => {
    const errors = {};
    if (!ownerAnswers.variationPrice || isNaN(parseFloat(ownerAnswers.variationPrice))) {
      errors.variationPrice = 'Please enter a valid variation price';
    }
    if (!ownerAnswers.delayDays || isNaN(parseInt(ownerAnswers.delayDays))) {
      errors.delayDays = 'Please enter a valid number of delay days';
    }
    if (!ownerAnswers.permitVariation) {
      errors.permitVariation = 'Please select if permit variation is required';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const getTwoPercentThreshold = () => {
    if (!currentProject?.currentContractPrice) return 0;
    return currentProject.currentContractPrice * 0.02;
  };

  const handleOwnerSubmit = async () => {
    if (!validateOwnerAnswers()) return;

    const variationPrice = parseFloat(ownerAnswers.variationPrice);
    const delayDays = parseInt(ownerAnswers.delayDays);
    const permitVariation = ownerAnswers.permitVariation === 'yes';
    const threshold = getTwoPercentThreshold();

    const needsFullProcess = variationPrice > threshold || delayDays > 0 || permitVariation;

    if (needsFullProcess) {
      navigate(`/projects/${projectId}/variations/owner/new/2`, {
        state: {
          prefillData: {
            cost: variationPrice,
            delay: delayDays,
            permitVariation: permitVariation ? 'Yes' : 'No'
          }
        }
      });
    } else {
      await createSimpleVariation(variationPrice, delayDays);
    }
  };

  const createSimpleVariation = async (variationPrice, delayDays) => {
    setIsCreating(true);
    const today = new Date().toISOString().split('T')[0];
    const variationData = {
      description: `Owner variation - $${variationPrice.toFixed(2)}`,
      reason: 'Minor variation requested by owner',
      effect: delayDays === 0 ? 'No impact on project timeline' : `${delayDays} day delay`,
      permitVariation: 'No',
      delay: delayDays,
      cost: variationPrice,
      dateCreated: today,
      status: 'approved'
    };

    const result = await addVariation(projectId, variationData);
    setIsCreating(false);
    if (result.success) {
      navigate(`/projects/${projectId}`, {
        state: { message: 'Simple variation created and auto-approved successfully!' }
      });
    }
  };

  return (
    <>
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
                <div className="d-flex align-items-center mb-4">
                  <button className="btn btn-sm btn-outline-secondary me-3" onClick={() => navigate(-1)}>
                    <i className="bi bi-arrow-left"></i>
                  </button>
                  <h5 className="mb-0">Variation Details</h5>
                </div>

                {currentProject && (
                  <div className="alert alert-info mb-4">
                    <small>
                      <strong>Current Contract Price:</strong> ${currentProject.currentContractPrice?.toLocaleString() || 0}<br />
                      <strong>2% Threshold:</strong> ${getTwoPercentThreshold().toLocaleString()}
                    </small>
                  </div>
                )}

                {/* Variation Price */}
                <div className="mb-3">
                  <label className="form-label">Variation Price *</label>
                  <div className="input-group">
                    <span className="input-group-text">$</span>
                    <input
                      type="number"
                      step="0.01"
                      className={`form-control ${formErrors.variationPrice ? 'is-invalid' : ''}`}
                      value={ownerAnswers.variationPrice}
                      onChange={(e) => handleOwnerAnswerChange('variationPrice', e.target.value)}
                      placeholder="Enter variation cost"
                    />
                    {formErrors.variationPrice && (
                      <div className="invalid-feedback">{formErrors.variationPrice}</div>
                    )}
                  </div>
                </div>

                {/* Delay Days */}
                <div className="mb-3">
                  <label className="form-label">Number of Delay Days *</label>
                  <input
                    type="number"
                    min="0"
                    className={`form-control ${formErrors.delayDays ? 'is-invalid' : ''}`}
                    value={ownerAnswers.delayDays}
                    onChange={(e) => handleOwnerAnswerChange('delayDays', e.target.value)}
                    placeholder="Enter delay in days (0 for no delay)"
                  />
                  {formErrors.delayDays && (
                    <div className="invalid-feedback">{formErrors.delayDays}</div>
                  )}
                </div>

                {/* Permit Required */}
                <div className="mb-4">
                  <label className="form-label">Permit Variation Required? *</label>
                  <div className="mt-2">
                    <div className="form-check form-check-inline">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="permitVariation"
                        id="permitYes"
                        value="yes"
                        checked={ownerAnswers.permitVariation === 'yes'}
                        onChange={(e) => handleOwnerAnswerChange('permitVariation', e.target.value)}
                      />
                      <label className="form-check-label" htmlFor="permitYes">Yes</label>
                    </div>
                    <div className="form-check form-check-inline">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="permitVariation"
                        id="permitNo"
                        value="no"
                        checked={ownerAnswers.permitVariation === 'no'}
                        onChange={(e) => handleOwnerAnswerChange('permitVariation', e.target.value)}
                      />
                      <label className="form-check-label" htmlFor="permitNo">No</label>
                    </div>
                  </div>
                  {formErrors.permitVariation && (
                    <div className="text-danger small mt-1">{formErrors.permitVariation}</div>
                  )}
                </div>

                {/* Preview */}
                {ownerAnswers.variationPrice && ownerAnswers.delayDays !== '' && ownerAnswers.permitVariation && (
                  <div className="alert alert-light border mb-4">
                    <h6>Preview:</h6>
                    {(() => {
                      const variationPrice = parseFloat(ownerAnswers.variationPrice) || 0;
                      const delayDays = parseInt(ownerAnswers.delayDays) || 0;
                      const permitVariation = ownerAnswers.permitVariation === 'yes';
                      const threshold = getTwoPercentThreshold();
                      const needsFullProcess = variationPrice > threshold || delayDays > 0 || permitVariation;

                      return needsFullProcess ? (
                        <div className="text-warning">
                          <i className="bi bi-exclamation-triangle me-2"></i>
                          This variation requires detailed documentation and approval process.
                        </div>
                      ) : (
                        <div className="text-success">
                          <i className="bi bi-check-circle me-2"></i>
                          This variation qualifies for automatic approval!
                        </div>
                      );
                    })()}
                  </div>
                )}

                <div className="d-flex justify-content-between">
                  <button className="btn btn-secondary" onClick={() => navigate(-1)} disabled={isCreating}>
                    Cancel
                  </button>
                  <button className="btn btn-primary" onClick={handleOwnerSubmit} disabled={isCreating}>
                    {isCreating ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Creating...
                      </>
                    ) : 'Continue'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OwnerVariationForm;
