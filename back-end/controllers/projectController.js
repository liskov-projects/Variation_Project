import nodemailer from 'nodemailer';
import Project from '../models/projectModel.js';
import { config } from 'dotenv';

config();
// @desc    Get all projects for a user
// @route   GET /api/projects
// @access  Private
export const getUserProjects = async (req, res) => {
  try {
    const {userId}=req.params;

    if (req.auth.userId !== userId) {
      return res.status(403).json({
        message: 'Unauthorized: You can only access your own profile'
      });
    }

    const projects = await Project.find({userId}).sort({ createdAt: -1 });
    res.status(200).json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get a project by ID
// @route   GET /api/projects/:id
// @access  Private
export const getProjectById = async (req, res) => {
  try {
    const {projectId}=req.params;
    const project = await Project.findById(projectId);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    // Ensure user owns this project
    if (project.userId !== req.auth.userId) {
      return res.status(403).json({ message: 'Not authorized to access this project' });
    }
    
    res.status(200).json(project);
  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).json({
      message: 'Server error',
      error: error.message
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
        message: 'Unauthorized: You can only create projects for yourself'
      });
    }

    if (req.body._id === '') {
      delete req.body._id;
    }

    // Ensure contractPrice is provided
    if (!req.body.contractPrice) {
      return res.status(400).json({
        message: 'Contract price is required'
      });
    }

    // Create the project
    const newProject = Project(req.body);
    const savedProject = await newProject.save();
    
    res.status(201).json(savedProject);
  } catch (error) {
    console.error('Error creating project:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        message: 'Validation Error',
        errors: messages
      });
    }
    
    res.status(500).json({
      message: 'Server error',
      error: error.message
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
      return res.status(404).json({ message: 'Project not found' });
    }
    
    // Ensure user owns this project
    if (project.userId !== req.auth.userId) {
      return res.status(403).json({ message: 'Not authorized to update this project' });
    }
    
    const updatedProject = await Project.findByIdAndUpdate(
      projectId,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    
    res.status(200).json(updatedProject);
  } catch (error) {
    console.error('Error updating project:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        message: 'Validation Error',
        errors: messages
      });
    }
    
    res.status(500).json({
      message: 'Server error',
      error: error.message
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
      return res.status(404).json({ message: 'Project not found' });
    }
    
    // Ensure user owns this project
    if (project.userId !== req.auth.userId) {
      return res.status(403).json({ message: 'Not authorized to delete this project' });
    }
    
    // Remove project reference from profile
    // await Profile.findOneAndUpdate(
    //   { userId: req.auth.userId },
    //   { $pull: { projects: req.params.id } }
    // );
    
    await Project.findByIdAndDelete(projectId);
    
    res.status(200).json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({
      message: 'Server error',
      error: error.message
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
      return res.status(404).json({ message: 'Project not found' });
    }
    
    // Ensure user owns this project
    if (project.userId !== req.auth.userId) {
      return res.status(403).json({ message: 'Not authorized to update this project' });
    }
    
    // Add variation to project
    project.variations.push(req.body);
    
    // The pre-save middleware will automatically calculate the new contract price
    const updatedProject = await project.save();
    
    res.status(201).json(updatedProject);
  } catch (error) {
    console.error('Error adding variation:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        message: 'Validation Error',
        errors: messages
      });
    }
    
    res.status(500).json({
      message: 'Server error',
      error: error.message
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
        message: 'Project not found'
      });
    }

    // Check if the request user ID matches the project's userId
    if (req.auth.userId !== project.userId) {
      return res.status(403).json({
        message: 'Unauthorized: You can only update variations in your own projects'
      });
    }

    // Find the variation index
    const variationIndex = project.variations.findIndex(
      v => v._id.toString() === variationId
    );

    if (variationIndex === -1) {
      return res.status(404).json({
        message: 'Variation not found'
      });
    }

    // Update the variation
    Object.keys(req.body).forEach(key => {
      project.variations[variationIndex][key] = req.body[key];
    });

    // The pre-save middleware will automatically recalculate the contract price
    const updatedProject = await project.save();

    res.status(200).json(updatedProject);
  } catch (error) {
    console.error('Error updating variation:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        message: 'Validation Error',
        errors: messages
      });
    }
    
    res.status(500).json({
      message: 'Server error',
      error: error.message
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
        message: 'Project not found'
      });
    }

    // Check if the request user ID matches the project's userId
    if (req.auth.userId !== project.userId) {
      return res.status(403).json({
        message: 'Unauthorized: You can only delete variations from your own projects'
      });
    }

    // Remove the variation
    project.variations = project.variations.filter(
      v => v._id.toString() !== variationId
    );

    // The pre-save middleware will automatically recalculate the contract price
    const updatedProject = await project.save();

    res.status(200).json(updatedProject);
  } catch (error) {
    console.error('Error deleting variation:', error);
    res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
};

export const sendForSignature = async (req, res) => {
  try {
    console.log("sending email starts")
    const { projectId, variationId } = req.params;
    
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    
    if (req.auth.userId !== project.userId) {
      return res.status(403).json({
        message: 'Unauthorized: You can only send variations from your own projects'
      });
    }

    const variation = project.variations.find(v => v._id.toString() === variationId);
    if (!variation) {
      return res.status(404).json({
        message: 'Variation not found'
      });
    }
    
    // Fix: Change 'Draft' to 'draft' to match your enum
    if (variation.status !== 'draft') {
      return res.status(400).json({ 
        error: 'Variation has already been submitted or processed' 
      });
    }

    // Generate a unique signature token and expiration date
    const signatureToken = Math.random().toString(36).substr(2); // Better token generation
    const signatureTokenExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    variation.signatureToken = signatureToken;
    variation.signatureTokenExpiresAt = signatureTokenExpiresAt;
    variation.status = 'submitted'; // Update status to submitted
    
    await project.save();

    // send the mail
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.VARIATION_EMAIL,
        pass: process.env.VARIATION_PASSWORD
      }
    });

    // Calculate proper contract price for email
    const currentContractPrice = project.currentContractPrice || project.contractPrice || 0;
    const newContractPrice = currentContractPrice + (variation.cost || 0);

    // Use environment-specific URL
    const signatureUrl = process.env.NODE_ENV === 'production'
      ? `https://variation-front-end.onrender.com/signature?token=${signatureToken}`
      : `http://localhost:3000/signature?token=${signatureToken}`;

    const mailOptions = {
      from: process.env.VARIATION_EMAIL,
      to: project.clientEmail,
      subject: `Signature Request for Variation for the project ${project.projectName}`, 
      html: `
        <p>Dear ${project.clientName},</p>
        <p>Please review and sign the variation for your project:</p>
        <p><strong>${variation.description}</strong></p>
        <p><strong>Original Contract Price:</strong> $${project.contractPrice.toLocaleString()}</p>
        <p><strong>Variation Cost:</strong> $${variation.cost.toLocaleString()}</p>
        <p><strong>New Contract Price:</strong> $${newContractPrice.toLocaleString()}</p>
        <p>Click the link below to view and sign:</p>
        <a href="${signatureUrl}">${signatureUrl}</a>
        <p>This link will expire in 24 hours.</p>
        <p>Thank you!</p>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log("email sent successfully");
    
    // Return the updated project with the new status
    res.status(200).json({ 
      success: true, 
      message: 'Email sent successfully',
      project: project 
    });

  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
};

export const validateSignatureToken = async (req, res) => {
  try {
    const { token } = req.query;
    console.log('Token received:', token);

    const result = await Project.findVariationByToken(token);
    if (!result) {
      console.log('No result found for token:', token);
      return res.status(404).json({ message: 'Invalid or expired variation' });
    }

    const { project, variation } = result;
    console.log('Project and variation found:', { project, variation });

    res.status(200).json({ success: true, project, variation });
  } catch (error) {
    console.error('Error validating token:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
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
        message: 'Token and signedBy.name are required'
      });
    }

    // Find the variation by token
    const result = await Project.findVariationByToken(token);
    if (!result) {
      return res.status(404).json({ 
        message: 'Invalid or expired signature token' 
      });
    }

    const { project, variation } = result;

    // Check if already signed
    if (variation.status === 'approved') {
      return res.status(400).json({
        message: 'This variation has already been signed and approved'
      });
    }

    // Check if variation is in submitted status
    if (variation.status !== 'submitted') {
      return res.status(400).json({
        message: 'This variation is not ready for signature'
      });
    }

    // Get client IP address
    const ipAddress = req.ip || 
                     req.connection.remoteAddress || 
                     req.socket.remoteAddress ||
                     (req.connection.socket ? req.connection.socket.remoteAddress : '');

    // Update variation with signature
    variation.signedBy = {
      name: signedBy.name,
      email: project.clientEmail, // Get email from project
      ipAddress: ipAddress,
      userAgent: signedBy.userAgent || req.get('User-Agent')
    };
    
    variation.signedAt = new Date();
    variation.status = 'approved';
    
    // Clear the signature token since it's no longer needed
    variation.signatureToken = undefined;
    variation.signatureTokenExpiresAt = undefined;

    // Save the project (this will trigger the pre-save middleware to recalculate contract price)
    await project.save();

    // Send confirmation email to both client and project owner
    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.VARIATION_EMAIL,
          pass: process.env.VARIATION_PASSWORD
        }
      });

      // Email to client
      const clientMailOptions = {
        from: process.env.VARIATION_EMAIL,
        to: project.clientEmail,
        subject: `Variation Approved - ${project.projectName}`,
        html: `
          <p>Dear ${project.clientName},</p>
          <p>Thank you for approving the variation for your project:</p>
          <p><strong>Project:</strong> ${project.projectName}</p>
          <p><strong>Variation:</strong> ${variation.description}</p>
          <p><strong>Signed by:</strong> ${variation.signedBy.name}</p>
          <p><strong>Signed on:</strong> ${new Date(variation.signedAt).toLocaleString()}</p>
          <p>Your updated contract price is now $${project.currentContractPrice.toLocaleString()}</p>
          <p>Best regards</p>
        `
      };

      await transporter.sendMail(clientMailOptions);
      console.log("Confirmation email sent to client");
    } catch (emailError) {
      console.error('Error sending confirmation email:', emailError);
      // Don't fail the request if email fails
    }

    res.status(200).json({
      success: true,
      message: 'Variation signed and approved successfully',
      project: project,
      variation: variation
    });

  } catch (error) {
    console.error('Error signing variation:', error);
    res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
};