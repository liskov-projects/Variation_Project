import React from 'react';
import { useProfile } from '../../../contexts/ProfileContext';

const IndividualInfo = () => {
  const { profileData, updateProfile } = useProfile();

  return (
    <div>
      <h4 className="mb-3">Individual Information</h4>

      <div className="mb-3">
        <label className="form-label">ABN (11 digits) *</label>
        <input
          type="number"
          placeholder='0123456789'
          className="form-control light-grey-placeholder-text"
          value={profileData.abn || ""}
          onChange={(e) => updateProfile({ abn: e.target.value })}
          required
        />
        <small className="text-muted">Must be exactly 11 digits</small>
      </div>

      <div className="mb-3">
        <label className="form-label">Builder Registration # *</label>
        <input
          type="text"
          placeholder='1234567'
          className="form-control light-grey-placeholder-text"
          value={profileData.brn || ""}
          onChange={(e) => updateProfile({ brn: e.target.value })}
          required
        />
      </div>
      
    </div>
  );
};

export default IndividualInfo;