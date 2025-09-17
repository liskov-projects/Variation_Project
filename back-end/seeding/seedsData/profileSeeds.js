//  not sure if we need those?

export const profileSeeds = [
  // Individual Builder
  {
    userId: "user_individual_001",
    email: "john.smith@builders.com",
    profileData: {
      fullName: "John Smith",
      address: "123 Builder Street, Melbourne VIC 3000",
      phoneNumber: "0412345678",
      businessType: "Individual",
      abn: "12345678901",
      brn: "BRN-IND-001",
      logo: null
    },
    profileSetupComplete: true
  },
  
  // Company Builder
  {
    userId: "user_company_001", 
    email: "contact@premiumbuilders.com.au",
    profileData: {
      fullName: "Michael Johnson",
      address: "456 Construction Ave, Sydney NSW 2000",
      phoneNumber: "0298765432",
      businessType: "Company",
      companyDetails: {
        companyName: "Premium Builders Pty Ltd",
        acn: "123456789"
      },
      logo: null
    },
    profileSetupComplete: true
  },
  
  // Partnership Builder
  {
    userId: "user_partnership_001",
    email: "info@partnershipbuilders.com.au", 
    profileData: {
      fullName: "Sarah Wilson",
      address: "789 Partnership Lane, Brisbane QLD 4000",
      phoneNumber: "0733334444",
      businessType: "Partnership",
      numberOfPartners: "2",
      partners: [
        {
          name: "Sarah Wilson",
          address: "789 Partnership Lane, Brisbane QLD 4000"
        },
        {
          name: "David Brown", 
          address: "321 Partner Street, Brisbane QLD 4001"
        }
      ],
      logo: null
    },
    profileSetupComplete: true
  },
  
  // Additional Individual Builder
  {
    userId: "user_individual_002",
    email: "lisa.garcia@construction.com",
    profileData: {
      fullName: "Lisa Garcia",
      address: "555 Residential Road, Perth WA 6000",
      phoneNumber: "0855556666",
      businessType: "Individual", 
      abn: "98765432109",
      brn: "BRN-IND-002",
      logo: null
    },
    profileSetupComplete: true
  },
  
  // Additional Company Builder
  {
    userId: "user_company_002",
    email: "admin@eliteconstruction.com.au",
    profileData: {
      fullName: "Robert Taylor",
      address: "888 Commercial Blvd, Adelaide SA 5000",
      phoneNumber: "0877778888",
      businessType: "Company",
      companyDetails: {
        companyName: "Elite Construction Group",
        acn: "987654321"
      },
      logo: null
    },
    profileSetupComplete: true
  }
];