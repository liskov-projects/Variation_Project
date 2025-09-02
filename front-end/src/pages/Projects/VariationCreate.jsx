import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useProject } from "../../contexts/ProjectContext";
import Header from "../../components/Header/index";
import "bootstrap/dist/css/bootstrap.min.css";
import { useLocation } from "react-router-dom";
import useFormLock from "../../hooks/useFormLock";
import { formatFormCurrency } from "../../utils/formatCurrency";

const VariationCreate = () => {
  const { projectId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { fetchProjectById, currentProject, addVariation, loading, error, createEmptyVariation } =
    useProject();
  const [variationData, setVariationData] = useState(createEmptyVariation());
  const [formErrors, setFormErrors] = useState({});
  const [formLocked, setFormLocked] = useState(false);

  const { lockForm } = useFormLock(formLocked, `/projects/${projectId}`);

  useEffect(() => {
    if (projectId) {
      fetchProjectById(projectId);
    }
  }, [projectId]);

  // Initialize variation with today's date
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setVariationData((prev) => ({
      ...prev,
      dateCreated: today,
      status: "draft",
    }));
  }, []);

  useEffect(() => {
    if (location.state?.prefillData) {
      const { cost, delay, permitVariation, description } = location.state.prefillData;

      const formattedCost = cost ? parseFloat(cost).toLocaleString() : "";

      setVariationData((prev) => ({
        ...prev,
        cost: formattedCost,
        delay: delay || "",
        permitVariation: permitVariation || "",
        // description: `Variation - $${formattedCost}`,
        description: description,
        reason: "Owner requested variation",
      }));
    }
  }, [location.state]);

  const calculateProjectedContractPrice = (variationCost) => {
    if (!currentProject) return 0;

    const cleanCost = parseFloat(String(variationCost || "").replace(/,/g, ""));

    // Fallback to 0 if cost is invalid
    if (isNaN(cleanCost)) return currentProject.currentContractPrice;

    return currentProject.currentContractPrice + cleanCost;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setVariationData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const errors = {};

    const requiredFields = [
      "description",
      "reason",
      "effect",
      "permitVariation",
      "delay",
      "cost",
      "dateCreated",
    ];

    requiredFields.forEach((field) => {
      if (!variationData[field]) {
        errors[field] = "This field is required";
      }
    });

    // Validate cost as a number
    if (isNaN(parseFloat(variationData.cost))) {
      errors.cost = "Cost must be a valid number";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCurrencyChange = (e) => {
    const { name, value } = e.target;

    const formatted = formatFormCurrency(value);

    setVariationData((prev) => ({
      ...prev,
      [name]: formatted,
    }));

    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Clean comma-formatted number safely
    const cleanedCost = parseFloat(String(variationData.cost).replace(/,/g, ""));

    const formattedData = {
      ...variationData,
      cost: cleanedCost,
    };

    delete formattedData.newContractPrice;

    const result = await addVariation(projectId, formattedData);

    if (result.success) {
      setFormLocked(true);
      lockForm(`/projects/${projectId}`);
      navigate(`/projects/${projectId}/variations/${result.data.variationId}/?displayModal=true`);
    }
  };

  const handleCancel = () => {
    navigate(`/projects/${projectId}`);
  };

  // Calculate the projected new contract price for display
  const projectedContractPrice = calculateProjectedContractPrice(variationData.cost);

  // NOTE: very similar (identical?) to VariatoinEdit.jsx
  return (
    <div>
      <Header />
      <div className="container py-4">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="card shadow-sm">
              <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
                <h3 className="mb-0">Add Variation</h3>
                {currentProject && <span>Project: {currentProject.projectName}</span>}
              </div>
              <div className="card-body">
                {error && <div className="alert alert-danger">{error}</div>}

                {/* {currentProject && (
                              <div className="alert alert-info mb-3">
                                <h5>Contract Price Summary</h5>
                                <div className="row">
                                  <div className="col-md-4">
                                    <strong>Original Contract Price:</strong><br/>
                                    <span className="text-primary">${currentProject.contractPrice?.toLocaleString() || 0}</span>
                                  </div>
                                  <div className="col-md-4">
                                    <strong>Current Contract Price:</strong><br/>
                                    <span className="text-success">${currentProject.currentContractPrice?.toLocaleString() || 0}</span>
                                  </div>
                                  <div className="col-md-4">
                                    <strong>Projected New Price:</strong><br/>
                                    <span className="text-warning">${projectedContractPrice.toLocaleString()}</span>
                                  </div>
                                </div>
                              </div>
                            )} */}

                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label">Description *</label>
                    <textarea
                      className={`form-control ${formErrors.description ? "is-invalid" : ""}`}
                      name="description"
                      value={variationData.description || ""}
                      onChange={handleChange}
                      rows="3"
                      required></textarea>
                    {formErrors.description && (
                      <div className="invalid-feedback">{formErrors.description}</div>
                    )}
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Reason for Variation *</label>
                    <textarea
                      className={`form-control ${formErrors.reason ? "is-invalid" : ""}`}
                      name="reason"
                      value={variationData.reason || ""}
                      onChange={handleChange}
                      rows="2"
                      required
                      placeholder="Enter reason for variation"></textarea>
                    {formErrors.reason && (
                      <div className="invalid-feedback">{formErrors.reason}</div>
                    )}
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Effect on Project *</label>
                    <textarea
                      className={`form-control ${formErrors.effect ? "is-invalid" : ""}`}
                      name="effect"
                      value={variationData.effect || ""}
                      onChange={handleChange}
                      rows="2"
                      required></textarea>
                    {formErrors.effect && (
                      <div className="invalid-feedback">{formErrors.effect}</div>
                    )}
                  </div>

                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label className="form-label">Permit Variation Required? *</label>
                      <select
                        className={`form-select ${formErrors.permitVariation ? "is-invalid" : ""}`}
                        name="permitVariation"
                        value={variationData.permitVariation || ""}
                        onChange={handleChange}
                        required>
                        <option value="">Select...</option>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
                      {formErrors.permitVariation && (
                        <div className="invalid-feedback">{formErrors.permitVariation}</div>
                      )}
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">
                        Delay to Project Timeline? (Enter the delay in days) *
                      </label>
                      {/* <select
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
                                  </select> */}
                      <input
                        type="number"
                        step="1"
                        className={`form-control ${formErrors.delay ? "is-invalid" : ""}`}
                        name="delay"
                        value={variationData.delay || ""}
                        onChange={handleChange}
                        required
                      />
                      {formErrors.delay && (
                        <div className="invalid-feedback">{formErrors.delay}</div>
                      )}
                    </div>
                  </div>

                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label className="form-label">Variation Cost *</label>
                      <div className="input-group">
                        <span className="input-group-text">$</span>
                        <input
                          type="text"
                          className={`form-control ${formErrors.cost ? "is-invalid" : ""}`}
                          name="cost"
                          value={variationData.cost || ""}
                          onChange={handleCurrencyChange}
                          onBlur={() => {
                            setVariationData((prev) => ({
                              ...prev,
                              cost: parseFloat(
                                String(prev.cost).replace(/,/g, "") || 0
                              ).toLocaleString(),
                            }));
                          }}
                          required
                        />

                        {formErrors.cost && (
                          <div className="invalid-feedback">{formErrors.cost}</div>
                        )}
                      </div>
                      <div className="form-text">
                        Enter the cost of this variation. The new contract price will be calculated
                        automatically.
                      </div>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Date Created *</label>
                      <input
                        type="date"
                        className={`form-control ${formErrors.dateCreated ? "is-invalid" : ""}`}
                        name="dateCreated"
                        value={variationData.dateCreated || ""}
                        onChange={handleChange}
                        required
                      />
                      {formErrors.dateCreated && (
                        <div className="invalid-feedback">{formErrors.dateCreated}</div>
                      )}
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Status</label>
                    <select
                      className="form-select"
                      name="status"
                      value={variationData.status || "draft"}
                      onChange={handleChange}>
                      <option value="draft">Draft</option>
                      <option value="submitted">Submitted</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>
                  {currentProject && (
                    <div className="alert alert-info mb-3">
                      <h5>Contract Price Summary</h5>
                      <div className="row">
                        <div className="col-md-4">
                          <strong>Original Contract Price:</strong>
                          <br />
                          <span className="text-primary">
                            ${currentProject.contractPrice?.toLocaleString() || 0}
                          </span>
                        </div>
                        <div className="col-md-4">
                          <strong>Current Contract Price:</strong>
                          <br />
                          <span className="text-success">
                            ${currentProject.currentContractPrice?.toLocaleString() || 0}
                          </span>
                        </div>
                        <div className="col-md-4">
                          <strong>Projected New Price:</strong>
                          <br />
                          <span className="text-warning">
                            ${projectedContractPrice.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="d-flex justify-content-between mt-4">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={handleCancel}
                      disabled={loading}>
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      style={{ color: "white" }}
                      disabled={loading}>
                      {loading ? (
                        <>
                          <span
                            className="spinner-border spinner-border-sm me-2"
                            role="status"
                            aria-hidden="true"></span>
                          Creating...
                        </>
                      ) : (
                        "Create Variation"
                      )}
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

export default VariationCreate;
