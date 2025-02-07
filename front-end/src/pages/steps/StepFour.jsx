import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useFormStorage from '../../hooks/useFormStorage';

const StepFour = () => {
  const navigate = useNavigate();
  const { formData, setCurrentStep, clearFormData } = useFormStorage();

  useEffect(() => {
    setCurrentStep(4);
  }, [setCurrentStep]);

  const handleSubmit = (e) => {
    e.preventDefault();
    clearFormData();
    setCurrentStep(1);
    navigate('/step1');
  };

  return (
    <div className="container py-4">
      <h2 className="mb-4">Review Your Information</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Full Name</label>
          <p className="form-control">{formData.fullName}</p>
        </div>
        <div className="mb-3">
          <label className="form-label">Email</label>
          <p className="form-control">{formData.email}</p>
        </div>
        <div className="mb-3">
          <label className="form-label">Date of Birth</label>
          <p className="form-control">{formData.dob}</p>
        </div>
        <div className="mb-3">
          <label className="form-label">Gender</label>
          <p className="form-control">{formData.gender}</p>
        </div>
        <div className="mb-3">
          <label className="form-label">Current Occupation</label>
          <p className="form-control">{formData.occupation}</p>
        </div>
        <div className="mb-3">
          <label className="form-label">Experience</label>
          <p className="form-control">{formData.experience}</p>
        </div>
        <div className="mb-3">
          <label className="form-label">Skills</label>
          <p className="form-control">{formData.skills}</p>
        </div>
        <div className="mb-3">
          <label className="form-label">Will you be watching Superbowl 2025</label>
          <p className="form-control">{formData.superbowl}</p>
        </div>
        {formData.superbowl === 'Yes' ? 
            <div className="mb-3">
                <label className="form-label">Who do you think will win?</label>
                <p className="form-control">{formData.superbowlWinner}</p>
            </div>
          :
            <div className="mb-3">
                <label className="form-label">What is your favorite Sport?</label>
                <p className="form-control">{formData.favSport}</p>
                <div className="mb-3">
                <label className="form-label">Can you mention few reasons as to why you like that sport?</label>
                <p className="form-control">{formData.favReason}</p>
            </div>
            </div>
        }
        <button type="submit" className="btn btn-primary float-end">
          Submit
        </button>
      </form>
    </div>
  );
};

export default StepFour;