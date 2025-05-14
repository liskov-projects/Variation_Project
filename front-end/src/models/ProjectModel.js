// This is a frontend model reference to help with consistent data handling
// It's not actually used for database operations (that's done on the backend)

export class Project {
    constructor(data = {}) {
        if (data._id) this._id = data._id;
      this.projectName = data.projectName || '';
      this.propertyAddress = data.propertyAddress || '';
      this.description = data.description || '';
      this.clientName = data.clientName || '';
      this.clientEmail = data.clientEmail || '';
      this.clientPhone = data.clientPhone || '';
      this.startDate = data.startDate || '';
      this.expectedEndDate = data.expectedEndDate || '';
      this.status = data.status || 'active'; // active, on-hold, completed, cancelled
      this.contractPrice = data.contractPrice || 0;
      this.variations = data.variations || [];
      this.userId = data.userId || '';
      this.createdAt = data.createdAt || new Date().toISOString();
      this.updatedAt = data.updatedAt || new Date().toISOString();
    }
  }
  
  export class Variation {
    constructor(data = {}) {
        if (data._id) this._id = data._id;
      this.description = data.description || '';
      this.reason = data.reason || '';
      this.effect = data.effect || '';
      this.permitVariation = data.permitVariation || '';
      this.delay = data.delay || '';
      this.cost = data.cost || 0;
      this.dateCreated = data.dateCreated || new Date().toISOString();
      this.status = data.status || 'draft'; // draft, submitted, approved, rejected
      
      // Signature-related fields
      this.signatureToken = data.signatureToken || null;
      this.signatureTokenExpiresAt = data.signatureTokenExpiresAt || null;
      this.signatureData = data.signatureData || null; // Base64 encoded signature image
      this.signedAt = data.signedAt || null;
      this.signedBy = data.signedBy || null; // Object with name, email, ipAddress, userAgent
      
      this.createdAt = data.createdAt || new Date().toISOString();
      this.updatedAt = data.updatedAt || new Date().toISOString();
    }
  }
  
  // Helper function to create a new empty project object
  export const createEmptyProject = () => {
    return new Project();
  };
  
  // Helper function to create a new empty variation object
  export const createEmptyVariation = () => {
    return new Variation();
  };