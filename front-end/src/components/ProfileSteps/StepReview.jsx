import React from "react";
import { useProfile } from "../../contexts/ProfileContext";

const StepReview = () => {
  const { profileData } = useProfile();

  return (
    <div>
      <h4 className="mb-4">Review Your Information</h4>

      <div className="card mb-4">
        <div className="card-header bg-light">
          <h5 className="mb-0">Builder Information</h5>
        </div>
        <div className="card-body">
          <div className="row mb-3">
            <div className="col-md-4 fw-bold">Name:</div>
            <div className="col-md-8">{profileData.fullName}</div>
          </div>
          <div className="row mb-3">
            <div className="col-md-4 fw-bold">Address:</div>
            <div className="col-md-8">{profileData.address}</div>
          </div>
          <div className="row mb-3">
            <div className="col-md-4 fw-bold">Email:</div>
            <div className="col-md-8">{profileData.email}</div>
          </div>
          <div className="row mb-3">
            <div className="col-md-4 fw-bold">Phone:</div>
            <div className="col-md-8">{profileData.phoneNumber}</div>
          </div>
        </div>
      </div>

      {profileData.businessType === "Company" && (
        <div className="card mb-4">
          <div className="card-header bg-light">
            <h5 className="mb-0">Company Information</h5>
          </div>
          <div className="card-body">
            <div className="row mb-3">
              <div className="col-md-4 fw-bold">Company:</div>
              <div className="col-md-8">{profileData.company || "N/A"}</div>
            </div>
              <div className="row mb-3">
                <div className="col-md-4 fw-bold">Company Name:</div>
                <div className="col-md-8">{profileData.companyDetails.companyName || "N/A"}</div>
              </div>
              <div className="row mb-3">
              <div className="col-md-4 fw-bold">ACN:</div>
              <div className="col-md-8">
                {profileData.companyDetails.acn ? profileData.companyDetails.acn : "N/A"}
              </div>
            </div>
          </div>
        </div>
      )}

      {profileData.businessType === "Partnership" && (
        <div className="card mb-4">
          <div className="card-header bg-light">
            <h5 className="mb-0">Partnership Information</h5>
          </div>
          <div className="card-body">
            <div className="row mb-3">
              <div className="col-md-4 fw-bold">Partnership:</div>
              <div className="col-md-8">{profileData.partnership || "N/A"}</div>
            </div>

            <div className="row mb-3">
              <div className="col-md-4 fw-bold">Number of Partners:</div>
              <div className="col-md-8">{profileData.numberOfPartners || "N/A"}</div>
            </div>

            {profileData.partners.map((partner, index) => (
              <div
                key={index}
                className="card mb-3">
                <div className="card-header">Partner {index + 1}</div>
                <div className="card-body">
                  <div className="row mb-2">
                    <div className="col-md-4 fw-bold">Name:</div>
                    <div className="col-md-8">{partner.name}</div>
                  </div>
                  <div className="row">
                    <div className="col-md-4 fw-bold">Address:</div>
                    <div className="col-md-8">{partner.address}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {profileData.businessType === "Individual" && (
        <div className="card mb-4">
          <div className="card-header bg-light">
            <h5 className="mb-0">Individual Information</h5>
          </div>
          <div className="card-body">
            
            <div className="row mb-3">
              <div className="col-md-4 fw-bold">ABN:</div>
              <div className="col-md-8">{profileData.abn}</div>
            </div>
            <div className="row mb-3">
              <div className="col-md-4 fw-bold">Builder Registration #:</div>
              <div className="col-md-8">{profileData.brn}</div>
            </div>
          </div>
        </div>
      )}

      <div className="alert alert-info">
        <i className="bi bi-info-circle me-2"></i>
        Please review all information carefully. After submission, you'll still be able to edit your
        profile from your dashboard.
      </div>
    </div>
  );
};

export default StepReview;
