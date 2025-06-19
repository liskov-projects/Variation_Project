import React, { useState, useEffect } from "react";
import { useProfile } from "../../contexts/ProfileContext";

const StepTwo = () => {
  //  NEW:
  const [selected, setSelected] = useState("");
  const { profileData, updateProfile, updatePartner } = useProfile();

  if (profileData.companyDetails?.acn) {
    profileData.company = "Yes";
  }

  useEffect(() => {
    updateProfile({ 
      businessType: selected,
      company: selected === "Company" ? "Yes" : "No",
      partnership: selected === "Partnership" ? "Yes" : "No"
    });
  }, [selected])

  const radios = (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", marginTop: "1rem", marginBottom: "1rem" }}>
      <label>
        <input
          style={{ marginRight: '0.5rem' }}
          type="radio"
          name="GroupSelection"
          value="Company"
          checked={selected === "Company"}
          onChange={(e) => setSelected(e.target.value)}
        />
        Company
      </label>
      <label>
        <input
          style={{ marginRight: '0.5rem' }}
          type="radio"
          name="GroupSelection"
          value="Partnership"
          checked={selected === "Partnership"}
          onChange={(e) => {
            setSelected(e.target.value);
            updateProfile({ partnership: "Yes" });
          }}
        />
        Partnership
      </label>
      <label>
        <input
          style={{ marginRight: '0.5rem' }}
          type="radio"
          name="GroupSelection"
          value="Individual"
          checked={selected === "Individual"}
          onChange={(e) => setSelected(e.target.value)}
        />
        Individual
      </label>
    </div>
  );

  return (
    <div>
      <div>{radios}</div>
    </div>
  );
};

export default StepTwo;

