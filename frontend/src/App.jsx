import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import SignUp from './pages/Signup';
import ContactPage from './pages/Contact';
import About from './pages/About/About';          // Ton vrai composant About
import AdminDashboard from './pages/Dashboard/AdminDashboard/AdminDashboard';
import FormateurDashboard from './pages/Dashboard/FormateurDashboard/FormateurDashboard';
import ClientDashboard from './pages/Dashboard/ClientDashboard/ClientDashboard';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './App.css';

// Composant temporaire pour Courses (si tu n'as pas encore la page)
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
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/contact" element={<ContactPage />} />

              {/* Routes dashboards SANS protection pour la prévisualisation */}
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