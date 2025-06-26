import { useState, useEffect } from "react";
import { useProfile } from "../../contexts/ProfileContext";
import CustomRadioButton from "./CustomRadioButton";
//  NEW:
import CompanyInfo from "./BusinessType/CompanyInfo";
import PartnershipInfo from "./BusinessType/PartnershipInfo";
import IndividualInfo from "./BusinessType/IndividualInfo";

const StepTwo = () => {
  const { profileData, updateProfile } = useProfile();
  //  NEW:
  const [selected, setSelected] = useState(() => {
    if (profileData.businessType) return profileData.businessType;
    if (profileData.company === "Yes") return "Company";
    if (profileData.partnership === "Yes") return "Partnership";
    return "";
  });

  // REVIEW: direct mutation of state | also happens in other files
  if (profileData.companyDetails?.acn) {
    profileData.company = "Yes";
  }

  //  NEW:
  useEffect(() => {
    updateProfile({
      businessType: selected,
      company: selected === "Company" ? "Yes" : "No",
      partnership: selected === "Partnership" ? "Yes" : "No",
    });
  }, [selected]);

  // NEW: mergins step 2 & 3
  const renderContent = () => {
    if (selected === "Company") return <CompanyInfo />;
    else if (selected === "Partnership") return <PartnershipInfo />;
    else return <IndividualInfo />;
  };

  const radios = (
    <>
      <h4>Select business type</h4>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          gap: "1.5rem",
          marginTop: "1rem",
          marginBottom: "1rem",
        }}
      >
        {/*  NEW: Company*/}
        <CustomRadioButton
          selected={selected}
          setSelected={setSelected}
          option={"Company"}
        />
        {/* Partnership */}
        <CustomRadioButton
          selected={selected}
          setSelected={setSelected}
          option={"Partnership"}
        />

        {/* Individual */}
        <CustomRadioButton
          selected={selected}
          setSelected={setSelected}
          option={"Individual"}
        />
      </div>
    </>
  );

  return (
    <div>
      <div>{radios}</div>
      <div>{renderContent()}</div>
    </div>
  );
};

export default StepTwo;
