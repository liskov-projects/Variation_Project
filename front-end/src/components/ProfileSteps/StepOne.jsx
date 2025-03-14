import React from 'react';
import { useProfile } from '../../contexts/ProfileContext';

const StepOne = () => {
  const { profileData, updateProfile } = useProfile();

  return (
    <div>
      <h4 className="mb-3">Builder Information</h4>
      
      <div className="mb-3">
        <label className="form-label">Builder Name *</label>
        <input
          type="text"
          className="form-control"
          value={profileData.fullName || ''}
          onChange={(e) => updateProfile({ fullName: e.target.value })}
          required
        />
      </div>
      
      <div className="mb-3">
        <label className="form-label">Address *</label>
        <input
          type="text"
          className="form-control"
          value={profileData.address || ''}
          onChange={(e) => updateProfile({ address: e.target.value })}
          required
        />
      </div>
      
      <div className="mb-3">
        <label className="form-label">Email *</label>
        <input
          type="email"
          className="form-control"
          value={profileData.email || ''}
          onChange={(e) => updateProfile({ email: e.target.value })}
          required
        />
      </div>
      
      <div className="mb-3">
        <label className="form-label">Telephone/Mobile Number *</label>
        <input
          type="text"
          className="form-control"
          value={profileData.phoneNumber || ''}
          onChange={(e) => updateProfile({ phoneNumber: e.target.value })}
          required
        />
      </div>
    </div>
  );
};

export default StepOne;