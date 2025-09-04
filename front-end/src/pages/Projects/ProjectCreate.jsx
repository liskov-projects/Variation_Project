import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import { useProject } from "../../contexts/ProjectContext";
import { Project } from "../../models/ProjectModel"; // Import the Project model
import Header from "../../components/Header/index";
import "bootstrap/dist/css/bootstrap.min.css";
import useFormLock from "../../hooks/useFormLock";
import { isValidEmail } from "../../utils/isValidEmail";
import { formatFormCurrency } from "../../utils/formatCurrency";

const ProjectCreate = () => {
  const navigate = useNavigate();
  const { userId } = useAuth();
  const { createProject, loading, error } = useProject();
  const [projectData, setProjectData] = useState(new Project()); // Use Project model
  const [formErrors, setFormErrors] = useState({});
  const [architectpmSelected, setArchitectpmSelected] = useState("No");
  const [formLocked, setFormLocked] = useState(false);

  const { lockForm } = useFormLock(formLocked, "/projects");

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setProjectData((prev) => ({
      ...prev,
      startDate: today,
    }));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProjectData((prev) => ({
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
    const fieldName = name.replace("architectPm", "").toLowerCase();
    const mappedFieldName =
      fieldName === "companyname"
        ? "companyName"
        : fieldName === "contactname"
          ? "contactName"
          : fieldName;

    const newProject = new Project(projectData);
    newProject.updateArchitect(architectpmSelected === "Yes", {
      ...newProject.architect.details,
      [mappedFieldName]: value,
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
    const fieldName = name.replace("surveyor", "").toLowerCase();
    const mappedFieldName =
      fieldName === "companyname"
        ? "companyName"
        : fieldName === "contactname"
          ? "contactName"
          : fieldName;

    const newProject = new Project(projectData);
    newProject.updateSurveyor(true, {
      // Surveyor is always true by default
      ...newProject.surveyor.details,
      [mappedFieldName]: value,
    });
    setProjectData(newProject);

    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // Very similar (the same actually) with ProjectEdit.jsx
  const validateForm = () => {
    const errors = {};

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
    } else {
      const isValid = isValidEmail(projectData.surveyor.details.email);
      if (!isValid) errors.surveyorEmail = "Please enter a valid email address";
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
      } else {
        const isValid = isValidEmail(projectData.architect.details.email);
        if (!isValid) errors.architectPmEmail = "Please enter a valid email address";
      }
    }

    if (projectData.clientEmail) {
      const isValid = isValidEmail(projectData.clientEmail);
      if (!isValid) errors.clientEmail = "Please enter a valid email address";
    }

    if (projectData.startDate && projectData.expectedEndDate) {
      const startDate = new Date(projectData.startDate);
      const endDate = new Date(projectData.expectedEndDate);

      if (endDate < startDate) {
        errors.expectedEndDate = "End date must be after start date";
      }
    }

    if (
      projectData.contractPrice &&
      (isNaN(parseFloat(projectData.contractPrice)) || parseFloat(projectData.contractPrice) < 0)
    ) {
      errors.contractPrice = "Contract price must be a valid positive number";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCurrencyChange = (e) => {
    const { name, value } = e.target;

    const formatted = formatFormCurrency(value);

    setProjectData((prev) => ({
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

    // Create a new Project instance to ensure all transformations are applied
    const projectInstance = new Project({
      ...projectData,
      userId,
      contractPrice: parseFloat(projectData.contractPrice.toString().replace(/,/g, "")),
    });

    // Use the toBackendFormat method to get the correctly structured data
    const backendData = projectInstance.toBackendFormat();

    // Remove _id if it's empty
    if (backendData._id === "") {
      delete backendData._id;
    }

    const result = await createProject(backendData);

    if (result.success) {
      setFormLocked(true);
      lockForm(`/projects/${result.data._id}`);
    }
  };

  const handleCancel = () => {
    navigate("/projects");
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

                  <div className="mb-3">
                    <label className="form-label">Contract Price *</label>
                    <div className="input-group">
                      <span className="input-group-text">$</span>
                      <input
                        type="text"
                        className={`form-control ${formErrors.contractPrice ? "is-invalid" : ""}`}
                        name="contractPrice"
                        value={projectData.contractPrice || ""}
                        onChange={handleCurrencyChange}
                        required
                      />

                      {formErrors.contractPrice && (
                        <div className="invalid-feedback">{formErrors.contractPrice}</div>
                      )}
                    </div>
                    <div className="form-text">
                      This is the base contract price before any variations.
                    </div>
                  </div>

                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label className="form-label">Start Date *</label>
                      <input
                        type="date"
                        className={`form-control ${formErrors.startDate ? "is-invalid" : ""}`}
                        name="startDate"
                        value={projectData.startDate || ""}
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
                        value={projectData.expectedEndDate || ""}
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
                      onChange={handleChange}>
                      <option value="active">Active</option>
                      <option value="on-hold">On Hold</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>

                  {/* Client Information Section */}
                  <h4 className="mb-3 mt-4 border-bottom pb-2">Client Information (Required)</h4>
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
                      value={projectData.clientPhone || ""}
                      onChange={handleChange}
                      required
                    />
                    {formErrors.clientPhone && (
                      <div className="invalid-feedback">{formErrors.clientPhone}</div>
                    )}
                  </div>

                  {/* Surveyor section */}
                  <h4 className="mb-3 mt-4 border-bottom pb-2">Surveyor Information (Required)</h4>
                  <div className="mb-3">
                    <label className="form-label">Company Name *</label>
                    <input
                      type="text"
                      className={`form-control ${
                        formErrors.surveyorCompanyName ? "is-invalid" : ""
                      }`}
                      name="surveyorCompanyName"
                      value={projectData.surveyor.details.companyName || ""}
                      onChange={handleSurveyorChange}
                      required
                    />
                    {formErrors.surveyorCompanyName && (
                      <div className="invalid-feedback">{formErrors.surveyorCompanyName}</div>
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
                      value={projectData.surveyor.details.contactName || ""}
                      onChange={handleSurveyorChange}
                      required
                    />
                    {formErrors.surveyorContactName && (
                      <div className="invalid-feedback">{formErrors.surveyorContactName}</div>
                    )}
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Address *</label>
                    <input
                      type="text"
                      className={`form-control ${formErrors.surveyorAddress ? "is-invalid" : ""}`}
                      name="surveyorAddress"
                      value={projectData.surveyor.details.address || ""}
                      onChange={handleSurveyorChange}
                      required
                    />
                    {formErrors.surveyorAddress && (
                      <div className="invalid-feedback">{formErrors.surveyorAddress}</div>
                    )}
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Phone *</label>
                    <input
                      type="text"
                      className={`form-control ${formErrors.surveyorPhone ? "is-invalid" : ""}`}
                      name="surveyorPhone"
                      value={projectData.surveyor.details.phone || ""}
                      onChange={handleSurveyorChange}
                      required
                    />
                    {formErrors.surveyorPhone && (
                      <div className="invalid-feedback">{formErrors.surveyorPhone}</div>
                    )}
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Email *</label>
                    <input
                      type="email"
                      className={`form-control ${formErrors.surveyorEmail ? "is-invalid" : ""}`}
                      name="surveyorEmail"
                      value={projectData.surveyor.details.email || ""}
                      onChange={handleSurveyorChange}
                      required
                    />
                    {formErrors.surveyorEmail && (
                      <div className="invalid-feedback">{formErrors.surveyorEmail}</div>
                    )}
                  </div>

                  {/* Architect / Project Manager section */}
                  <h4 className="mb-3 mt-4 border-bottom pb-2">
                    Architect / Project Manager Information
                  </h4>

                  <div className="mb-3">
                    <label className="form-label fw-semibold">
                      Do you have an Architect / Project Manager? *
                    </label>
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
                        <label
                          className="form-check-label"
                          htmlFor="architectYes">
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
                        <label
                          className="form-check-label"
                          htmlFor="architectNo">
                          No
                        </label>
                      </div>
                    </div>
                  </div>

                  {architectpmSelected === "Yes" && (
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
                          <div className="invalid-feedback">{formErrors.architectPmAddress}</div>
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
                          <div className="invalid-feedback">{formErrors.architectPmPhone}</div>
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
                          <div className="invalid-feedback">{formErrors.architectPmEmail}</div>
                        )}
                      </div>
                    </>
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
                        "Create Project"
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

export default ProjectCreate;
