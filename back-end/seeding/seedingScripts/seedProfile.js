import { config } from "dotenv";
import {
  generateUserId,
  generateBuildingNumber,
  generateStreet,
  generateCity,
  generateState,
  generatePostcode,
  generateBusinessType,
  generateABN,
  generateACN,
  generatePhone,
  generateName,
} from "../helpers.js";

config();

const profileName = process.env.PROFILE_NAME;
const profileEmail = process.env.PROFILE_EMAIL;
const profileId = process.env.PROFILE_ID;
// const clientName = process.env.CLIENT_NAME;
// const clientEmail = process.env.CLIENT_EMAIL;

// should be used like so: node motherSeed.js name email
//  will override .env
const clientName = process.argv[2]; //  'node'argv[0] '/app/seeding/fullSeed.js' argv[1]
const clientEmail = process.argv[3];
const clientId = process.argv[4];

export const setupProfileToSeed = async (
  username = clientName || profileName,
  email = clientEmail || profileEmail,
  id = clientId || profileId
) => {
  console.log(`✳️ Setting up profile for ${username}`);

  const createdProfile = {
    // NOTE: do we actually need this or mongo handles it?
    // userId: generateUserId(),
    userId: id,
    email: email,
    profileData: {
      fullName: username,
      address: `${generateBuildingNumber()} ${generateStreet()}, ${generateCity()} ${generateState()} ${generatePostcode()}`,
      phoneNumber: generatePhone(),
      businessType: generateBusinessType(),
      logo: null,
    },
    profileSetupComplete: Math.random() > 0.2, // 80% complete
  };

  // extracted to make condition more clear
  const { businessType, fullName } = createdProfile.profileData;

  // adds business type specific fields
  if (businessType === "Individual") {
    createdProfile.profileData.abn = generateABN();
    createdProfile.profileData.brn = `BRN-IND-${Math.floor(Math.random() * 1000)}`;
  } else if (businessType === "Company") {
    createdProfile.profileData.companyDetails = {
      companyName: `${fullName} Pty Ltd`,
      acn: generateACN(),
    };
  } else if (businessType === "Partnership") {
    const partnerCount = Math.floor(Math.random() * 3) + 2; // 2-4 partners
    createdProfile.profileData.numberOfPartners = partnerCount.toString();
    createdProfile.profileData.partners = [];

    for (let j = 0; j < partnerCount; j++) {
      const partnerName = generateName();
      const partnerStreet = generateStreet();
      const partnerCity = generateCity();
      const partnerState = generateState();
      const partnerPostcode = generatePostcode();

      createdProfile.profileData.partners.push({
        name: partnerName,
        address: `${Math.floor(Math.random() * 999) + 1} ${partnerStreet}, ${partnerCity} ${partnerState} ${partnerPostcode}`,
      });
    }
  }
  console.log("CREATED PROFILE", createdProfile);
  return createdProfile;
};

// makies sure we saved the new data to the DB
// const newProfile = setupProfileToSeed();
// const savedProfile = await Profile.create(newProfile);

// seeds projects for this exact user from savedProfile
// await generateRandomProjects(5, false, savedProfile.userId);
// await seedVariationsToProjects();
