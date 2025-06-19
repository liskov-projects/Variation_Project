import React, { useState } from 'react';
import { useProfile } from '../contexts/ProfileContext';

const FormProgress = (isCompleted, validateStep) => {
  const { currentStep, setCurrentStep, profileData } = useProfile();
  const [completedStep, setCompletedStep] = useState(1);
  const [error, setError] = useState("");
  const steps = [
    { number: 1, label: 'Builder Information' },
    { number: 2, label: 'Company & Partnership' },
    { number: 3, label: 'Individual Information' },
    { number: 4, label: 'Review & Submit' }
  ];

  const handleStepClick = (stepNumber) => {
    // Only allow navigation to completed steps or the current step
    // const errMsg = validateStep(stepNumber, profileData);
    if (stepNumber <= completedStep) {
      setCurrentStep(stepNumber);
    }
    if (completedStep < currentStep)
      setCompletedStep(currentStep);
    // setError(errMsg);
  };

  return (
    <div className="sidebar bg-light border-end p-4" style={{ width: '280px', minHeight: '100vh' }}>
      <h4 className="mb-4">Profile Setup</h4>
      <div className="d-flex flex-column gap-3">
        {/* {error && <div>{error}</div>} */}
        {steps.map((step, index) => {
          const isActive = currentStep === step.number;
          const isClickable = step.number <= completedStep;

          return (
            <div
              key={step.number}
              onClick={() => handleStepClick(step.number)}
              className={`
                d-flex align-items-center p-3 rounded 
                ${isActive ? 'bg-primary text-white' : 'bg-white'} 
                ${isClickable ? 'cursor-pointer' : 'opacity-50'}
              `}
              style={{ cursor: isClickable ? 'pointer' : 'not-allowed' }}
            >
              <div
                className={`
                  step-number me-3 rounded-circle d-flex align-items-center justify-content-center
                  ${isCompleted[index] && 'bg-success text-white'}
                `}
                style={{ 
                  width: '30px', 
                  height: '30px', 
                  border: '2px solid currentColor'
                }}
              >
                {isCompleted[index] ? '✓' : step.number}
              </div>
              <span>{step.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FormProgress;