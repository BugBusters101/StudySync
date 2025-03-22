import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './Pages/Home';
import Login from './Pages/Login';
import Signup from './Pages/SignUp';
import Dashboard from './Pages/Dashboard';
import PreferencesForm from './Pages/PreferenceForm';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/preferences" element={<PreferencesForm />} />
      </Routes>
    </Router>
  );
}

export default App;