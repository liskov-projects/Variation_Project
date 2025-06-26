import nodemailer from "nodemailer";
import Project from "../models/projectModel.js";
import { config } from "dotenv";

config();

// @desc    Get all projects for a user
// @route   GET /api/projects
// @access  Private
export const getUserProjects = async (req, res) => {
  try {
    const { userId } = req.params;

    if (req.auth.userId !== userId) {
      return res.status(403).json({
        message: "Unauthorized: You can only access your own profile",
      });
    }

    const projects = await Project.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json(projects);
  } catch (error) {
    console.error("Error fetching projects:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// @desc    Get a project by ID
// @route   GET /api/projects/:id
// @access  Private
export const getProjectById = async (req, res) => {
  try {
    const { projectId } = req.params;
    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Ensure user owns this project
    if (project.userId !== req.auth.userId) {
      return res.status(403).json({ message: "Not authorized to access this project" });
    }

    res.status(200).json(project);
  } catch (error) {
    console.error("Error fetching project:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// @desc    Create a new project
// @route   POST /api/projects
// @access  Private
export const createProject = async (req, res) => {
  try {
    const { userId } = req.body;
    // Check if the request user ID matches the body
    if (req.auth.userId !== userId) {
      return res.status(403).json({
        message: "Unauthorized: You can only create projects for yourself",
      });
    }

    if (req.body._id === "") {
      delete req.body._id;
    }

    // Ensure contractPrice is provided
    if (!req.body.contractPrice) {
      return res.status(400).json({
        message: "Contract price is required",
      });
    }

    // TASK 6: Handle date fields
    if (!req.body.originalEndDate) {
      // If originalEndDate not provided, use expectedEndDate or generate from startDate
      if (req.body.expectedEndDate) {
        req.body.originalEndDate = req.body.expectedEndDate;
      } else if (req.body.startDate) {
        // Default to 6 months from start date if no end date provided
        const startDate = new Date(req.body.startDate);
        const defaultEndDate = new Date(startDate);
        defaultEndDate.setMonth(defaultEndDate.getMonth() + 6);
        req.body.originalEndDate = defaultEndDate;
        req.body.expectedEndDate = defaultEndDate;
      }
    }

    // TASK 2 & 3: Validate architect and surveyor data
    if (req.body.architect?.hasArchitect && !req.body.architect.details?.contactName) {
      return res.status(400).json({
        message: 'Architect details are required when architect is engaged'
      });
    }

    // Surveyor validation - must answer the question
    if (req.body.surveyor?.hasSurveyor === undefined) {
      return res.status(400).json({
        message: 'Surveyor status must be specified (yes/no)'
      });
    }

    if (req.body.surveyor?.hasSurveyor && !req.body.surveyor.details?.contactName) {
      return res.status(400).json({
        message: 'Surveyor details are required when surveyor is engaged'
      });
    }

    // Create the project
    const newProject = new Project(req.body);
    const savedProject = await newProject.save();

    res.status(201).json(savedProject);
  } catch (error) {
    console.error("Error creating project:", error);

    // Handle validation errors
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        message: "Validation Error",
        errors: messages,
      });
    }

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// @desc    Update a project
// @route   PUT /api/projects/:id
// @access  Private
export const updateProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Ensure user owns this project
    if (project.userId !== req.auth.userId) {
      return res.status(403).json({ message: "Not authorized to update this project" });
    }

    // TASK 6: Handle totalDaysExtended updates
    if (req.body.totalDaysExtended !== undefined) {
      // The pre-save middleware will calculate currentEndDate
      req.body.totalDaysExtended = Number(req.body.totalDaysExtended);
    }
    
    const updatedProject = await Project.findByIdAndUpdate(
      projectId,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    res.status(200).json(updatedProject);
  } catch (error) {
    console.error("Error updating project:", error);

    // Handle validation errors
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        message: "Validation Error",
        errors: messages,
      });
    }

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// @desc    Delete a project
// @route   DELETE /api/projects/:id
// @access  Private
export const deleteProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Ensure user owns this project
    if (project.userId !== req.auth.userId) {
      return res.status(403).json({ message: "Not authorized to delete this project" });
    }
    
    await Project.findByIdAndDelete(projectId);

    res.status(200).json({ message: "Project deleted successfully" });
  } catch (error) {
    console.error("Error deleting project:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// @desc    Add a variation to a project
// @route   POST /api/projects/:id/variations
// @access  Private
export const addVariation = async (req, res) => {
  try {
    const { projectId } = req.params;
    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Ensure user owns this project
    if (project.userId !== req.auth.userId) {
      return res.status(403).json({ message: "Not authorized to update this project" });
    }

    // TASK 4 & 7: Handle GST breakdown and credit/debit variations
    const variationData = { ...req.body };

    // Validate variation type
    if (!variationData.variationType) {
      variationData.variationType = 'debit'; // Default to debit
    }

    // Validate and calculate GST breakdown
    if (variationData.costBreakdown) {
      const { subtotal, gstRate = 10 } = variationData.costBreakdown;
      
      if (!subtotal || subtotal < 0) {
        return res.status(400).json({
          message: 'Subtotal is required and must be positive'
        });
      }

      // Calculate GST amount
      const gstAmount = (subtotal * gstRate) / 100;
      const total = subtotal + gstAmount;

      variationData.costBreakdown = {
        subtotal: Number(subtotal),
        gstAmount: Number(gstAmount.toFixed(2)),
        gstRate: Number(gstRate),
        total: Number(total.toFixed(2))
      };

      // Set cost based on variation type
      variationData.cost = variationData.variationType === 'credit' 
        ? -Math.abs(variationData.costBreakdown.total)
        : variationData.costBreakdown.total;
    } else {
      // Backward compatibility - if no costBreakdown, create one from cost
      const cost = Math.abs(variationData.cost || 0);
      const gstRate = 10;
      const subtotal = cost / (1 + gstRate/100);
      const gstAmount = cost - subtotal;

      variationData.costBreakdown = {
        subtotal: Number(subtotal.toFixed(2)),
        gstAmount: Number(gstAmount.toFixed(2)),
        gstRate: gstRate,
        total: Number(cost.toFixed(2))
      };

      variationData.cost = variationData.variationType === 'credit' ? -cost : cost;
    }
    
    // Add variation to project
    project.variations.push(variationData);
    
    // The pre-save middleware will automatically calculate the new contract price
    const updatedProject = await project.save();

    res.status(201).json(updatedProject);
  } catch (error) {
    console.error("Error adding variation:", error);

    // Handle validation errors
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        message: "Validation Error",
        errors: messages,
      });
    }

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

export const updateVariation = async (req, res) => {
  try {
    const { projectId, variationId } = req.params;

    // Find project first to check ownership
    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    // Check if the request user ID matches the project's userId
    if (req.auth.userId !== project.userId) {
      return res.status(403).json({
        message: "Unauthorized: You can only update variations in your own projects",
      });
    }

    // Find the variation index
    const variationIndex = project.variations.findIndex((v) => v._id.toString() === variationId);

    if (variationIndex === -1) {
      return res.status(404).json({
        message: "Variation not found",
      });
    }

    // TASK 4 & 7: Handle GST breakdown updates
    const updateData = { ...req.body };

    // If costBreakdown is being updated, recalculate
    if (updateData.costBreakdown) {
      const { subtotal, gstRate = 10 } = updateData.costBreakdown;
      
      if (subtotal !== undefined && subtotal >= 0) {
        const gstAmount = (subtotal * gstRate) / 100;
        const total = subtotal + gstAmount;

        updateData.costBreakdown = {
          subtotal: Number(subtotal),
          gstAmount: Number(gstAmount.toFixed(2)),
          gstRate: Number(gstRate),
          total: Number(total.toFixed(2))
        };

        // Update cost based on variation type
        const variationType = updateData.variationType || project.variations[variationIndex].variationType;
        updateData.cost = variationType === 'credit' 
          ? -Math.abs(updateData.costBreakdown.total)
          : updateData.costBreakdown.total;
      }
    }

    // If variation type is being changed, recalculate cost
    if (updateData.variationType && updateData.variationType !== project.variations[variationIndex].variationType) {
      const currentCost = project.variations[variationIndex].costBreakdown?.total || Math.abs(project.variations[variationIndex].cost || 0);
      updateData.cost = updateData.variationType === 'credit' ? -Math.abs(currentCost) : Math.abs(currentCost);
    }

    // Update the variation
    Object.keys(updateData).forEach(key => {
      project.variations[variationIndex][key] = updateData[key];
    });

    // The pre-save middleware will automatically recalculate the contract price
    const updatedProject = await project.save();

    res.status(200).json(updatedProject);
  } catch (error) {
    console.error("Error updating variation:", error);

    // Handle validation errors
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        message: "Validation Error",
        errors: messages,
      });
    }

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// @desc    Delete variation
// @route   DELETE /api/projects/:projectId/variations/:variationId
// @access  Private
export const deleteVariation = async (req, res) => {
  try {
    const { projectId, variationId } = req.params;

    // Find project first to check ownership
    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    // Check if the request user ID matches the project's userId
    if (req.auth.userId !== project.userId) {
      return res.status(403).json({
        message: "Unauthorized: You can only delete variations from your own projects",
      });
    }

    // Remove the variation
    project.variations = project.variations.filter((v) => v._id.toString() !== variationId);

    // The pre-save middleware will automatically recalculate the contract price
    const updatedProject = await project.save();

    res.status(200).json(updatedProject);
  } catch (error) {
    console.error("Error deleting variation:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// UPDATED: Send variation for signature with new routing logic
export const sendForSignature = async (req, res) => {
  try {
    console.log("sending email starts");
    const { projectId, variationId } = req.params;

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (req.auth.userId !== project.userId) {
      return res.status(403).json({
        message: "Unauthorized: You can only send variations from your own projects",
      });
    }

    const variation = project.variations.find((v) => v._id.toString() === variationId);
    if (!variation) {
      return res.status(404).json({
        message: "Variation not found",
      });
    }
    
    if (variation.status !== 'draft') {
      return res.status(400).json({ 
        error: 'Variation has already been submitted or processed' 
      });
    }

    // Generate signature token
    const signatureToken = Math.random().toString(36).substr(2) + Date.now().toString(36);
    const signatureTokenExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    variation.signatureToken = signatureToken;
    variation.signatureTokenExpiresAt = signatureTokenExpiresAt;
    variation.status = 'submitted';
    
    await project.save();

    // BUSINESS LOGIC: Determine recipient using new routing logic
    const recipient = project.getVariationRecipient();
    
    // Check if surveyor sign-off is required
    const requiresSurveyor = project.requiresSurveyorSignoff(variation);
    const surveyorInfo = requiresSurveyor ? project.getSurveyorForSignoff() : null;

    // Email configuration
    const transporter = nodemailer.createTransporter({
      service: 'gmail',
      auth: {
        user: process.env.VARIATION_EMAIL,
        pass: process.env.VARIATION_PASSWORD,
      },
    });

    // Calculate contract prices
    const currentContractPrice = project.currentContractPrice || project.contractPrice || 0;
    const variationCost = variation.cost || 0;
    const newContractPrice = currentContractPrice + variationCost;

    // Format currency
    const formatCurrency = (amount) => `$${Math.abs(amount).toLocaleString()}`;
    const variationCostDisplay = variation.variationType === 'credit' 
      ? `(${formatCurrency(variationCost)}) Credit` 
      : formatCurrency(variationCost);

    // Environment-specific URL
    const signatureUrl = process.env.NODE_ENV === 'production'
      ? `https://variation-front-end.onrender.com/signature?token=${signatureToken}`
      : `http://localhost:3000/signature?token=${signatureToken}`;

    // Determine email recipient and customize message
    let recipientEmail = recipient.email;
    let recipientName = recipient.name;
    let recipientMessage = '';

    if (recipient.type === 'architect') {
      recipientMessage = `
        <p><strong>Note:</strong> This variation is being sent to you as the project architect. Please review and coordinate with the client as needed.</p>
        <p><strong>Client:</strong> ${project.clientName} (${project.clientEmail})</p>
      `;
    }

    // Add surveyor notification if required
    let surveyorMessage = '';
    if (requiresSurveyor && surveyorInfo) {
      surveyorMessage = `
        <p><strong>Important:</strong> This is a permit variation that requires surveyor approval.</p>
        <p><strong>Surveyor:</strong> ${surveyorInfo.name} (${surveyorInfo.email}) will need to sign off on this variation.</p>
      `;
    }

    // Main email to recipient (architect or owner)
    const mailOptions = {
      from: process.env.VARIATION_EMAIL,
      to: recipientEmail,
      subject: `Signature Request for ${variation.variationType === 'credit' ? 'Credit' : ''} Variation - ${project.projectName}`, 
      html: `
        <p>Dear ${recipientName},</p>
        ${recipientMessage}
        <p>Please review and sign the ${variation.variationType} variation for project:</p>
        <p><strong>Project:</strong> ${project.projectName}</p>
        <p><strong>Property:</strong> ${project.propertyAddress}</p>
        <p><strong>Variation:</strong> ${variation.description}</p>
        <p><strong>Reason:</strong> ${variation.reason}</p>
        
        <h3>Financial Impact:</h3>
        <p><strong>Original Contract Price:</strong> ${formatCurrency(project.contractPrice)}</p>
        <p><strong>Variation ${variation.variationType === 'credit' ? 'Credit' : 'Cost'}:</strong> ${variationCostDisplay}</p>
        ${variation.costBreakdown ? `
        <p><strong>Subtotal:</strong> ${formatCurrency(variation.costBreakdown.subtotal)}</p>
        <p><strong>GST (${variation.costBreakdown.gstRate}%):</strong> ${formatCurrency(variation.costBreakdown.gstAmount)}</p>
        ` : ''}
        <p><strong>New Contract Price:</strong> ${formatCurrency(newContractPrice)}</p>
        
        ${surveyorMessage}
        
        <p>Click the link below to view and sign:</p>
        <a href="${signatureUrl}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Review and Sign Variation</a>
        <p>Or copy this link: ${signatureUrl}</p>
        <p>This link will expire in 24 hours.</p>
        <p>Thank you!</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    // Send notification to surveyor if required
    if (requiresSurveyor && surveyorInfo) {
      const surveyorMailOptions = {
        from: process.env.VARIATION_EMAIL,
        to: surveyorInfo.email,
        subject: `Surveyor Sign-off Required - Permit Variation - ${project.projectName}`,
        html: `
          <p>Dear ${surveyorInfo.name},</p>
          <p>A permit variation requires your sign-off for the following project:</p>
          <p><strong>Project:</strong> ${project.projectName}</p>
          <p><strong>Property:</strong> ${project.propertyAddress}</p>
          <p><strong>Variation:</strong> ${variation.description}</p>
          <p><strong>Client:</strong> ${project.clientName}</p>
          <p><strong>Primary Recipient:</strong> ${recipientName} (${recipientEmail})</p>
          
          <p>Please coordinate with the primary recipient and provide your professional sign-off as required.</p>
          
          <p>Variation details:</p>
          <p><strong>Effect:</strong> ${variation.effect}</p>
          <p><strong>Permit Variation:</strong> ${variation.permitVariation}</p>
          <p><strong>Delay:</strong> ${variation.delay}</p>
          
          <p>Thank you!</p>
        `
      };

      await transporter.sendMail(surveyorMailOptions);
    }

    console.log("email sent successfully");
    
    res.status(200).json({ 
      success: true, 
      message: 'Email sent successfully',
      recipient: recipient,
      requiresSurveyorSignoff: requiresSurveyor,
      surveyorNotified: requiresSurveyor && surveyorInfo ? true : false,
      project: project 
    });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

export const validateSignatureToken = async (req, res) => {
  try {
    const { token } = req.query;
    console.log("Token received:", token);

    const result = await Project.findVariationByToken(token);
    if (!result) {
      console.log("No result found for token:", token);
      return res.status(404).json({ message: "Invalid or expired variation" });
    }

    const { project, variation } = result;
    console.log("Project and variation found:", { project, variation });

    // Get recipient info for the signature page
    const recipient = project.getVariationRecipient();
    const requiresSurveyorSignoff = project.requiresSurveyorSignoff(variation);

    res.status(200).json({ 
      success: true, 
      project, 
      variation,
      recipient,
      requiresSurveyorSignoff
    });
  } catch (error) {
    console.error("Error validating token:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Sign variation with digital signature
// @route   POST /api/projects/variations/sign
// @access  Public (token-based)
export const signVariation = async (req, res) => {
  try {
    const { token, signedBy } = req.body;

    if (!token || !signedBy || !signedBy.name) {
      return res.status(400).json({
        message: "Token and signedBy.name are required",
      });
    }

    // Find the variation by token
    const result = await Project.findVariationByToken(token);
    if (!result) {
      return res.status(404).json({
        message: "Invalid or expired signature token",
      });
    }

    const { project, variation } = result;

    // Check if already signed
    if (variation.status === "approved") {
      return res.status(400).json({
        message: "This variation has already been signed and approved",
      });
    }

    // Check if variation is in submitted status
    if (variation.status !== "submitted") {
      return res.status(400).json({
        message: "This variation is not ready for signature",
      });
    }

    // Get client IP address
    const ipAddress =
      req.ip ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      (req.connection.socket ? req.connection.socket.remoteAddress : "");

    // Determine who signed (architect or owner)
    const recipient = project.getVariationRecipient();

    // Update variation with signature
    variation.signedBy = {
      name: signedBy.name,
      email: recipient.email,
      ipAddress: ipAddress,
      userAgent: signedBy.userAgent || req.get("User-Agent"),
    };

    variation.signedAt = new Date();
    variation.status = "approved";

    // Clear the signature token since it's no longer needed
    variation.signatureToken = undefined;
    variation.signatureTokenExpiresAt = undefined;

    // Save the project (this will trigger the pre-save middleware to recalculate contract price)
    await project.save();

    // Send confirmation emails
    try {
      const transporter = nodemailer.createTransporter({
        service: 'gmail',
        auth: {
          user: process.env.VARIATION_EMAIL,
          pass: process.env.VARIATION_PASSWORD,
        },
      });

      const formatCurrency = (amount) => `$${Math.abs(amount).toLocaleString()}`;
      const variationCostDisplay = variation.variationType === 'credit' 
        ? `(${formatCurrency(variation.cost)}) Credit` 
        : formatCurrency(variation.cost);

      // Email to the person who signed
      const signerMailOptions = {
        from: process.env.VARIATION_EMAIL,
        to: recipient.email,
        subject: `Variation Approved - ${project.projectName}`,
        html: `
          <p>Dear ${signedBy.name},</p>
          <p>Thank you for approving the ${variation.variationType} variation for project:</p>
          <p><strong>Project:</strong> ${project.projectName}</p>
          <p><strong>Variation:</strong> ${variation.description}</p>
          <p><strong>Variation ${variation.variationType === 'credit' ? 'Credit' : 'Cost'}:</strong> ${variationCostDisplay}</p>
          <p><strong>Signed by:</strong> ${variation.signedBy.name}</p>
          <p><strong>Signed on:</strong> ${new Date(variation.signedAt).toLocaleString()}</p>
          <p>Your updated contract price is now ${formatCurrency(project.currentContractPrice)}</p>
          <p>Best regards</p>
        `
      };

      await transporter.sendMail(signerMailOptions);

      // If architect signed, also notify the client
      if (recipient.type === 'architect') {
        const clientMailOptions = {
          from: process.env.VARIATION_EMAIL,
          to: project.clientEmail,
          subject: `Variation Approved by Architect - ${project.projectName}`,
          html: `
            <p>Dear ${project.clientName},</p>
            <p>Your architect has approved a ${variation.variationType} variation for your project:</p>
            <p><strong>Project:</strong> ${project.projectName}</p>
            <p><strong>Variation:</strong> ${variation.description}</p>
            <p><strong>Variation ${variation.variationType === 'credit' ? 'Credit' : 'Cost'}:</strong> ${variationCostDisplay}</p>
            <p><strong>Approved by:</strong> ${variation.signedBy.name} (${recipient.company})</p>
            <p><strong>Approved on:</strong> ${new Date(variation.signedAt).toLocaleString()}</p>
            <p>Your updated contract price is now ${formatCurrency(project.currentContractPrice)}</p>
            <p>Best regards</p>
          `
        };

        await transporter.sendMail(clientMailOptions);
      }

      console.log("Confirmation emails sent");
    } catch (emailError) {
      console.error("Error sending confirmation email:", emailError);
      // Don't fail the request if email fails
    }

    res.status(200).json({
      success: true,
      message: "Variation signed and approved successfully",
      project: project,
      variation: variation,
      signedBy: recipient
    });
  } catch (error) {
    console.error("Error signing variation:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};
