// src/components/ProfileSteps/StepTwo.jsx
import { useState, useEffect } from "react";
import { useProfile } from "../../contexts/ProfileContext";
import CustomRadioButton from "./CustomRadioButton";
import CompanyInfo from "./BusinessType/CompanyInfo";
import PartnershipInfo from "./BusinessType/PartnershipInfo";
import IndividualInfo from "./BusinessType/IndividualInfo";

const StepTwo = () => {
  const { profileData, updateProfile } = useProfile();
  const [selected, setSelected] = useState(profileData.businessType || "Individual");

  useEffect(() => {
    updateProfile({ businessType: selected });
  }, [selected]);

  const renderContent = () => {
    switch (selected) {
      case "Company":
        return <CompanyInfo />;
      case "Partnership":
        return <PartnershipInfo />;
      default:
        return <IndividualInfo />;
    }
  };

  return (
    <div>
      <h4>Select business type</h4>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          gap: "1.5rem",
          marginTop: "1rem",
          marginBottom: "1rem",
        }}>
        {["Individual", "Company", "Partnership"].map((type) => (
          <CustomRadioButton
            key={type}
            selected={selected}
            setSelected={setSelected}
            option={type}
          />
        ))}
      </div>
      <div>{renderContent()}</div>
    </div>
  );
};

export default StepTwo;
