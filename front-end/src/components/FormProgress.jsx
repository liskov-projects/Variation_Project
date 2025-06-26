import { useEffect, useState } from "react";
import { useProfile } from "../contexts/ProfileContext";
import validateStep from "../utils/stepsValidator";

const FormProgress = ({ isCompleted, changeCompletedState }) => {
  const { currentStep, setCurrentStep } = useProfile();
  // OLD:
  // const [completedStep, setCompletedStep] = useState(1);
  // NEW:
  const { profileData } = useProfile();

  const steps = [
    { number: 1, label: "Builder Information" },
    { number: 2, label: "Business Type" },
    { number: 3, label: "Review & Submit" },
  ];

  // //  OLD:
  // const handleStepClick = (stepNumber) => {
  //   // Only allow navigation to completed steps or the current step
  //   if (stepNumber <= completedStep) {
  //     setCurrentStep(stepNumber);
  //   }
  //   if (completedStep < currentStep)
  //     setCompletedStep(currentStep);
  // };

  //  NEW:
  // will remove the green tick if the step form is not completed
  useEffect(() => {
    const error = validateStep(currentStep, profileData);
    changeCompletedState(currentStep, !error);
  }, [profileData]);

  // helper func
  const checkClickableStep = (stepNumber) => {
    if (stepNumber === currentStep) return true;
    return isCompleted.slice(0, stepNumber - 1).every(Boolean);
  };

  return (
    <div
      className="sidebar bg-light border-end p-4"
      style={{ width: "280px", minHeight: "100vh" }}
    >
      <h4 className="mb-4">Profile Setup</h4>
      <div className="d-flex flex-column gap-3">
        {steps.map((step, index) => {
          const isActive = currentStep === step.number;
          const isClickable = checkClickableStep(step.number);
          const completed = isCompleted[index];

          // console.log(step, "completed : ", isCompleted[index]);
          return (
            <div
              key={step.number}
              onClick={() => {
                isClickable && setCurrentStep(step.number);
                validateStep(step, profileData);
              }}
              className={`
                d-flex align-items-center p-3 rounded 
                ${isActive ? "bg-primary text-white" : "bg-white"} 
                ${isClickable ? "cursor-pointer" : "opacity-50"}
              `}
              style={{ cursor: isClickable ? "pointer" : "not-allowed" }}
            >
              <div
                className={`
                  step-number me-3 rounded-circle d-flex align-items-center justify-content-center
                  ${isCompleted ? "bg-success text-white" : ""}
                `}
                style={{
                  width: "30px",
                  height: "30px",
                  border: "2px solid currentColor",
                }}
              >
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
