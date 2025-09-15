export const variationsSeeds = [
  // Variation 1 - Debit variation for Project 1
  {
    description: "Additional electrical outlets in kitchen and living areas",
    reason: "Client requested additional power points for modern appliances",
    effect: "Improved functionality and convenience for the client",
    permitVariation: "No",
    delay: "0",
    variationType: "debit",
    cost: 2500,
    dateCreated: new Date("2024-02-15"),
    status: "approved",
    signatureToken: null,
    signatureTokenExpiresAt: null,
    signatureData: null,
    signedAt: new Date("2024-02-20"),
    signedBy: {
      name: "Emma Thompson",
      email: "emma.thompson@email.com",
      ipAddress: "192.168.1.100",
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
    }
  },
  
  // Variation 2 - Credit variation for Project 1
  {
    description: "Removal of premium kitchen appliances (client supplying own)",
    reason: "Client decided to purchase appliances separately",
    effect: "Reduced project cost and client has more control over appliance selection",
    permitVariation: "No", 
    delay: "0",
    variationType: "credit",
    cost: -8500,
    dateCreated: new Date("2024-03-01"),
    status: "approved",
    signatureToken: null,
    signatureTokenExpiresAt: null,
    signatureData: null,
    signedAt: new Date("2024-03-05"),
    signedBy: {
      name: "Emma Thompson",
      email: "emma.thompson@email.com",
      ipAddress: "192.168.1.100",
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
    }
  },
  
  // Variation 3 - Debit variation for Project 2
  {
    description: "Additional structural support for rooftop equipment",
    reason: "Client requirements changed to include rooftop HVAC equipment",
    effect: "Enhanced building functionality and energy efficiency",
    permitVariation: "Yes",
    delay: "7",
    variationType: "debit",
    cost: 45000,
    dateCreated: new Date("2024-04-10"),
    status: "submitted",
    signatureToken: "token_abc123def456",
    signatureTokenExpiresAt: new Date("2024-04-25"),
    signatureData: null,
    signedAt: null,
    signedBy: null
  },
  
  // Variation 4 - Debit variation for Project 3
  {
    description: "Heritage restoration of original timber features",
    reason: "Discovery of original timber features during demolition",
    effect: "Enhanced heritage value and authenticity of the property",
    permitVariation: "Yes",
    delay: "14",
    variationType: "debit", 
    cost: 18000,
    dateCreated: new Date("2024-04-20"),
    status: "draft",
    signatureToken: null,
    signatureTokenExpiresAt: null,
    signatureData: null,
    signedAt: null,
    signedBy: null
  },
  
  // Variation 5 - Credit variation for Project 4 (completed)
  {
    description: "Removal of premium landscaping package",
    reason: "Client decided to handle landscaping separately",
    effect: "Reduced project cost and client has more control over landscaping design",
    permitVariation: "No",
    delay: "0",
    variationType: "credit",
    cost: -12000,
    dateCreated: new Date("2023-10-15"),
    status: "approved",
    signatureToken: null,
    signatureTokenExpiresAt: null,
    signatureData: null,
    signedAt: new Date("2023-10-20"),
    signedBy: {
      name: "The Johnson Family",
      email: "johnson.family@email.com",
      ipAddress: "192.168.1.200",
      userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36"
    }
  },
  
  // Variation 6 - Debit variation for Project 4 (completed)
  {
    description: "Additional insulation upgrade",
    reason: "Client requested higher energy efficiency rating",
    effect: "Improved thermal performance and reduced energy costs",
    permitVariation: "No",
    delay: "0",
    variationType: "debit",
    cost: 3500,
    dateCreated: new Date("2023-11-01"),
    status: "approved",
    signatureToken: null,
    signatureTokenExpiresAt: null,
    signatureData: null,
    signedAt: new Date("2023-11-05"),
    signedBy: {
      name: "The Johnson Family",
      email: "johnson.family@email.com",
      ipAddress: "192.168.1.200",
      userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36"
    }
  }
];
