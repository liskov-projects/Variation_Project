// random email
export const generateEmail = (name) => {
  const domains = ["gmail.com", "yahoo.com", "hotmail.com", "outlook.com"];
  const domain = domains[Math.floor(Math.random() * domains.length)];
  const fullEmail = `${name.toLowerCase().replace(/\s+/g, ".")}@${domain}`;
  return handleError("generateEmail", fullEmail);
};

//  NEEDED (used in motherSeed.js setupProfileToSeed)
// random user IDs for testing
export const generateUserId = (prefix = "user") => {
  const randomNum = Math.floor(Math.random() * 10000);
  const fullId = `${prefix}_${randomNum}`;
  return handleError("generateUserId", fullId);
};
// random phone number
export const generatePhone = () => {
  const areaCodes = ["02", "03", "07", "08"];
  const areaCode = areaCodes[Math.floor(Math.random() * areaCodes.length)];
  const number = Math.floor(Math.random() * 10000000)
    .toString()
    .padStart(8, "0");
  const fullPhone = `${areaCode}${number}`;
  return handleError("generatePhone", fullPhone);
};

// random ABN
export const generateABN = () => {
  const ABN = Math.floor(Math.random() * 100000000000)
    .toString()
    .padStart(11, "0");
  return handleError("generateABN", ABN);
};

// random ACN
export const generateACN = () => {
  const ACN = Math.floor(Math.random() * 1000000000)
    .toString()
    .padStart(9, "0");
  return handleError("generateACN", ACN);
};

export const generateBusinessType = () => {
  const businessTypes = ["Individual", "Company", "Partnership"];
  const businessType = businessTypes[Math.floor(Math.random() * businessTypes.length)];
  return handleError("generateBusinessType", businessType);
  // return businessType;
};
export const generateStreet = () => {
  const streets = [
    "Main St",
    "Oak Ave",
    "Pine Rd",
    "Cedar Ln",
    "Elm St",
    "Maple Ave",
    "Birch Rd",
    "Spruce Ln",
  ];
  const street = streets[Math.floor(Math.random() * streets.length)];
  return handleError("generateStreet", street);
};
export const generateCity = () => {
  const cities = [
    "Melbourne",
    "Sydney",
    "Brisbane",
    "Perth",
    "Adelaide",
    "Hobart",
    "Darwin",
    "Canberra",
  ];
  const city = cities[Math.floor(Math.random() * cities.length)];
  return handleError("generateCity", city);
};
export const generateState = () => {
  const states = ["VIC", "NSW", "QLD", "WA", "SA", "TAS", "NT", "ACT"];
  const state = states[Math.floor(Math.random() * states.length)];
  return handleError("generateState", state);
};
export const generatePostcode = () => {
  const postcode = Math.floor(Math.random() * 9000) + 1000;
  return handleError("generatePostcode", postcode);
};
export const generateBuildingNumber = () => {
  const buildingNumber = Math.floor(Math.random() * 999) + 1;
  return handleError("generateBuildingNumber", buildingNumber);
};
export const generateAddress = () => {
  const fullAddress = `${generateBuildingNumber()} ${generateStreet()} ${generateCity()} ${generateState()} ${generatePostcode()}`;
  return handleError("generateAddress", fullAddress);
};
export const generateName = () => {
  const firstNames = [
    "John",
    "Jane",
    "Michael",
    "Sarah",
    "David",
    "Lisa",
    "Robert",
    "Emma",
    "James",
    "Amanda",
  ];
  const lastNames = [
    "Smith",
    "Johnson",
    "Williams",
    "Brown",
    "Jones",
    "Garcia",
    "Miller",
    "Davis",
    "Rodriguez",
    "Martinez",
  ];

  const fullName = `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`;
  return handleError("generateName", fullName);
};
export const generateProjectType = () => {
  const projectTypes = [
    "Residential House",
    "Commercial Building",
    "Renovation",
    "Extension",
    "New Construction",
  ];

  const type = projectTypes[Math.floor(Math.random() * projectTypes.length)];
  return handleError("generateProjectType", type);
};
export const generateStatus = () => {
  const statuses = ["active", "on-hold", "completed", "cancelled"];
  const generatedStatus = statuses[Math.floor(Math.random() * statuses.length)];
  return handleError("generateStatus", generatedStatus);
};

export const generateRole = (roleName) => {
  const name = generateName();
  const role = {
    hasRole: true,
    details: {
      companyName: `${name} ${roleName}`,
      contactName: name,
      address: generateAddress(),
      phone: generatePhone(),
      email: generateEmail(name),
    },
  };
  return handleError("generateRole", role);
};

const handleError = (funcName, returnVal) => {
  if (returnVal === undefined || returnVal === null) {
    throw new Error(`‼️ ${funcName} returned undefined or null`);
  }
  return returnVal;
};

// NOTE: use in some of the above
export const randint = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
///////

//  NOT USED ANYWHERE random profiles
// export const generateRandomProfiles = (count = 10) => {
//   console.log(`✳️ Generating ${count} random profiles...`);

//   const businessTypes = ["Individual", "Company", "Partnership"];
//   const firstNames = [
//     "John",
//     "Jane",
//     "Michael",
//     "Sarah",
//     "David",
//     "Lisa",
//     "Robert",
//     "Emma",
//     "James",
//     "Amanda",
//   ];
//   const lastNames = [
//     "Smith",
//     "Johnson",
//     "Williams",
//     "Brown",
//     "Jones",
//     "Garcia",
//     "Miller",
//     "Davis",
//     "Rodriguez",
//     "Martinez",
//   ];
//   const streets = [
//     "Main St",
//     "Oak Ave",
//     "Pine Rd",
//     "Cedar Ln",
//     "Elm St",
//     "Maple Ave",
//     "Birch Rd",
//     "Spruce Ln",
//   ];
//   const cities = [
//     "Melbourne",
//     "Sydney",
//     "Brisbane",
//     "Perth",
//     "Adelaide",
//     "Hobart",
//     "Darwin",
//     "Canberra",
//   ];
//   const states = ["VIC", "NSW", "QLD", "WA", "SA", "TAS", "NT", "ACT"];

//   const createdProfiles = [];

//   for (let i = 0; i < count; i++) {
//     const businessType = businessTypes[Math.floor(Math.random() * businessTypes.length)];
//     const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
//     const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
//     const fullName = `${firstName} ${lastName}`;
//     const street = streets[Math.floor(Math.random() * streets.length)];
//     const city = cities[Math.floor(Math.random() * cities.length)];
//     const state = states[Math.floor(Math.random() * states.length)];
//     const postcode = Math.floor(Math.random() * 9000) + 1000;

//     const profileData = {
//       userId: generateRandomUserId(),
//       email: generateRandomEmail(fullName),
//       profileData: {
//         fullName,
//         address: `${Math.floor(Math.random() * 999) + 1} ${street}, ${city} ${state} ${postcode}`,
//         phoneNumber: generateRandomPhone(),
//         businessType,
//         logo: null,
//       },
//       profileSetupComplete: Math.random() > 0.2, // 80% complete
//     };

//     // adds business type specific fields
//     if (businessType === "Individual") {
//       profileData.profileData.abn = generateRandomABN();
//       profileData.profileData.brn = `BRN-IND-${Math.floor(Math.random() * 1000)}`;
//     } else if (businessType === "Company") {
//       profileData.profileData.companyDetails = {
//         companyName: `${fullName} Pty Ltd`,
//         acn: generateRandomACN(),
//       };
//     } else if (businessType === "Partnership") {
//       const partnerCount = Math.floor(Math.random() * 3) + 2; // 2-4 partners
//       profileData.profileData.numberOfPartners = partnerCount.toString();
//       profileData.profileData.partners = [];

//       for (let j = 0; j < partnerCount; j++) {
//         const partnerName = `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`;
//         const partnerStreet = streets[Math.floor(Math.random() * streets.length)];
//         const partnerCity = cities[Math.floor(Math.random() * cities.length)];
//         const partnerState = states[Math.floor(Math.random() * states.length)];
//         const partnerPostcode = Math.floor(Math.random() * 9000) + 1000;

//         profileData.profileData.partners.push({
//           name: partnerName,
//           address: `${Math.floor(Math.random() * 999) + 1} ${partnerStreet}, ${partnerCity} ${partnerState} ${partnerPostcode}`,
//         });
//       }
//     }
//     createdProfiles.push(profileData);
//   }
//   return createdProfiles;
// };

//
