import React, { createContext, useState, useContext, useEffect, Children } from 'react';
import { useAuth } from '@clerk/clerk-react';
import axios from 'axios';

const ProjectContext = createContext();

const useProject = ()=> useContext(ProjectContext);

export const ProjectProvider = ({children})=>{
    const { userId, getToken, isSignedIn } = useAuth();
    const [projects,setProjects]=useState([]);
    const [currentProject,setCurrentProject]=useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchProjects = async ()=>{
        if (!isSignedIn || !userId) return;

        setLoading(true);
        try {
            const token = await getToken();
            const response = await axios.get(`/api/projects/${userId}`,{
                headers:{Authorization: `Bearer ${token}`}
            });
            if (response.data){
                setProjects(response.data)
            }
        } catch (error) {
            setError('Failed to load projects');
            console.error('Error fetching projects:', err);
          } finally {
            setLoading(false);
          }
    }

    const fetchProject = async(projectId)=>{
        if (!isSignedIn || !userId || !projectId) return;
        setLoading(true);
    try {
      const token = await getToken();
      const response = await axios.get(`/api/projects/${projectId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCurrentProject(response.data);
    } catch (err) {
      setError('Failed to load project');
      console.error('Error fetching project:', err);
    } finally {
      setLoading(false);
    }
    }

    const createProject = async(projectData)=>{
        if (!userId) return { success: false, error: 'User not authenticated' };

    }

}