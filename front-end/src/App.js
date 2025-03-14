import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ClerkProvider, SignedIn, SignedOut } from '@clerk/clerk-react';
import Home from './pages/Home';
import Welcome from './pages/Welcome';
import FormWrapper from './components/FormWrapper';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import UserProfile from './pages/UserProfile';

const PUBLISHABLE_KEY=process.env.REACT_APP_CLERK_PUBLISHABLE_KEY;

function PublicRoute({children}){
  return(
    <>
      <SignedIn>
        <Navigate to="/welcome" replace/>
      </SignedIn>
      <SignedOut>{children}</SignedOut>
    </>
  );
}

function PrivateRoute({children}){
  return(
    <>
      <SignedIn>{children}</SignedIn>
      <SignedOut>
        <Navigate to="/sign-in" replace />
      </SignedOut>
    </>
  )
}

function App() {
  return (
    <BrowserRouter>
      <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={
            <PublicRoute>
              <Home/>
            </PublicRoute>
          }/>
          <Route
            path="/sign-in"
            element={
              <PublicRoute>
                <SignIn />
              </PublicRoute>
            }
          />
          <Route
            path="/sign-up"
            element={
              <PublicRoute>
                <SignUp />
              </PublicRoute>
            }
          />

          {/* Protected routes */}
          <Route
            path="/welcome"
            element={
              <PrivateRoute>
                <Welcome />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <UserProfile />
              </PrivateRoute>
            }
          />
          <Route
            path="/*"
            element={
              <PrivateRoute>
                <FormWrapper />
              </PrivateRoute>
            }
          />
        </Routes>
      </ClerkProvider>
    </BrowserRouter>
  );
}

export default App;