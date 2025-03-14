import React from 'react';
import { useProfile } from '../../contexts/ProfileContext';

const StepThree = () => {
  const { profileData, updateProfile } = useProfile();

  return (
    <div>
      <h4 className="mb-3">Individual (Default) Information</h4>
      <div className="mb-3">
        <label className="form-label">ACN (9 digits) *</label>
        <input
          type="number"
          className="form-control"
          value={profileData.acn || ''}
          onChange={(e) => updateProfile({ acn: e.target.value })}
          required
        />
        <small className="text-muted">Must be exactly 9 digits</small>
      </div>
      
      <div className="mb-3">
        <label className="form-label">ABN (11 digits) *</label>
        <input
          type="number"
          className="form-control"
          value={profileData.abn || ''}
          onChange={(e) => updateProfile({ abn: e.target.value })}
          required
        />
        <small className="text-muted">Must be exactly 11 digits</small>
      </div>
      
      <div className="mb-3">
        <label className="form-label">Builder Registration # *</label>
        <input
          type="text"
          className="form-control"
          value={profileData.brn || ''}
          onChange={(e) => updateProfile({ brn: e.target.value })}
          required
        />
      </div>
    </div>
  );
};

export default StepThree;