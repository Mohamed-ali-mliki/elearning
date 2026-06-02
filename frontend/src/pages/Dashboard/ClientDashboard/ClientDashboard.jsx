import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import './ClientDashboard.css';

export default function ClientDashboard() {
  const { user } = useAuth();
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [availableCourses, setAvailableCourses] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');

      const [enrollRes, coursesRes] = await Promise.all([
        fetch('/api/enrollments/client/enrollments', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }),
        fetch('/api/courses?status=approved')
      ]);

      if (enrollRes.ok) {
        const enrolledData = await enrollRes.json();
        setEnrolledCourses(enrolledData);
      }

      if (coursesRes.ok) {
        const coursesData = await coursesRes.json();
        setAvailableCourses(coursesData);
      }

    } catch (err) {
      console.error(err);
      setError('Erreur lors du chargement des cours');
    }
  };

  const enrollCourse = async (courseId) => {
    try {
      const token = localStorage.getItem('token');

      const res = await fetch(`/api/enrollments/${courseId}/buy`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await res.json();

      if (res.ok) {
        alert('Inscription réussie !');
        fetchData();
      } else {
        alert(data.message);
      }

    } catch (err) {
      console.error(err);
      alert("Erreur lors de l'inscription");
    }
  };

  return (
    <div className="client-dashboard">

      <h1 className="dashboard-title">
        Mes cours, {user?.fullName} 👋
      </h1>

      {error && (
        <div className="alert alert-danger">
          {error}
        </div>
      )}

      <div className="courses-grid">

        {enrolledCourses.length === 0 && (
          <div className="empty-state">
            Vous n'êtes inscrit à aucun cours pour le moment.
          </div>
        )}

        {enrolledCourses.map(course => (
          <div key={course._id} className="course-card glass">

            <img
              src={course.thumbnail || '/default-course.jpg'}
              alt={course.title}
              className="course-img"
            />

            <h3>{course.title}</h3>

            <div className="progress-section">
              <div className="progress-bar-bg">
                <div
                  className="progress-fill"
                  style={{
                    width: `${course.progress || 0}%`
                  }}
                />
              </div>

              <span>
                {course.progress || 0}% complété
              </span>
            </div>

            <Link
              to={`/watch/${course._id}`}
              className="btn-resume"
            >
              Reprendre le cours
            </Link>

          </div>
        ))}

      </div>

      <h2 className="mt-5">
        Cours disponibles
      </h2>

      <div className="courses-grid">

        {availableCourses
          .filter(
            course =>
              !enrolledCourses.some(
                enrolled => enrolled._id === course._id
              )
          )
          .map(course => (

            <div
              key={course._id}
              className="course-card glass"
            >

              <img
                src={course.thumbnail || '/default-course.jpg'}
                alt={course.title}
                className="course-img"
              />

              <h3>{course.title}</h3>

              <p>
                {course.description?.slice(0, 80)}...
              </p>

              <p className="price">
                {course.price} DT
              </p>

              <button
                onClick={() => enrollCourse(course._id)}
                className="btn-enroll"
              >
                S'inscrire
              </button>

            </div>

          ))}

      </div>

    </div>
  );
}