import './App.css';
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ClerkProvider, SignedIn, SignedOut } from '@clerk/clerk-react';
import { ProfileProvider } from './contexts/ProfileContext';
import { ProjectProvider } from './contexts/ProjectContext';

// Auth pages
import SignIn from './pages/Auth/SignIn';
import SignUp from './pages/Auth/SignUp';

// Main pages
import Welcome from './pages/Welcome';
import ProfileSetup from './pages/ProfileSetup';
import ProfileEdit from './pages/ProfileEdit';
import ProfileComplete from './pages/ProfileComplete';
import Dashboard from './pages/Dashboard';

// Project paths
import ProjectCreate from './pages/Projects/ProjectCreate';
import ProjectEdit from './pages/Projects/ProjectEdit';
import ProjectList from './pages/Projects/ProjectList';
import ProjectDetails from './pages/Projects/ProjectDetails';
import ProjectVariation from './pages/Projects/ProjectVariation';
import VariationCreate from './pages/Projects/VariationCreate';
import VariationEdit from './pages/Projects/VariationEdit';


// Home page (landing page for guests)
import Home from './pages/Home';

const PUBLISHABLE_KEY = process.env.REACT_APP_CLERK_PUBLISHABLE_KEY;

function PublicRoute({ children }) {
  return (
    <>
      <SignedIn>
        <Navigate to="/welcome" replace />
      </SignedIn>
      <SignedOut>{children}</SignedOut>
    </>
  );
}

function PrivateRoute({ children }) {
  return (
    <>
      <SignedIn>{children}</SignedIn>
      <SignedOut>
        <Navigate to="/sign-in" replace />
      </SignedOut>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
        <ProfileProvider>
          <ProjectProvider>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={
              <PublicRoute>
                <Home />
              </PublicRoute>
            } />
            <Route path="/sign-in" element={
              <PublicRoute>
                <SignIn />
              </PublicRoute>
            } />
            <Route path="/sign-up" element={
              <PublicRoute>
                <SignUp />
              </PublicRoute>
            } />

            {/* Protected routes */}
            <Route path="/welcome" element={
              <PrivateRoute>
                <Welcome />
              </PrivateRoute>
            } />
            <Route path="/profile-setup" element={
              <PrivateRoute>
                <ProfileSetup />
              </PrivateRoute>
            } />
            <Route path="/profile-edit" element={
              <PrivateRoute>
                <ProfileEdit />
              </PrivateRoute>
            } />
            <Route path="/profile-complete" element={
              <PrivateRoute>
                <ProfileComplete />
              </PrivateRoute>
            } />
            <Route path="/dashboard" element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            } />
            <Route path="/projects" element={
                <PrivateRoute>
                  <ProjectList />
                </PrivateRoute>
              } />
              <Route path="/projects/new" element={
                <PrivateRoute>
                  <ProjectCreate />
                </PrivateRoute>
              } />
              <Route path="/projects/:projectId" element={
                <PrivateRoute>
                  <ProjectDetails />
                </PrivateRoute>
              } />
              <Route path="/projects/:projectId/edit" element={
                <PrivateRoute>
                  <ProjectEdit />
                </PrivateRoute>
              } />
              <Route path="/projects/:projectId/variations/new" element={
                <PrivateRoute>
                  <VariationCreate />
                </PrivateRoute>
              } />
              <Route path="/projects/:projectId/variations/:variationId" element={
                <PrivateRoute>
                  <ProjectVariation />
                </PrivateRoute>
              } />
              <Route path="/projects/:projectId/variations/:variationId/edit" element={
                <PrivateRoute>
                  <VariationEdit />
                </PrivateRoute>
              } />

            {/* Fallback redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          </ProjectProvider>
        </ProfileProvider>
      </ClerkProvider>
    </BrowserRouter>
  );
}

export default App;