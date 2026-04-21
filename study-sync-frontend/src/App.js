import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './Pages/Home';
import Login from './Pages/Login';
import Signup from './Pages/SignUp';
import Dashboard from './Pages/Dashboard';
import PreferencesForm from './Pages/PreferenceForm';
import Profile from './Pages/Profile';
import ChatPage from './Pages/ChatPage';
import {AuthProvider} from "./contexts/AuthContext";
import { ProtectedRoute } from './components/ProtectedRoute';
import { SocketProvider } from './contexts/SocketContext';

function App() {
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