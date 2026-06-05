import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import Home from './pages/Home/Home';
import About from './pages/About/About';
import ContactPage from './pages/Contact/ContactPage';
import CourseList from './pages/Courses/CourseList';
import CourseDetail from './pages/Courses/CourseDetail';
import WatchCourse from './pages/Courses/WatchCourse';
import LoginPage from './pages/Login/LoginPage';
import SignupPage from './pages/Signup/SignupPage';
import { DashboardRouter } from './pages/Dashboard/DashboardRouter';

// Composant wrapper pour conditionner le Footer
const AppContent = () => {
  const location = useLocation();
  const hideFooter = location.pathname.startsWith('/dashboard');

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/courses" element={<CourseList />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/courses/:id" element={<CourseDetail />} />
        <Route path="/watch/:courseId" element={<WatchCourse />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/dashboard/*" element={<DashboardRouter />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      {!hideFooter && <Footer />}
    </>
  );
};

function App() {
  const { user, loading } = useAuth();
  if (loading) return <div>Chargement...</div>;

  return <AppContent />;
}

export default App;