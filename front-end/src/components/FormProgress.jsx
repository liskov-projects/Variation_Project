import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const FormProgress = ({ currentStep }) => {
  const location = useLocation();
  const navigate = useNavigate();
  // const [completed,setIsCompleted]=useState(false);

  // useEffect(()=>{

  // },[currentStep])

  

  const steps = [
    { path: '/step1', label: 'Personal Information' },
    { path: '/step2', label: 'Professional Details' },
    { path: '/step3', label: 'Additional Info' },
    { path: '/step4', label: 'Review' }
  ];

  const handleStepClick = (path, stepNumber) => {
    if (stepNumber <= currentStep) {
      navigate(path);
    }
  };

  return (
    <div className="sidebar bg-light border-end p-4" style={{ width: '280px', minHeight: '100vh' }}>
      <h4 className="mb-4">Application Progress</h4>
      <div className="d-flex flex-column gap-3">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isActive = location.pathname === step.path;
          const isCompleted =  stepNumber < currentStep; 
          const isClickable = stepNumber <= currentStep;

          return (
            <div
              key={step.path}
              onClick={() => handleStepClick(step.path, stepNumber)}
              className={`
                d-flex align-items-center p-3 rounded cursor-pointer
                ${isActive ? 'bg-primary text-white' : 'bg-white'}
                ${isClickable ? 'cursor-pointer' : 'opacity-50'}
              `}
              style={{ cursor: isClickable ? 'pointer' : 'not-allowed' }}
            >
              <div
                className={`
                  step-number me-3 rounded-circle d-flex align-items-center justify-content-center
                  ${isCompleted ? 'bg-success text-white' : ''} 
                `}
                style={{ width: '30px', height: '30px', border: '2px solid currentColor' }}
              >
                {isCompleted ? '✓' : stepNumber} 
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