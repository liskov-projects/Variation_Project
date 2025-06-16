import React from "react";
import { useProfile } from "../contexts/ProfileContext";

const FormProgress = () => {
  const { currentStep, setCurrentStep } = useProfile();

  const steps = [
    { number: 1, label: "Builder Information" },
    { number: 2, label: "Company & Partnership" },
    { number: 3, label: "Individual Information" },
    { number: 4, label: "Review & Submit" },
  ];

  const handleStepClick = (stepNumber) => {
    // Only allow navigation to completed steps or the current step
    if (stepNumber <= currentStep) {
      setCurrentStep(stepNumber);
    }
  };

  return (
    <div
      className="sidebar bg-light border-end p-4"
      style={{ width: "280px", minHeight: "100vh" }}>
      <h4 className="mb-4">Profile Setup</h4>
      <div className="d-flex flex-column gap-3">
        {steps.map((step) => {
          const isActive = currentStep === step.number;
          const isCompleted = step.number < currentStep;
          const isClickable = step.number <= currentStep;

          return (
            <div
              key={step.number}
              onClick={() => handleStepClick(step.number)}
              className={`
                d-flex align-items-center p-3 rounded 
                ${isActive ? "bg-primary text-white" : "bg-white"} 
                ${isClickable ? "cursor-pointer" : "opacity-50"}
              `}
              style={{ cursor: isClickable ? "pointer" : "not-allowed" }}>
              <div
                className={`
                  step-number me-3 rounded-circle d-flex align-items-center justify-content-center
                  ${isCompleted ? "bg-success text-white" : ""}
                `}
                style={{
                  width: "30px",
                  height: "30px",
                  border: "2px solid currentColor",
                }}>
                {isCompleted ? "✓" : step.number}
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
