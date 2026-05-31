import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const CourseDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEnrolled, setIsEnrolled] = useState(false);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`/api/courses/${id}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
        if (!res.ok) throw new Error('Cours introuvable');
        const data = await res.json();
        setCourse(data);
        
        if (token && user) {
          const enrollRes = await fetch(`/api/enrollments/check/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (enrollRes.ok) {
            const { enrolled } = await enrollRes.json();
            setIsEnrolled(enrolled);
          }
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [id, user]);

  const handleEnroll = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Veuillez vous connecter pour vous inscrire');
      return;
    }
    try {
      const res = await fetch(`/api/enrollments/${id}/buy`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setIsEnrolled(true);
        alert('Inscription réussie !');
      } else {
        const data = await res.json();
        alert(data.message || 'Erreur lors de l\'inscription');
      }
    } catch (err) {
      console.error(err);
      alert('Erreur réseau');
    }
  };

  if (loading) return <div className="text-center mt-5">Chargement...</div>;
  if (error) return <div className="alert alert-danger m-4">{error}</div>;

  return (
    <div className="container my-5">
      <div className="row">
        <div className="col-md-8">
          <img src={course?.thumbnail || '/placeholder-course.jpg'} className="img-fluid rounded" alt={course?.title} />
          <h1 className="mt-4">{course?.title}</h1>
          <p className="lead">{course?.description}</p>
          <p><strong>Catégorie :</strong> {course?.category}</p>
          <p><strong>Formateur :</strong> {course?.formateur?.fullName || 'Instructeur'}</p>
          <h3>Contenu du cours</h3>
          <ul className="list-group">
            {course?.sections?.map((section, idx) => (
              <li key={idx} className="list-group-item">
                {section.title} - {section.type === 'video' ? '🎥 Vidéo' : '📄 PDF'}
              </li>
            ))}
          </ul>
        </div>
        <div className="col-md-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Prix : {course?.price} DT</h5>
              {isEnrolled ? (
                <Link to={`/watch/${course?._id}`} className="btn btn-success w-100">Accéder au cours</Link>
              ) : (
                <button onClick={handleEnroll} className="btn btn-primary w-100">S'inscrire maintenant</button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;