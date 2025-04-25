import React, { createContext, useState, useContext, useEffect,useCallback } from 'react';
import { useAuth } from '@clerk/clerk-react';
import axios from 'axios';
import { createEmptyProject, createEmptyVariation } from '../models/ProjectModel';
import API_BASE_URL from '../api';
const ProjectContext = createContext();

export const useProject = ()=> useContext(ProjectContext);

export const ProjectProvider = ({children})=>{
    const { userId, getToken, isSignedIn } = useAuth();
    const [projects,setProjects]=useState([]);
    const [currentProject,setCurrentProject]=useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchProjects = useCallback(async ()=>{
        if (!isSignedIn || !userId) return;

        setLoading(true);
        setError(null);

        try {
            const token = await getToken();
            const response = await axios.get(`${API_BASE_URL}/api/projects/user/${userId}`,{
                headers:{Authorization: `Bearer ${token}`}
            });
            if (response.data){
                setProjects(response.data)
            }
        } catch (err) {
            setError('Failed to load projects');
            console.error('Error fetching projects:', err);
          } finally {
            setLoading(false);
          }
    }, [userId, isSignedIn, getToken])

    const fetchProjectById = async (projectId) => {
      if (!isSignedIn || !userId) return null;
      
      setLoading(true);
      setError(null);
      
      try {
        const token = await getToken();
        const response = await axios.get(`${API_BASE_URL}/api/projects/${projectId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        // Only update if the data is different to avoid unnecessary re-renders
        if (!currentProject || currentProject._id !== response.data._id) {
          setCurrentProject(response.data);
        }
        
        return response.data;
      } catch (err) {
        setError('Failed to load project details');
        console.error('Error fetching project:', err);
        return null;
      } finally {
        setLoading(false);
      }
    };

    const createProject = async(projectData)=>{
        if (!isSignedIn || !userId) return { success: false, error: 'User not authenticated' };
        setLoading(true);
        setError(null);

        try {
          const token = await getToken();
          const response = await axios.post(`${API_BASE_URL}/api/projects/`,{
            ...projectData, userId
          },
          {headers: { Authorization: `Bearer ${token}` }
        })
        setProjects(prev=>[...prev,response.data])
        return { success: true, data: response.data };
        } catch (err) {
          const errorMessage = err.response?.data?.message || err.message || 'Failed to create project';
          setError(errorMessage);
          return { success: false, error: errorMessage };
        } finally{
          setLoading(false)
        }
    }

    const updateProject = async (projectId,projectData)=>{
      if (!isSignedIn || !userId) return { success: false, error: 'User not authenticated' };
      setLoading(true);
      setError(null);

      try {
        const token = await getToken();
        const response = await axios.put(`${API_BASE_URL}/api/projects/${projectId}`,projectData,{
          headers:{Authorization:`Bearer ${token}`}
        })

        // TODO: Understand the usage of .map here
        setProjects(prev=>prev.map(p=>p._id===projectId?response.data:p))
        
        if (currentProject && currentProject._id === projectId) {
          setCurrentProject(response.data);
        }
        
        return { success: true, data: response.data }; 
      } catch (err) {
        const errorMessage = err.response?.data?.message || err.message || 'Failed to update project';
        setError(errorMessage);
        return { success: false, error: errorMessage };
      } finally{
        setLoading(false)
      }
    }

    // TODO: check while deleting the project if the variations inside it is deleted as well
    const deleteProject = async (projectId)=>{
      if (!isSignedIn || !userId) return { success: false, error: 'User not authenticated' };
      setLoading(true);
      setError(null);
      try {
        const token = await getToken();
        const response = await axios.delete(`${API_BASE_URL}/api/projects/${projectId}`,{
          headers:{Authorization:`Bearer ${token}`}
        })

        setProjects(prev=>prev.filter(p=>p._id!=projectId))
        if (currentProject && currentProject._id === projectId) {
          setCurrentProject(null);
        }
        
        return { success: true };
      } catch (err) {
        const errorMessage = err.response?.data?.message || err.message || 'Failed to delete project';
        setError(errorMessage);
        return { success: false, error: errorMessage };
      } finally {
        setLoading(false);
      }
    }

    // TODO: get all variations for a specific project
    const addVariation = async (projectId, variationData)=>{
      if (!isSignedIn || !userId) return { success: false, error: 'User not authenticated' };
      setLoading(true);
      setError(null);
      try {
        const token = await getToken();
        const response = await axios.post(`${API_BASE_URL}/api/projects/${projectId}/variations`,variationData,{
          headers:{Authorization: `Bearer ${token}`}
        });
          // Update current project with the new variation
        if (currentProject && currentProject._id === projectId) {
          setCurrentProject(response.data);
        }
        
        // Update the project in the projects list
        setProjects(prev => prev.map(p => p._id === projectId ? response.data : p));
        
        return { success: true, data: response.data };
      } catch (err) {
        const errorMessage = err.response?.data?.message || err.message || 'Failed to add variation';
      setError(errorMessage);
      return { success: false, error: errorMessage };
      } finally {
        setLoading(false);
      }
    }

    const updateVariation = async (projectId, variationId, variationData)=>{
      if (!isSignedIn || !userId) return { success: false, error: 'User not authenticated' };
      setLoading(true);
      setError(null);

      try {
        const token = await getToken();
        const response = await axios.put(`${API_BASE_URL}/api/projects/${projectId}/variations/${variationId}`,variationData,{
          headers:{Authorization: `Bearer ${token}`}
        });
        if (currentProject && currentProject._id === projectId) {
          setCurrentProject(response.data);
        }
        // Update the project in the projects list
      setProjects(prev => prev.map(p => p._id === projectId ? response.data : p));
      
      return { success: true, data: response.data };
      } catch (err) {
        const errorMessage = err.response?.data?.message || err.message || 'Failed to update variation';
      setError(errorMessage);
      return { success: false, error: errorMessage };
      } finally {
        setLoading(false);
      }
    }

    const deleteVariation = async (projectId, variationId)=>{
      if (!isSignedIn || !userId) return { success: false, error: 'User not authenticated' };
      setLoading(true);
      setError(null);

      try {
        const token = await getToken();
        const response = await axios.delete(`${API_BASE_URL}/api/projects/${projectId}/variations/${variationId}`,{
          headers:{Authorization:`Bearer ${token}`}
        })

        setProjects(prev=>prev.filter(p=>p._id!=projectId))
        if (currentProject && currentProject._id === projectId) {
          setCurrentProject(null);
        }
        
        return { success: true, data: response.data  };
      } catch (err) {
        const errorMessage = err.response?.data?.message || err.message || 'Failed to delete variation';
      setError(errorMessage);
      return { success: false, error: errorMessage };
      } finally {
        setLoading(false);
      }
    }

    const sendForSignature=async(projectId,variationId,variationData,clientEmail)=>{
      if (!isSignedIn || !userId) return { success: false, error: 'User not authenticated' };
      setLoading(true);
      setError(null);

      try {
        const token = await getToken();
        const response = await axios.post(`${API_BASE_URL}/api/projects/${projectId}/variations/${variationId}/send-for-signature`,variationData,clientEmail,{
          headers:{Authorization:`Bearer ${token}`}
        });
        return { success: true, data: response.data };

      } catch (error) {
        const errorMessage = err.response?.data?.message || err.message || 'Failed to send the variation for approval';
        setError(errorMessage);
        return { success: false, error: errorMessage };
      } finally{
        setLoading(false);
      }
    }

      // Load user's projects on init
      useEffect(() => {
        if (isSignedIn && userId) {
          fetchProjects();
        }
      }, [isSignedIn, userId]);
      
      const value={
        projects,
        currentProject,
        loading,
        error,
        fetchProjects,
        createProject,
        fetchProjectById,
        updateProject,
        deleteProject,
        addVariation,
        updateVariation,
        deleteVariation,
        setCurrentProject,
        sendForSignature,
      createEmptyProject,
      createEmptyVariation
      }

      return (
        <ProjectContext.Provider value={value}>
          {children}
        </ProjectContext.Provider>
      );
};
export default ProjectContext;
