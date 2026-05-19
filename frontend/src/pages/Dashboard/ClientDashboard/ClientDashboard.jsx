// pages/Dashboard/ClientDashboard/ClientDashboard.jsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './ClientDashboard.css';

export default function ClientDashboard() {
  const [enrolledCourses, setEnrolledCourses] = useState([]);

  useEffect(() => {
    const fetchEnrolled = async () => {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/client/enrollments', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setEnrolledCourses(data);
    };
    fetchEnrolled();
  }, []);

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