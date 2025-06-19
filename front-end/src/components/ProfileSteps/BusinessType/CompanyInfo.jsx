import { useProfile } from "../../../contexts/ProfileContext";

const CompanyInfo = () => {
  const { profileData, updateProfile } = useProfile();

  if (profileData.companyDetails?.acn) {
    profileData.company = "Yes";
  }

  return (
    <div>
      {/* Company Section */}
      <h4 className="mb-3">Company Information</h4>
      <div className="mb-3">
        <label className="form-label">Company Y/N *</label>
        <div>
          <div className="form-check form-check-inline">
            <input
              type="radio"
              className="form-check-input"
              id="companyYes"
              checked={profileData.company === "Yes"}
              onChange={() => updateProfile({ company: "Yes" })}
              required
            />
            <label className="form-check-label" htmlFor="companyYes">
              Yes
            </label>
          </div>
          <div className="form-check form-check-inline">
            <input
              type="radio"
              className="form-check-input"
              id="companyNo"
              checked={profileData.company === "No"}
              onChange={() =>
                updateProfile({ company: "No", companyName: "", acn: "" })
              }
              required
            />
            <label className="form-check-label" htmlFor="companyNo">
              No
            </label>
          </div>
        </div>
      </div>

      {profileData.company === "Yes" && (
        <div className="mb-3">
          <label className="form-label">Company Name *</label>
          <input
            type="text"
            className="form-control"
            value={profileData.companyDetails?.companyName || ""}
            onChange={(e) =>
              updateProfile({
                companyDetails: {
                  ...profileData.companyDetails,
                  companyName: e.target.value,
                },
              })
            }
            required
          />
        </div>
      )}

      {profileData.company === "Yes" && (
        <div className="mb-3">
          <label className="form-label">ACN *</label>
          <input
            type="number"
            className="form-control"
            value={profileData.companyDetails?.acn || ""}
            onChange={(e) =>
              updateProfile({
                companyDetails: {
                  ...profileData.companyDetails,
                  acn: e.target.value,
                },
              })
            }
            required
          />
          <small className="text-muted">Must be exactly 9 digits</small>
        </div>
      )}
    </div>
  );
};

export default CompanyInfo;

