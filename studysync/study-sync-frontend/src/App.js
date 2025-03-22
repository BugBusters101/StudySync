import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './Pages/Home';


function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />

        {/*<Route path="/login" element={<Login />} />*/}
        {/*<Route path="/dashboard" element={<Dashboard />} />*/}
      </Routes>
    </Router>
  );
}

export default App;