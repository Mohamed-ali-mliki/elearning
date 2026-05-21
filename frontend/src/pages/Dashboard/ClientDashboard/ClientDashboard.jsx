import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './ClientDashboard.css';

export default function ClientDashboard() {
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEnrolled = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Veuillez vous connecter');

        const res = await fetch('/api/client/enrollments', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error('Impossible de charger vos cours');
        
        const data = await res.json();
        setEnrolledCourses(data);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchEnrolled();
  }, []);

  if (error) return <div className="alert alert-danger m-4">{error}</div>;

  return (
    <div className="client-dashboard container">
      <h1>Mes cours</h1>
      <div className="courses-grid">
        {enrolledCourses.length === 0 && <p>Vous n'avez encore acheté aucun cours.</p>}
        {enrolledCourses.map(course => (
          <div key={course._id} className="course-card card">
            <img src={course.thumbnail || '/placeholder.jpg'} alt={course.title} />
            <h3>{course.title}</h3>
            <p>{course.description?.substring(0, 80)}...</p>
            <Link to={`/watch/${course._id}`} className="btn-primary">Accéder au cours</Link>
          </div>
        ))}
      </div>
    </div>
  );
}