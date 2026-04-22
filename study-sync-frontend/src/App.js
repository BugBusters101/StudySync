import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from './components/Navbar';
import Home from './Pages/Home';
import Login from './Pages/Login';
import Signup from './Pages/SignUp';
import Dashboard from './Pages/Dashboard';
import PreferencesForm from './Pages/PreferenceForm';
import ChatPage from './Pages/ChatPage';
import {AuthProvider} from "./contexts/AuthContext";
import { ProtectedRoute } from './components/ProtectedRoute';
import { SocketProvider } from './contexts/SocketContext';

const API_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:5000';

function App() {
  // Keep the Render backend warm to avoid cold-start delays
  useEffect(() => {
    const ping = () => fetch(`${API_URL}/`).catch(() => {});
    ping(); // ping immediately on load
    const interval = setInterval(ping, 9 * 60 * 1000); // every 9 minutes
    return () => clearInterval(interval);
  }, []);

  return (
      <AuthProvider>
          <SocketProvider>
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<ProtectedRoute requirePreferences={true}><Dashboard /></ProtectedRoute>} />
        <Route path="/preferences" element={<ProtectedRoute><PreferencesForm /></ProtectedRoute>} />
        <Route path="/chat" element={<ProtectedRoute requirePreferences={true}><ChatPage /></ProtectedRoute>} />
      </Routes>
    </Router>
          </SocketProvider>
      </AuthProvider>
  );
}

export default App;