import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ClerkProvider, SignedIn, SignedOut } from '@clerk/clerk-react';
import { ProfileProvider } from './contexts/ProfileContext';

// Auth pages
import SignIn from './pages/Auth/SignIn';
import SignUp from './pages/Auth/SignUp';

// Main pages
import Welcome from './pages/Welcome';
import ProfileSetup from './pages/ProfileSetup';
import ProfileEdit from './pages/ProfileEdit';
import ProfileComplete from './pages/ProfileComplete';
import Dashboard from './pages/Dashboard';

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

            {/* Fallback redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </ProfileProvider>
      </ClerkProvider>
    </BrowserRouter>
  );
}

export default App;