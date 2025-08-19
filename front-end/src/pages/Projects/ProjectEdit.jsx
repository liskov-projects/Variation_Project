import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useProject } from "../../contexts/ProjectContext";
import { Project } from "../../models/ProjectModel"; // Import the Project model
import Header from "../../components/Header/index";
import "bootstrap/dist/css/bootstrap.min.css";

const ProjectEdit = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { fetchProjectById, currentProject, updateProject, loading, error } = useProject();
  const [projectData, setProjectData] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [architectpmSelected, setArchitectpmSelected] = useState('No');
  const [hasSurveyor, setHasSurveyor] = useState(true);

  

  // Fetch project data
  useEffect(() => {
    if (projectId) {
      fetchProjectById(projectId);
    }
  }, [projectId]);

  // Set initial form data when project is loaded
  useEffect(() => {
    if (currentProject) {
      // Create a Project instance from the backend data
      const projectInstance = new Project(currentProject);
      
      const formattedPrice = currentProject.contractPrice
        ? parseFloat(currentProject.contractPrice).toLocaleString()
        : "";

      // Set the project data
      setProjectData({
        ...projectInstance,
        contractPrice: formattedPrice,
      });

      // Set the architect selection state
      setArchitectpmSelected(projectInstance.architect.hasArchitect ? 'Yes' : 'No');
      setHasSurveyor(projectInstance.surveyor.hasSurveyor);
    }
  }, [currentProject]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProjectData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear validation error when field is updated
    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // Handle architect selection change
  const handleArchitectSelection = (value) => {
    setArchitectpmSelected(value);
    
    // Update the project data using the Project model method
    const newProject = new Project(projectData);
    newProject.updateArchitect(value === "Yes", newProject.architect.details);
    setProjectData(newProject);
  };

  // Handle architect details change
  const handleArchitectChange = (e) => {
    const { name, value } = e.target;
    
    // Extract the field name (remove 'architectPm' prefix)
    const fieldName = name.replace('architectPm', '').toLowerCase();
    const mappedFieldName = fieldName === 'companyname' ? 'companyName' : 
                            fieldName === 'contactname' ? 'contactName' : fieldName;

    const newProject = new Project(projectData);
    newProject.updateArchitect(architectpmSelected === "Yes", {
      ...newProject.architect.details,
      [mappedFieldName]: value
    });
    setProjectData(newProject);

    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // Handle surveyor details change
  const handleSurveyorChange = (e) => {
    const { name, value } = e.target;
    
    // Extract the field name (remove 'surveyor' prefix)
    const fieldName = name.replace('surveyor', '').toLowerCase();
    const mappedFieldName = fieldName === 'companyname' ? 'companyName' : 
                            fieldName === 'contactname' ? 'contactName' : fieldName;

    const newProject = new Project(projectData);
    newProject.updateSurveyor(hasSurveyor, {
      ...newProject.surveyor.details,
      [mappedFieldName]: value
    });
    setProjectData(newProject);

    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const errors = {};

    // Required fields
    const requiredFields = [
      "projectName",
      "propertyAddress",
      "clientName",
      "clientEmail",
      "clientPhone",
      "startDate",
      "contractPrice",
    ];

    requiredFields.forEach((field) => {
      if (!projectData[field]) {
        errors[field] = "This field is required";
      }
    });

    // Validate surveyor fields (always required)
    if (hasSurveyor) {
      if (!projectData.surveyor.details.companyName) {
        errors.surveyorCompanyName = "Surveyor company name is required";
      }
      if (!projectData.surveyor.details.contactName) {
        errors.surveyorContactName = "Surveyor contact name is required";
      }
      if (!projectData.surveyor.details.address) {
        errors.surveyorAddress = "Surveyor address is required";
      }
      if (!projectData.surveyor.details.phone) {
        errors.surveyorPhone = "Surveyor phone is required";
      }
      if (!projectData.surveyor.details.email) {
        errors.surveyorEmail = "Surveyor email is required";
      }
    }

    // Validate architect fields (only if architect is selected)
    if (architectpmSelected === "Yes") {
      if (!projectData.architect.details.companyName) {
        errors.architectPmCompanyName = "Architect company name is required";
      }
      if (!projectData.architect.details.contactName) {
        errors.architectPmContactName = "Architect contact name is required";
      }
      if (!projectData.architect.details.address) {
        errors.architectPmAddress = "Architect address is required";
      }
      if (!projectData.architect.details.phone) {
        errors.architectPmPhone = "Architect phone is required";
      }
      if (!projectData.architect.details.email) {
        errors.architectPmEmail = "Architect email is required";
      }
    }

    // Email validation
    if (projectData.clientEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(projectData.clientEmail)) {
      errors.clientEmail = "Please enter a valid email address";
    }

    // Date validation
    if (projectData.startDate && projectData.expectedEndDate) {
      const startDate = new Date(projectData.startDate);
      const endDate = new Date(projectData.expectedEndDate);

      if (endDate < startDate) {
        errors.expectedEndDate = "End date must be after start date";
      }
    }

    // Validate contract price
    if (
      projectData.contractPrice &&
      (isNaN(parseFloat(projectData.contractPrice)) || parseFloat(projectData.contractPrice) < 0)
    ) {
      errors.contractPrice = "Contract price must be a valid positive number";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Create a new Project instance to ensure all transformations are applied
    const projectInstance = new Project({
      ...projectData,
      contractPrice: parseFloat(String(projectData.contractPrice || "").replace(/,/g, "")),
    });

    // Use the toBackendFormat method to get the correctly structured data
    const backendData = projectInstance.toBackendFormat();

    const result = await updateProject(projectId, backendData);

    if (result.success) {
      setSuccess(true);

      // Show success message briefly then redirect
      setTimeout(() => {
        navigate(`/projects/${projectId}`);
      }, 1500);
    }
  };

  const handleCancel = () => {
    navigate(`/projects/${projectId}`);
  };

  const MAX_ALLOWED = 10000000; // e.g., 10 million

  const handleCurrencyChange = (e) => {
    const { name, value } = e.target;
    const rawValue = value.replace(/[^0-9.]/g, "");
    const numeric = parseFloat(rawValue);

    if (numeric > MAX_ALLOWED) return; // silently ignore or show error

    const [integer, decimal] = rawValue.split(".");
    const formattedInteger = parseInt(integer || "0").toLocaleString();

    const formatted =
      decimal !== undefined ? `${formattedInteger}.${decimal.slice(0, 2)}` : formattedInteger;

    setProjectData((prev) => ({
      ...prev,
      [name]: formatted,
    }));
  };

  // Format date for input fields (YYYY-MM-DD)
  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    return dateString.split("T")[0];
  };

  if (!projectData) {
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

  // Calculate contract price summary for display
  const totalVariationCost = projectData.variations
    ? projectData.variations.reduce((total, variation) => {
        if (variation.status === "approved") {
          const parsed = parseFloat(String(variation.cost || "0").replace(/,/g, ""));
          return total + (isNaN(parsed) ? 0 : parsed);
        }
        return total;
      }, 0)
    : 0;

  const basePrice = parseFloat(String(projectData.contractPrice || "").replace(/,/g, "")) || 0;
  const currentContractPrice = basePrice + totalVariationCost;

    const formatAustralianMobile = (input) => {
    // Remove all non-digit characters
    const digits = input.replace(/\D/g, "");

    // Format: 0412 345 678
    if (digits.length <= 4) return digits;
    if (digits.length <= 7) return `${digits.slice(0, 4)} ${digits.slice(4)}`;
    return `${digits.slice(0, 4)} ${digits.slice(4, 7)} ${digits.slice(7, 10)}`;
  };



  return (
    <div>
      <Header />
      <div className="container py-4">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="card shadow-sm">
              <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
                <h3 className="mb-0">Edit Project</h3>
                <button className="btn btn-sm btn-outline-light" onClick={handleCancel}>
                  Back to Project
                </button>
              </div>
              <div className="card-body">
                {error && <div className="alert alert-danger">{error}</div>}
                {success && (
                  <div className="alert alert-success">Project updated successfully!</div>
                )}

                {/* Current Contract Price Summary */}
                {projectData.variations && projectData.variations.length > 0 && (
                  <div className="alert alert-info mb-4">
                    <h5>Current Contract Summary</h5>
                    <div className="row">
                      <div className="col-md-6">
                        <strong>Original Contract Price:</strong>
                        <br />
                        <span className="text-primary fs-5">
                          ${(projectData.contractPrice || 0).toLocaleString()}
                        </span>
                      </div>
                      <div className="col-md-6">
                        <strong>Current Contract Price (with approved variations):</strong>
                        <br />
                        <span className="text-success fs-5">
                          ${currentContractPrice.toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <small className="text-muted">
                      Note: Changing the original contract price will not affect existing
                      variations.
                    </small>
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  {/* Project Details Section */}
                  <h4 className="mb-3 border-bottom pb-2">Project Details</h4>
                  <div className="mb-3">
                    <label className="form-label">Project Name *</label>
                    <input
                      type="text"
                      className={`form-control ${formErrors.projectName ? "is-invalid" : ""}`}
                      name="projectName"
                      value={projectData.projectName || ""}
                      onChange={handleChange}
                      required
                    />
                    {formErrors.projectName && (
                      <div className="invalid-feedback">{formErrors.projectName}</div>
                    )}
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Property Address *</label>
                    <input
                      type="text"
                      className={`form-control ${formErrors.propertyAddress ? "is-invalid" : ""}`}
                      name="propertyAddress"
                      value={projectData.propertyAddress || ""}
                      onChange={handleChange}
                      required
                    />
                    {formErrors.propertyAddress && (
                      <div className="invalid-feedback">{formErrors.propertyAddress}</div>
                    )}
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Project Description</label>
                    <textarea
                      className="form-control"
                      name="description"
                      value={projectData.description || ""}
                      onChange={handleChange}
                      rows="3"
                    />
                  </div>

                  {/* Contract Price Field */}
                  <div className="mb-3">
                    <label className="form-label">Original Contract Price *</label>
                    <div className="input-group">
                      <span className="input-group-text">$</span>
                      <input
                        type="text"
                        name="contractPrice"
                        className={`form-control ${formErrors.contractPrice ? "is-invalid" : ""}`}
                        value={projectData.contractPrice || ""}
                        onChange={handleCurrencyChange}
                      />
                      {formErrors.contractPrice && (
                        <div className="invalid-feedback">{formErrors.contractPrice}</div>
                      )}
                    </div>
                    <div className="form-text">
                      This is the base contract price. Variations will be added to this amount to
                      calculate the total.
                    </div>
                  </div>

                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label className="form-label">Start Date *</label>
                      <input
                        type="date"
                        className={`form-control ${formErrors.startDate ? "is-invalid" : ""}`}
                        name="startDate"
                        value={formatDateForInput(projectData.startDate) || ""}
                        onChange={handleChange}
                        required
                      />
                      {formErrors.startDate && (
                        <div className="invalid-feedback">{formErrors.startDate}</div>
                      )}
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Expected End Date</label>
                      <input
                        type="date"
                        className={`form-control ${formErrors.expectedEndDate ? "is-invalid" : ""}`}
                        name="expectedEndDate"
                        value={formatDateForInput(projectData.expectedEndDate) || ""}
                        onChange={handleChange}
                      />
                      {formErrors.expectedEndDate && (
                        <div className="invalid-feedback">{formErrors.expectedEndDate}</div>
                      )}
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Project Status</label>
                    <select
                      className="form-select"
                      name="status"
                      value={projectData.status || "active"}
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
                      className={`form-control ${formErrors.clientName ? "is-invalid" : ""}`}
                      name="clientName"
                      value={projectData.clientName || ""}
                      onChange={handleChange}
                      required
                    />
                    {formErrors.clientName && (
                      <div className="invalid-feedback">{formErrors.clientName}</div>
                    )}
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Client Email *</label>
                    <input
                      type="email"
                      className={`form-control ${formErrors.clientEmail ? "is-invalid" : ""}`}
                      name="clientEmail"
                      value={projectData.clientEmail || ""}
                      onChange={handleChange}
                      required
                    />
                    {formErrors.clientEmail && (
                      <div className="invalid-feedback">{formErrors.clientEmail}</div>
                    )}
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Client Phone *</label>
                  <input
                    type="text"
                    className={`form-control ${formErrors.clientPhone ? "is-invalid" : ""}`}
                    name="clientPhone"
                    value={formatAustralianMobile(projectData.clientPhone) || ""}
                    onChange={(e) =>
                      setProjectData((prev) => ({
                        ...prev,
                        clientPhone: formatAustralianMobile(e.target.value)
                      }))
                    }
                    placeholder="04XX XXX XXX"
                    required
                  />

                    {formErrors.clientPhone && (
                      <div className="invalid-feedback">{formErrors.clientPhone}</div>
                    )}
                  </div>


                  {/*NEW: Architect / Project Manager section */}
                  <h4 className="mb-3 mt-4 border-bottom pb-2">
                    Architect / Project Manager Information
                  </h4>
                  <div className="mb-3">
                    <label className="form-label">Company Name *</label>
                    <input
                      type="text"
                      className={`form-control ${
                        formErrors.architectPmCompanyName ? "is-invalid" : "" // FIXME: here and below clientName should be something else
                      }`}
                      name="architectPmCompanyName"
                      value={projectData.architectPmCompanyName || ""}
                      onChange={handleChange}
                    
                    />
                    {formErrors.architectPmCompanyName && (
                      <div className="invalid-feedback">
                        {formErrors.architectPmCompanyName}
                      </div>
                    )}
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Contact Name *</label>
                    <input
                      type="text"
                      className={`form-control ${
                        formErrors.architectPmContactName ? "is-invalid" : ""
                      }`}
                      name="architectPmContactName"
                      value={projectData.architectPmContactName || ""}
                      onChange={handleChange}
                    
                    />
                    {formErrors.architectPmContactName && (
                      <div className="invalid-feedback">
                        {formErrors.architectPmContactName}
                      </div>
                    )}
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Address *</label>
                    <input
                      type="text"
                      className={`form-control ${
                        formErrors.architectPmAddress ? "is-invalid" : ""
                      }`}
                      name="architectPmAddress"
                      value={projectData.architectPmAddress || ""}
                      onChange={handleChange}
                    
                    />
                    {formErrors.architectPmAddress && (
                      <div className="invalid-feedback">
                        {formErrors.architectPmAddress}
                      </div>
                    )}
                  </div>
                  <div className="mb-3">
                    <label className="form-label"> Phone *</label>
                    <input
                      type="text"
                      className={`form-control ${
                        formErrors.architectPmPhone ? "is-invalid" : ""
                      }`}
                      name="architectPmPhone"
                      value={formatAustralianMobile(projectData.architectPmPhone || "")}
                        onChange={(e) =>
                      setProjectData((prev) => ({
                        ...prev,
                        architectPmPhone: formatAustralianMobile(e.target.value)
                      }))
                    }
                    placeholder="04XX XXX XXX"
                    required
                    
                    />
                    {formErrors.architectPmPhone && (
                      <div className="invalid-feedback">
                        {formErrors.architectPmPhone}
                      </div>
                    )}
                  </div>

                  <div className="mb-3">
                    <label className="form-label"> Email *</label>
                    <input
                      type="email"
                      className={`form-control ${
                        formErrors.architectPmEmail ? "is-invalid" : ""
                      }`}
                      name="architectPmEmail"
                      value={projectData.architectPmEmail || ""}
                      onChange={handleChange}
                    
                    />
                    {formErrors.architectPmEmail && (
                      <div className="invalid-feedback">
                        {formErrors.architectPmEmail}
                      </div>
                    )}
                  </div>

                  {/*NEW: Surveyor section */}
                  <h4 className="mb-3 mt-4 border-bottom pb-2">
                    Surveyor Information
                  </h4>
                  {/* <div>
                    <label htmlFor="yes">
Yes
                    <input type="radio" value={projectData.hasSurveyor || "yes"} name="surveyorChoice"  id="yes" checked={hasSurveyor==="yes"} onChange={(e) => {setSurveyor(e.target.value)}}/>
                    </label>
                      <label htmlFor="no">
No
                    <input type="radio" value={projectData.hasSurveyor || "no"} name="surveyorChoice"  id="no" checked={hasSurveyor==="no"} onChange={(e) => {setSurveyor(e.target.value)}}/>
                    </label>
                  </div> */}

                  <div className="mb-3">
                    <label className="form-label">Company Name *</label>
                    <input
                      type="text"
                      className={`form-control ${
                        formErrors.surveyorCompanyName ? "is-invalid" : ""
                      }`}
                      name="surveyorCompanyName"
                      value={projectData.surveyorCompanyName || ""}
                      onChange={handleChange}
                      required
                    />
                    {formErrors.surveyorCompanyName && (
                      <div className="invalid-feedback">
                        {formErrors.surveyorCompanyName}
                      </div>
                    )}
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Contact Name *</label>
                    <input
                      type="text"
                      className={`form-control ${
                        formErrors.surveyorContactName ? "is-invalid" : ""
                      }`}
                      name="surveyorContactName"
                      value={projectData.surveyorContactName || ""}
                      onChange={handleChange}
                      required
                    />
                    {formErrors.surveyorContactName && (
                      <div className="invalid-feedback">
                        {formErrors.surveyorContactName}
                      </div>
                    )}
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Address *</label>
                    <input
                      type="text"
                      className={`form-control ${
                        formErrors.surveyorAddress ? "is-invalid" : ""
                      }`}
                      name="surveyorAddress"
                      value={projectData.surveyorAddress || ""}
                      onChange={handleChange}
                      required
                    />
                    {formErrors.surveyorAddress && (
                      <div className="invalid-feedback">
                        {formErrors.surveyorAddress}
                      </div>
                    )}
                  </div>
                  <div className="mb-3">
                    <label className="form-label"> Phone *</label>
                    <input
                      type="text"
                      className={`form-control ${
                        formErrors.surveyorPhone ? "is-invalid" : ""
                      }`}
                      name="surveyorPhone"
                      value={formatAustralianMobile(projectData.surveyorPhone || "")}
                      onChange={(e) =>
                      setProjectData((prev) => ({
                        ...prev,
                        surveyorPhone: formatAustralianMobile(e.target.value)
                      }))
                    }
                    placeholder="04XX XXX XXX"
                    required
                    />
                    {formErrors.surveyorPhone && (
                      <div className="invalid-feedback">
                        {formErrors.surveyorPhone}
                      </div>
                    )}
                  </div>

                      <div className="mb-3">
                        <label className="form-label">Email *</label>
                        <input
                          type="email"
                          className={`form-control ${
                            formErrors.surveyorEmail ? "is-invalid" : ""
                          }`}
                          name="surveyorEmail"
                          value={projectData.surveyor.details.email || ""}
                          onChange={handleSurveyorChange}
                          required
                        />
                        {formErrors.surveyorEmail && (
                          <div className="invalid-feedback">
                            {formErrors.surveyorEmail}
                          </div>
                        )}
                      </div>
                 
                  {/* Architect / Project Manager section */}
                  <h4 className="mb-3 mt-4 border-bottom pb-2">
                    Architect / Project Manager Information
                  </h4>

                  <div className="mb-3">
                    <label className="form-label fw-semibold">Do you have an Architect / Project Manager? *</label>
                    <div className="d-flex gap-4 mt-2">
                      <div className="form-check">
                        <input 
                          className="form-check-input" 
                          type="radio" 
                          name="architectChoice" 
                          id="architectYes" 
                          value="Yes"
                          checked={architectpmSelected === "Yes"} 
                          onChange={(e) => handleArchitectSelection(e.target.value)}
                        />
                        <label className="form-check-label" htmlFor="architectYes">
                          Yes
                        </label>
                      </div>
                      <div className="form-check">
                        <input 
                          className="form-check-input" 
                          type="radio" 
                          name="architectChoice" 
                          id="architectNo" 
                          value="No"
                          checked={architectpmSelected === "No"} 
                          onChange={(e) => handleArchitectSelection(e.target.value)}
                        />
                        <label className="form-check-label" htmlFor="architectNo">
                          No
                        </label>
                      </div>
                    </div>
                  </div>

                  {architectpmSelected === 'Yes' && (
                    <>
                      <div className="mb-3">
                        <label className="form-label">Company Name *</label>
                        <input
                          type="text"
                          className={`form-control ${
                            formErrors.architectPmCompanyName ? "is-invalid" : ""
                          }`}
                          name="architectPmCompanyName"
                          value={projectData.architect.details.companyName || ""}
                          onChange={handleArchitectChange}
                        />
                        {formErrors.architectPmCompanyName && (
                          <div className="invalid-feedback">
                            {formErrors.architectPmCompanyName}
                          </div>
                        )}
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Contact Name *</label>
                        <input
                          type="text"
                          className={`form-control ${
                            formErrors.architectPmContactName ? "is-invalid" : ""
                          }`}
                          name="architectPmContactName"
                          value={projectData.architect.details.contactName || ""}
                          onChange={handleArchitectChange}
                        />
                        {formErrors.architectPmContactName && (
                          <div className="invalid-feedback">
                            {formErrors.architectPmContactName}
                          </div>
                        )}
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Address *</label>
                        <input
                          type="text"
                          className={`form-control ${
                            formErrors.architectPmAddress ? "is-invalid" : ""
                          }`}
                          name="architectPmAddress"
                          value={projectData.architect.details.address || ""}
                          onChange={handleArchitectChange}
                        />
                        {formErrors.architectPmAddress && (
                          <div className="invalid-feedback">
                            {formErrors.architectPmAddress}
                          </div>
                        )}
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Phone *</label>
                        <input
                          type="text"
                          className={`form-control ${
                            formErrors.architectPmPhone ? "is-invalid" : ""
                          }`}
                          name="architectPmPhone"
                          value={projectData.architect.details.phone || ""}
                          onChange={handleArchitectChange}
                        />
                        {formErrors.architectPmPhone && (
                          <div className="invalid-feedback">
                            {formErrors.architectPmPhone}
                          </div>
                        )}
                      </div>

                      <div className="mb-3">
                        <label className="form-label">Email *</label>
                        <input
                          type="email"
                          className={`form-control ${
                            formErrors.architectPmEmail ? "is-invalid" : ""
                          }`}
                          name="architectPmEmail"
                          value={projectData.architect.details.email || ""}
                          onChange={handleArchitectChange}
                        />
                        {formErrors.architectPmEmail && (
                          <div className="invalid-feedback">
                            {formErrors.architectPmEmail}
                          </div>
                        )}
                      </div>
                    </>
                  )}

                  <div className="d-flex justify-content-between mt-4">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={handleCancel}
                      disabled={loading}
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                      {loading ? (
                        <>
                          <span
                            className="spinner-border spinner-border-sm me-2"
                            role="status"
                            aria-hidden="true"
                          ></span>
                          Saving...
                        </>
                      ) : (
                        "Save Changes"
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

export default ProjectEdit;