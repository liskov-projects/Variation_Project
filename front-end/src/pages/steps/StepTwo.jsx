import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useFormStorage from '../../hooks/useFormStorage';

const StepTwo = () => {
  const navigate = useNavigate();
  const { formData, updateFormData, setCurrentStep } = useFormStorage();

  useEffect(() => {
    setCurrentStep(2);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setCurrentStep(3);
    navigate('/step3');
  };

  return (
    <div className="container py-4">
      <h2 className="mb-4">Professional Details</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Current Occupation</label>
          <input
            type="text"
            className="form-control"
            value={formData.occupation || ''}
            onChange={(e) => updateFormData({ occupation: e.target.value })}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Experience (years)</label>
          <input
            type="number"
            className="form-control"
            value={formData.experience || ''}
            onChange={(e) => updateFormData({ experience: e.target.value })}
            required
          />
        </div>
        
        <div className="mb-3">
             <label className="form-label">Skills</label>
           <textarea
             className="form-control"
             value={formData.skills || ''}
             onChange={(e) => updateFormData({ skills: e.target.value })}
             placeholder="Enter your skills (comma separated)"
             required
          />
        </div>
        <div className="mb-3">
             <label className="form-label">Education Level</label>
           <select
            className="form-select"
            value={formData.education || ''}
            onChange={(e) => updateFormData({ education: e.target.value })}
            required
          >
            <option value="">Select Education Level</option>
            <option value="highschool">High School</option>
            <option value="bachelors">Bachelor's Degree</option>
            <option value="masters">Master's Degree</option>
            <option value="phd">Ph.D.</option>
          </select>
        </div>
        <button type="submit" className="btn btn-primary float-end">
          Next
        </button>
      </form>
    </div>
  );
};

export default StepTwo;