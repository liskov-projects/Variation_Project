import './App.css';
import React,{useEffect} from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { ClerkProvider, SignedIn, SignedOut, useAuth } from '@clerk/clerk-react';
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
import SignaturePage from './pages/SignaturePage';
// Project paths
import ProjectCreate from './pages/Projects/ProjectCreate';
import ProjectEdit from './pages/Projects/ProjectEdit';
import ProjectList from './pages/Projects/ProjectList';
import ProjectDetails from './pages/Projects/ProjectDetails';
import ProjectVariation from './pages/Projects/ProjectVariation';
import VariationCreate from './pages/Projects/VariationCreate';
import VariationEdit from './pages/Projects/VariationEdit';
import VariationLogicTree from './pages/Projects/VariationLogicTree';
// Home page (landing page for guests)
import Home from './pages/Home';

const PUBLISHABLE_KEY = process.env.REACT_APP_CLERK_PUBLISHABLE_KEY;

// Auth redirect component
const AuthRedirect = () => {
  const navigate = useNavigate();
  const { isSignedIn, isLoaded } = useAuth();

  useEffect(() => {
    if (isLoaded) {
      if (isSignedIn) {
        navigate('/welcome');
      } else {
        navigate('/sign-in');
      }
    }
  }, [isSignedIn, isLoaded, navigate]);

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Redirecting...</span>
      </div>
    </div>
  );
};

function PublicRoute({ children }) {
  const { isSignedIn, isLoaded } = useAuth();
  
  // Wait for Clerk to initialize
  if (!isLoaded) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading authentication...</span>
        </div>
      </div>
    );
  }

  // Redirect signed-in users to the welcome page
  if (isSignedIn) {
    return <Navigate to="/welcome" replace />;
  }

  // Allow access to public routes for non-signed-in users
  return children;
}

function PrivateRoute({ children }) {
  const { isSignedIn, isLoaded } = useAuth();
  
  // Wait for Clerk to initialize
  if (!isLoaded) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading authentication...</span>
        </div>
      </div>
    );
  }
  
  return isSignedIn ? children : <Navigate to="/sign-in" replace />;
}

function ClerkProviderWithNavigate({ children }) {
  const navigate = useNavigate();
  
  return (
    <ClerkProvider 
      publishableKey={PUBLISHABLE_KEY}
      navigate={(to) => navigate(to)}
    >
      {children}
    </ClerkProvider>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/*" element={
          <ClerkProviderWithNavigate>
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
                  {/* Add the SignaturePage route */}
                  <Route path="/signature" element={<SignaturePage />} />

                  {/* Auth redirect route */}
                  <Route path="/auth-redirect" element={<AuthRedirect />} />

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
                  <Route path="/projects/:projectId/variations/start" element={
                    <PrivateRoute>
                      <VariationLogicTree />
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
          </ClerkProviderWithNavigate>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;