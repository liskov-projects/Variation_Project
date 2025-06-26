// Validate form data for each step
export default function validateStep (step, profileData) {
    // changed if to switch
    switch (step) {
      case 1:
        if (!profileData.fullName) return "Full name is required";
        if (!profileData.address) return "Address is required";
        if (!profileData.email || !profileData.email.includes("@"))
          return "A valid email is required";
        if (!profileData.phoneNumber) return "Phone number is required";
        break;
      case 2:
        if (profileData.company === "Yes") {
          // console.log("profile data: ", profileData);
          if (profileData.companyDetails.acn.toString().length !== 9)
            return "ACN must be 9 digits";

          if (!profileData.companyDetails.companyName)
            return "Company name is required";
        }
        break;
      case 3:
        if (!profileData.abn) return "ABN is required";
        if (profileData.abn.toString().length !== 11)
          return "ABN must be 11 digits";
        if (!profileData.brn) return "Builder Registration  is required";
        break;
      default:
        return null;
    }
    return;
  };
