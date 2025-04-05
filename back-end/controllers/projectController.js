// controllers/projectController.js
import Project from '../models/projectModel.js';

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