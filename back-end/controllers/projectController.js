// controllers/projectController.js
import Project from '../models/projectModel.js';
import Profile from '../models/profileModel.js';

// @desc    Get all projects for a user
// @route   GET /api/projects
// @access  Private
export const getProjects = async (req, res) => {
  try {
    const projects = await Project.find({ userId: req.auth.userId });
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
    // Create the project
    const newProject = new Project({
      userId: req.auth.userId,
      ...req.body
    });
    
    const savedProject = await newProject.save();
    
    // Add reference to user's profile
    await Profile.findOneAndUpdate(
      { userId: req.auth.userId },
      { $push: { projects: savedProject._id } }
    );
    
    res.status(201).json(savedProject);
  } catch (error) {
    console.error('Error creating project:', error);
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
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    // Ensure user owns this project
    if (project.userId !== req.auth.userId) {
      return res.status(403).json({ message: 'Not authorized to update this project' });
    }
    
    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    res.status(200).json(updatedProject);
  } catch (error) {
    console.error('Error updating project:', error);
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
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    // Ensure user owns this project
    if (project.userId !== req.auth.userId) {
      return res.status(403).json({ message: 'Not authorized to delete this project' });
    }
    
    // Remove project reference from profile
    await Profile.findOneAndUpdate(
      { userId: req.auth.userId },
      { $pull: { projects: req.params.id } }
    );
    
    await Project.findByIdAndDelete(req.params.id);
    
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
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    // Ensure user owns this project
    if (project.userId !== req.auth.userId) {
      return res.status(403).json({ message: 'Not authorized to update this project' });
    }
    
    // Add variation to project
    project.variations.push(req.body);
    await project.save();
    
    res.status(201).json(project);
  } catch (error) {
    console.error('Error adding variation:', error);
    res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
};