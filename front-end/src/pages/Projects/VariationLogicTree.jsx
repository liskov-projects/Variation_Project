import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useProject } from "../../contexts/ProjectContext";
import Header from "../../components/Header/index";
import "bootstrap/dist/css/bootstrap.min.css";

const VariationLogicTree = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { fetchProjectById, currentProject, addVariation, loading } = useProject();
  console.log("Current project: ", currentProject);
  const [step, setStep] = useState("userType");
  const [userType, setUserType] = useState("");
  const [ownerAnswers, setOwnerAnswers] = useState({
    variationPrice: "",
    delayDays: "",
    permitVariation: "",
    variationType: "debit"
  });
  const [formErrors, setFormErrors] = useState({});
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    if (projectId) {
      fetchProjectById(projectId);
    }
  }, [projectId]);

  // Calculate 2% of global contract price
  const getTwoPercentThreshold = () => {
    if (!currentProject?.currentContractPrice) return 0;
    return currentProject.currentContractPrice * 0.02;
  };

  const handleUserTypeSelection = (type) => {
    setUserType(type);
    if (type === "builder") {
      // Direct route to variation create page
      navigate(`/projects/${projectId}/variations/new`);
    } else if (type === "owner") {
      setStep("ownerQuestions");
    }
  };

  const handleOwnerAnswerChange = (field, value) => {
    setOwnerAnswers((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear errors when user starts typing
    if (formErrors[field]) {
      setFormErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const validateOwnerAnswers = () => {
    const errors = {};
    if (!ownerAnswers.description || ownerAnswers.description.trim() === "") {
      errors.description = "Please enter a description for the variation";
    }
    if (!ownerAnswers.variationPrice || isNaN(parseFloat(ownerAnswers.variationPrice))) {
      errors.variationPrice = "Please enter a valid variation price";
    }

    if (!ownerAnswers.delayDays || isNaN(parseInt(ownerAnswers.delayDays))) {
      errors.delayDays = "Please enter a valid number of delay days";
    }

    if (!ownerAnswers.permitVariation) {
      errors.permitVariation = "Please select if permit variation is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleOwnerSubmit = async () => {
    if (!validateOwnerAnswers()) {
      return;
    }

    const variationPrice = parseFloat(ownerAnswers.variationPrice);
    const delayDays = parseInt(ownerAnswers.delayDays);
    const permitVariation = ownerAnswers.permitVariation === "yes";
    const twoPercentThreshold = getTwoPercentThreshold();
    const variationType = ownerAnswers.variationType;

    // Check if any condition requires full variation process
    const needsFullProcess =
      variationPrice > twoPercentThreshold || delayDays > 0 || permitVariation;

    if (needsFullProcess) {
      // Route to existing VariationCreate page with pre-filled data
      navigate(`/projects/${projectId}/variations/new`, {
        state: {
          prefillData: {
            cost: variationPrice,
            delay: delayDays,
            permitVariation: permitVariation ? "Yes" : "No",
            variationType: variationType
          },
        },
      });
    } else {
      // Auto-create approved variation
      await createSimpleVariation(variationPrice, delayDays);
    }
  };

  const createSimpleVariation = async (variationPrice, delayDays) => {
    setIsCreating(true);

    const today = new Date().toISOString().split("T")[0];

    const variationData = {
      description: ownerAnswers.description,
      reason: "Minor variation requested by owner",
      effect: delayDays === 0 ? "No impact on project timeline" : `${delayDays} day delay`,
      permitVariation: "No",
      delay: delayDays,
      cost: variationPrice,
      dateCreated: today,
      status: "approved", // Auto-approved for simple variations
    };

    const result = await addVariation(projectId, variationData);

    setIsCreating(false);

    if (result.success) {
      navigate(`/projects/${projectId}`, {
        state: { message: "Simple variation created and auto-approved successfully!" },
      });
    }
  };

  const handleCancel = () => {
    navigate(`/projects/${projectId}`);
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

  return (
    <div>
      <Header />
      <div className="container py-4">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="card shadow-sm">
              <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
                <h3 className="mb-0">Create Variation</h3>
                {currentProject && <span>Project: {currentProject.projectName}</span>}
              </div>
              <div className="card-body">
                {step === "userType" && (
                  <div>
                    <h5 className="mb-4">Who is creating this variation?</h5>
                    <div className="d-grid gap-3">
                      <button
                        className="btn btn-outline-primary btn-lg d-flex align-items-center justify-content-center"
                        onClick={() => handleUserTypeSelection("builder")}
                        style={{ minHeight: "80px" }}>
                        <div>
                          <i className="bi bi-hammer fs-3 d-block mb-2"></i>
                          <strong>Builder</strong>
                          <div className="small text-muted">Construction company or contractor</div>
                        </div>
                      </button>

                      <button
                        className="btn btn-outline-success btn-lg d-flex align-items-center justify-content-center"
                        onClick={() => handleUserTypeSelection("owner")}
                        style={{ minHeight: "80px" }}>
                        <div>
                          <i className="bi bi-person-check fs-3 d-block mb-2"></i>
                          <strong>Owner</strong>
                          <div className="small text-muted">Property owner or client</div>
                        </div>
                      </button>
                    </div>
                  </div>
                )}

                {step === "ownerQuestions" && (
                  <div>
                    <div className="d-flex align-items-center mb-4">
                      <button
                        className="btn btn-sm btn-outline-secondary me-3"
                        onClick={() => setStep("userType")}>
                        <i className="bi bi-arrow-left"></i>
                      </button>
                      <h5 className="mb-0">Variation Details</h5>
                    </div>

                    {currentProject && (
                      <div className="alert alert-info mb-4">
                        <small>
                          <strong>Current Contract Price:</strong> $
                          {currentProject.currentContractPrice?.toLocaleString() || 0}
                          <br />
                          <strong>2% Threshold:</strong> $
                          {getTwoPercentThreshold().toLocaleString()}
                        </small>
                      </div>
                    )}
                    {/* Description Field */}
                    <div className="mb-3">
                      <label className="form-label">Variation Description *</label>
                      <textarea
                        className={`form-control ${formErrors.description ? "is-invalid" : ""}`}
                        value={ownerAnswers.description}
                        onChange={(e) => handleOwnerAnswerChange("description", e.target.value)}
                        placeholder="Enter a brief description of the variation"
                        rows="3"></textarea>
                      {formErrors.description && (
                        <div className="invalid-feedback">{formErrors.description}</div>
                      )}
                    </div>
                    <div className="mb-3">
                      {/* Inconsistent naming for Variation Cost/Value across app */}
                      <label className="form-label">Variation Price *</label>
                      <div className="input-group mb-2 align-items-center">
                        <label
                          htmlFor="type"
                          className="col">
                          Type:
                        </label>
                        <select
                          className="form-select col"
                          name="type"
                          id="type"
                          onChange={(e) => {
                            setOwnerAnswers((prev) => ({
                              ...prev,
                              variationType: e.target.value,
                            }));
                          }}>
                          <option
                            selected
                            value="debit">
                            debit
                          </option>
                          <option value="credit">credit</option>
                        </select>
                      </div>
                      <div className="input-group">
                        <span className="input-group-text">
                          {ownerAnswers.variationType === "credit" && <span>-</span>}$
                        </span>
                        <input
                          type="number"
                          step="0.01"
                          className={`form-control ${formErrors.variationPrice ? "is-invalid" : ""}`}
                          value={ownerAnswers.variationPrice}
                          onChange={(e) =>
                            handleOwnerAnswerChange("variationPrice", e.target.value)
                          }
                          placeholder="Enter variation cost"
                        />
                        {formErrors.variationPrice && (
                          <div className="invalid-feedback">{formErrors.variationPrice}</div>
                        )}
                      </div>
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Number of Delay Days *</label>
                      <input
                        type="number"
                        min="0"
                        className={`form-control ${formErrors.delayDays ? "is-invalid" : ""}`}
                        value={ownerAnswers.delayDays}
                        onChange={(e) => handleOwnerAnswerChange("delayDays", e.target.value)}
                        placeholder="Enter delay in days (0 for no delay)"
                      />
                      {formErrors.delayDays && (
                        <div className="invalid-feedback">{formErrors.delayDays}</div>
                      )}
                    </div>

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
                            checked={ownerAnswers.permitVariation === "yes"}
                            onChange={(e) =>
                              handleOwnerAnswerChange("permitVariation", e.target.value)
                            }
                          />
                          <label
                            className="form-check-label"
                            htmlFor="permitYes">
                            Yes
                          </label>
                        </div>
                        <div className="form-check form-check-inline">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="permitVariation"
                            id="permitNo"
                            value="no"
                            checked={ownerAnswers.permitVariation === "no"}
                            onChange={(e) =>
                              handleOwnerAnswerChange("permitVariation", e.target.value)
                            }
                          />
                          <label
                            className="form-check-label"
                            htmlFor="permitNo">
                            No
                          </label>
                        </div>
                      </div>
                      {formErrors.permitVariation && (
                        <div className="text-danger small mt-1">{formErrors.permitVariation}</div>
                      )}
                    </div>

                    {ownerAnswers.variationPrice &&
                      ownerAnswers.delayDays !== "" &&
                      ownerAnswers.permitVariation && (
                        <div className="alert alert-light border mb-4">
                          <h6>Preview:</h6>
                          {(() => {
                            const variationPrice = parseFloat(ownerAnswers.variationPrice) || 0;
                            const delayDays = parseInt(ownerAnswers.delayDays) || 0;
                            const permitVariation = ownerAnswers.permitVariation === "yes";
                            const twoPercentThreshold = getTwoPercentThreshold();

                            const needsFullProcess =
                              variationPrice > twoPercentThreshold ||
                              delayDays > 0 ||
                              permitVariation;

                            if (needsFullProcess) {
                              return (
                                <div className="text-warning">
                                  <i className="bi bi-exclamation-triangle me-2"></i>
                                  This variation requires detailed documentation and approval
                                  process.
                                </div>
                              );
                            } else {
                              return (
                                <div className="text-success">
                                  <i className="bi bi-check-circle me-2"></i>
                                  This variation qualifies for automatic approval!
                                </div>
                              );
                            }
                          })()}
                        </div>
                      )}

                    <div className="d-flex justify-content-between">
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={handleCancel}
                        disabled={isCreating}>
                        Cancel
                      </button>
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={handleOwnerSubmit}
                        disabled={isCreating}>
                        {isCreating ? (
                          <>
                            <span
                              className="spinner-border spinner-border-sm me-2"
                              role="status"
                              aria-hidden="true"></span>
                            Creating...
                          </>
                        ) : (
                          "Continue"
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VariationLogicTree;
