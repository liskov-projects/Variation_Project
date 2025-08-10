import { useProfile } from "../../../contexts/ProfileContext";

const CompanyInfo = () => {
  const { profileData, updateProfile } = useProfile();

  return (
    <div>
      {/* Company Section */}
      <h4 className="mb-3">Company Information</h4>

      <div className="mb-3">
        <label className="form-label">ABN (11 digits) *</label>
        <input
          type="text"
          placeholder='01234567890'
          className="form-control light-grey-placeholder-text"
          value={profileData.abn || ""}
          onChange={(e) => updateProfile({ abn: e.target.value })}
          required
        />
        <small className="text-muted">Must be exactly 11 digits</small>
      </div>

      {profileData.company === "Yes" && (
        <div className="mb-3">
          <label className="form-label">Company Name *</label>
          <input
            type="text"
            placeholder="ABC Construction Pty Ltd"
            className="form-control light-grey-placeholder-text"
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
            type="text"
            placeholder="123456789"
            className="form-control light-grey-placeholder-text"
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

