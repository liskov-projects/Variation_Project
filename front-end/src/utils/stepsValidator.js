// Validate form data for each step
export default function validateStep(step, profileData) {

  switch (step) {
    case 1:
      if (!profileData.fullName) return "Full name is required";
      if (!profileData.address) return "Address is required";
      // Validate email string against regex pattern
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!profileData.email || !emailRegex.test(profileData.email))
        return "A valid email is required";
      if (!profileData.phoneNumber) return "Phone number is required";
      break;
      
    case 2:
      // Validate all business types have an ABN
      if (profileData.abn.toString().length !== 11) return "ABN must be 11 digits";
      
      if (profileData.businessType === "Company") {
        if (!profileData.companyDetails?.companyName)
          return "Company name is required";
        if (!profileData.companyDetails?.acn)
          return "ACN is required";
        if (profileData.companyDetails.acn.toString().length !== 9)
          return "ACN must be 9 digits";
      } else if (profileData.businessType === "Partnership") {
        if (!profileData.numberOfPartners)
          return "Number of partners is required";
        if (!profileData.partners || profileData.partners.length === 0)
          return "At least one partner is required";
        // Validate each partner
        for (let i = 0; i < profileData.partners.length; i++) {
          const partner = profileData.partners[i];
          if (!partner.name) return `Partner ${i + 1} name is required`;
          if (!partner.address) return `Partner ${i + 1} address is required`;
        }
      } else if (profileData.businessType === "Individual") {
        if (!profileData.abn) return "ABN is required";
        if (!profileData.brn) return "Builder Registration is required";
      }
      break;

      
    default:
      return null;
  }
  return null;
}