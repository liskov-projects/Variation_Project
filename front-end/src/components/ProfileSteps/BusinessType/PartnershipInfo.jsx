import { useProfile } from "../../../contexts/ProfileContext";

const PartnershipInfo = () => {
  const { profileData, updateProfile, updatePartner } = useProfile();

  if (profileData.companyDetails?.acn) {
    profileData.company = "Yes";
  }

  return (
    <div>
      {/* Partnership Section */}
      <h4 className="mb-3 mt-4">Partnership Information</h4>
      <div className="mb-3">
        <label className="form-label">Partnership Y/N *</label>
        <div>
          <div className="form-check form-check-inline">
            <input
              type="radio"
              className="form-check-input"
              id="partnershipYes"
              checked={profileData.partnership === "Yes"}
              onChange={() => updateProfile({ partnership: "Yes" })}
              required
            />
            <label className="form-check-label" htmlFor="partnershipYes">
              Yes
            </label>
          </div>
          <div className="form-check form-check-inline">
            <input
              type="radio"
              className="form-check-input"
              id="partnershipNo"
              checked={profileData.partnership === "No"}
              onChange={() => updateProfile({ partnership: "No" })}
              required
            />
            <label className="form-check-label" htmlFor="partnershipNo">
              No
            </label>
          </div>
        </div>
      </div>

      {profileData.partnership === "Yes" && (
        <div className="mb-3">
          <label className="form-label">Number of Partners *</label>
          <input
            type="number"
            className="form-control"
            value={profileData.numberOfPartners || ""}
            onChange={(e) =>
              updateProfile({ numberOfPartners: e.target.value })
            }
            min="1"
            required
          />

          {profileData.partners &&
            profileData.partners.map((partner, index) => (
              <div key={index} className="card mb-3 mt-3 p-3 bg-light">
                <h5>Partner {index + 1}</h5>
                <div className="mb-3">
                  <label className="form-label">Name *</label>
                  <input
                    type="text"
                    className="form-control"
                    value={partner.name || ""}
                    onChange={(e) =>
                      updatePartner(index, "name", e.target.value)
                    }
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Address *</label>
                  <input
                    type="text"
                    className="form-control"
                    value={partner.address || ""}
                    onChange={(e) =>
                      updatePartner(index, "address", e.target.value)
                    }
                    required
                  />
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default PartnershipInfo;