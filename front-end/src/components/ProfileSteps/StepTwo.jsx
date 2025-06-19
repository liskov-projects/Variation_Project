import { useState, useEffect } from "react";
import { useProfile } from "../../contexts/ProfileContext";
import CustomRadioButton from "./CustomRadioButton";

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

  const radios = (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
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
  );

  return (
    <div>
      <div>{radios}</div>
    </div>
  );
};

export default StepTwo;
