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
        this.originalEndDate = data.originalEndDate || '';
        this.currentEndDate = data.currentEndDate || null;
        this.totalDaysExtended = data.totalDaysExtended || 0;
        this.status = data.status || 'active'; // active, on-hold, completed, cancelled
        this.contractPrice = data.contractPrice || 0;
        this.currentContractPrice = data.currentContractPrice || 0;
        this.variations = data.variations || [];
        this.userId = data.userId || '';
        this.createdAt = data.createdAt || new Date().toISOString();
        this.updatedAt = data.updatedAt || new Date().toISOString();
        
        // Architect/Project Manager - structured to match backend schema
        this.architect = data.architect || {
            hasArchitect: data.hasArchiectPm === "Yes" || data.hasArchiectPm === true || false,
            details: {
                companyName: data.architectPmCompanyName || "",
                contactName: data.architectPmContactName || "",
                address: data.architectPmAddress || "",
                phone: data.architectPmPhone || "",
                email: data.architectPmEmail || ""
            }
        };

        // Surveyor - structured to match backend schema
        this.surveyor = data.surveyor || {
            hasSurveyor: data.hasSurveyor !== undefined ? data.hasSurveyor : true, // Default to true as per backend
            details: {
                companyName: data.surveyorCompanyName || "",
                contactName: data.surveyorContactName || "",
                address: data.surveyorAddress || "",
                phone: data.surveyorPhone || "",
                email: data.surveyorEmail || ""
            }
        };

        // Legacy fields for backward compatibility (can be removed once frontend is updated)
        this.hasArchiectPm = this.architect.hasArchitect;
        this.architectPmCompanyName = this.architect.details.companyName;
        this.architectPmContactName = this.architect.details.contactName;
        this.architectPmAddress = this.architect.details.address;
        this.architectPmPhone = this.architect.details.phone;
        this.architectPmEmail = this.architect.details.email;
        
        this.hasSurveyor = this.surveyor.hasSurveyor;
        this.surveyorCompanyName = this.surveyor.details.companyName;
        this.surveyorContactName = this.surveyor.details.contactName;
        this.surveyorAddress = this.surveyor.details.address;
        this.surveyorPhone = this.surveyor.details.phone;
        this.surveyorEmail = this.surveyor.details.email;
    }

    // Helper method to get data in backend format
    toBackendFormat() {
        return {
            _id: this._id,
            projectName: this.projectName,
            propertyAddress: this.propertyAddress,
            description: this.description,
            clientName: this.clientName,
            clientEmail: this.clientEmail,
            clientPhone: this.clientPhone,
            startDate: this.startDate,
            expectedEndDate: this.expectedEndDate,
            originalEndDate: this.originalEndDate,
            currentEndDate: this.currentEndDate,
            totalDaysExtended: this.totalDaysExtended,
            status: this.status,
            contractPrice: this.contractPrice,
            currentContractPrice: this.currentContractPrice,
            variations: this.variations,
            userId: this.userId,
            architect: this.architect,
            surveyor: this.surveyor
        };
    }

    // Helper method to update architect data
    updateArchitect(hasArchitect, details = {}) {
        this.architect.hasArchitect = hasArchitect;
        if (hasArchitect) {
            this.architect.details = {
                companyName: details.companyName || "",
                contactName: details.contactName || "",
                address: details.address || "",
                phone: details.phone || "",
                email: details.email || ""
            };
        } else {
            this.architect.details = {
                companyName: "",
                contactName: "",
                address: "",
                phone: "",
                email: ""
            };
        }
        
        // Update legacy fields
        this.hasArchiectPm = this.architect.hasArchitect;
        this.architectPmCompanyName = this.architect.details.companyName;
        this.architectPmContactName = this.architect.details.contactName;
        this.architectPmAddress = this.architect.details.address;
        this.architectPmPhone = this.architect.details.phone;
        this.architectPmEmail = this.architect.details.email;
    }

    // Helper method to update surveyor data
    updateSurveyor(hasSurveyor, details = {}) {
        this.surveyor.hasSurveyor = hasSurveyor;
        if (hasSurveyor) {
            this.surveyor.details = {
                companyName: details.companyName || "",
                contactName: details.contactName || "",
                address: details.address || "",
                phone: details.phone || "",
                email: details.email || ""
            };
        } else {
            this.surveyor.details = {
                companyName: "",
                contactName: "",
                address: "",
                phone: "",
                email: ""
            };
        }
        
        // Update legacy fields
        this.hasSurveyor = this.surveyor.hasSurveyor;
        this.surveyorCompanyName = this.surveyor.details.companyName;
        this.surveyorContactName = this.surveyor.details.contactName;
        this.surveyorAddress = this.surveyor.details.address;
        this.surveyorPhone = this.surveyor.details.phone;
        this.surveyorEmail = this.surveyor.details.email;
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
        
        // Variation type and cost breakdown (updated to match backend)
        this.variationType = data.variationType || 'debit'; // 'debit' or 'credit'
        this.costBreakdown = data.costBreakdown || {
            subtotal: 0,
            gstAmount: 0,
            gstRate: 10,
            total: 0
        };
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

    // Helper method to calculate cost breakdown
    calculateCostBreakdown(subtotal, gstRate = 10) {
        const gstAmount = (subtotal * gstRate) / 100;
        const total = subtotal + gstAmount;
        
        this.costBreakdown = {
            subtotal: Number(subtotal),
            gstAmount: Number(gstAmount.toFixed(2)),
            gstRate: Number(gstRate),
            total: Number(total.toFixed(2))
        };

        // Set cost based on variation type
        this.cost = this.variationType === 'credit' 
            ? -Math.abs(this.costBreakdown.total)
            : this.costBreakdown.total;
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