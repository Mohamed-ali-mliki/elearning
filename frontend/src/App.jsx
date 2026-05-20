import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import LoginPage from './pages/Login/LoginPage';        // ← corrigé
import SignupPage from './pages/Signup/SignupPage';    // ← corrigé
import ContactPage from './pages/Contact';
import About from './pages/About/About';
import AdminDashboard from './pages/Dashboard/AdminDashboard/AdminDashboard';
import FormateurDashboard from './pages/Dashboard/FormateurDashboard/FormateurDashboard';
import ClientDashboard from './pages/Dashboard/ClientDashboard/ClientDashboard';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './App.css';

// Composant temporaire pour Courses
const Courses = () => (
  <div className="container py-5 text-center">
    <h2>Our Courses</h2>
    <p>Browse our catalog of learning materials.</p>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="d-flex flex-column min-vh-100">
          <Navbar />
          <main className="flex-grow-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/courses" element={<Courses />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/contact" element={<ContactPage />} />

              <Route path="/dashboard/admin" element={<AdminDashboard />} />
              <Route path="/dashboard/formateur" element={<FormateurDashboard />} />
              <Route path="/dashboard/client" element={<ClientDashboard />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;