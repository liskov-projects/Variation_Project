import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Welcome from './pages/Welcome';
import FormWrapper from './components/FormWrapper';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/home" replace />} />
      <Route path="/home" element={<Home />} />
      <Route path="/welcome" element={<Welcome />} />
      <Route path="/*" element={<FormWrapper />} />
    </Routes>
  );
}

function AppWrapper() {
  return (
    <BrowserRouter basename="/TBD">
      <App />
    </BrowserRouter>
  );
}

export default AppWrapper;