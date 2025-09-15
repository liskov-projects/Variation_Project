export const projectsSeeds = [
  // Project 1 - Residential House
  {
    userId: "user_individual_001",
    propertyAddress: "100 Residential Street, Melbourne VIC 3000",
    clientName: "Emma Thompson",
    clientEmail: "emma.thompson@email.com",
    clientPhone: "0411112222",
    projectName: "Modern Family Home",
    startDate: new Date("2024-01-15"),
    originalEndDate: new Date("2024-07-15"),
    currentEndDate: new Date("2024-07-15"),
    totalDaysExtended: 0,
    status: "active",
    description: "Construction of a 4-bedroom modern family home with open plan living",
    contractPrice: 450000,
    currentContractPrice: 450000,
    architect: {
      hasArchitect: true,
      details: {
        companyName: "Design Architects Pty Ltd",
        contactName: "James Mitchell",
        address: "200 Design Street, Melbourne VIC 3001",
        phone: "0399998888",
        email: "james@designarchitects.com.au"
      }
    },
    surveyor: {
      hasSurveyor: true,
      details: {
        companyName: "Precision Surveying",
        contactName: "Amanda Lee",
        address: "300 Survey Road, Melbourne VIC 3002", 
        phone: "0388887777",
        email: "amanda@precisionsurveying.com.au"
      }
    },
    variations: []
  },
   // Project 2 - Commercial Building
  {
    userId: "user_company_001",
    propertyAddress: "500 Business Park, Sydney NSW 2000",
    clientName: "Corporate Developments Ltd",
    clientEmail: "projects@corporate.com.au",
    clientPhone: "0299990000",
    projectName: "Office Complex Phase 1",
    startDate: new Date("2024-02-01"),
    originalEndDate: new Date("2024-12-01"),
    currentEndDate: new Date("2024-12-01"),
    totalDaysExtended: 0,
    status: "active",
    description: "Construction of 3-story office complex with underground parking",
    contractPrice: 2500000,
    currentContractPrice: 2500000,
    architect: {
      hasArchitect: true,
      details: {
        companyName: "Commercial Architects Inc",
        contactName: "Jennifer Chen",
        address: "400 Commercial Ave, Sydney NSW 2001",
        phone: "0277776666",
        email: "jennifer@commercialarchitects.com.au"
      }
    },
    surveyor: {
      hasSurveyor: true,
      details: {
        companyName: "Metro Surveying Services",
        contactName: "Peter Anderson",
        address: "600 Metro Street, Sydney NSW 2002",
        phone: "0266665555", 
        email: "peter@metrosurveying.com.au"
      }
    },
    variations: []
  },
  // Project 3 - Renovation Project
  {
    userId: "user_partnership_001",
    propertyAddress: "75 Heritage Lane, Brisbane QLD 4000",
    clientName: "Margaret and John Davis",
    clientEmail: "davis.family@email.com",
    clientPhone: "0744445555",
    projectName: "Heritage Home Renovation",
    startDate: new Date("2024-03-01"),
    originalEndDate: new Date("2024-09-01"),
    currentEndDate: new Date("2024-09-01"),
    totalDaysExtended: 0,
    status: "active",
    description: "Complete renovation of heritage-listed Queenslander home",
    contractPrice: 320000,
    currentContractPrice: 320000,
    architect: {
      hasArchitect: false,
      details: {}
    },
    surveyor: {
      hasSurveyor: true,
      details: {
        companyName: "Heritage Surveying",
        contactName: "Rachel Green",
        address: "800 Heritage Road, Brisbane QLD 4001",
        phone: "0755554444",
        email: "rachel@heritagesurveying.com.au"
      }
    },
    variations: []
  },

  // Project 4 - Completed Project
  {
    userId: "user_individual_002",
    propertyAddress: "25 Suburban Court, Perth WA 6000",
    clientName: "The Johnson Family",
    clientEmail: "johnson.family@email.com",
    clientPhone: "0866667777",
    projectName: "Suburban Dream Home",
    startDate: new Date("2023-06-01"),
    originalEndDate: new Date("2023-12-01"),
    currentEndDate: new Date("2023-12-15"),
    totalDaysExtended: 14,
    status: "completed",
    description: "Construction of 3-bedroom home with double garage",
    contractPrice: 380000,
    currentContractPrice: 395000,
    architect: {
      hasArchitect: false,
      details: {}
    },
    surveyor: {
      hasSurveyor: true,
      details: {
        companyName: "Western Surveying Co",
        contactName: "Mark Thompson",
        address: "900 Western Way, Perth WA 6001",
        phone: "0844443333",
        email: "mark@westernsurveying.com.au"
      }
    },
    variations: []
  },
  
  // Project 5 - On Hold Project
  {
    userId: "user_company_002",
    propertyAddress: "150 Industrial Estate, Adelaide SA 5000",
    clientName: "Manufacturing Solutions Pty Ltd",
    clientEmail: "facilities@manufacturing.com.au",
    clientPhone: "0833332222",
    projectName: "Warehouse Expansion",
    startDate: new Date("2024-01-01"),
    originalEndDate: new Date("2024-08-01"),
    currentEndDate: new Date("2024-08-01"),
    totalDaysExtended: 0,
    status: "on-hold",
    description: "Expansion of existing warehouse facility",
    contractPrice: 1800000,
    currentContractPrice: 1800000,
    architect: {
      hasArchitect: true,
      details: {
        companyName: "Industrial Design Partners",
        contactName: "Steven Wright",
        address: "1000 Industrial Blvd, Adelaide SA 5001",
        phone: "0822221111",
        email: "steven@industrialdesign.com.au"
      }
    },
    surveyor: {
      hasSurveyor: true,
      details: {
        companyName: "South Australian Surveying",
        contactName: "Nicole Martinez",
        address: "1100 Survey Lane, Adelaide SA 5002",
        phone: "0811110000",
        email: "nicole@sasurveying.com.au"
      }
    },
    variations: []
  }
];