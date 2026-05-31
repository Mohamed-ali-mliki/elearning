import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const CourseList = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('');

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch('/api/courses?status=approved');
        if (!res.ok) throw new Error('Erreur chargement');
        const data = await res.json();
        setCourses(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const filteredCourses = courses.filter(course => {
    const matchSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategory = category === '' || course.category === category;
    return matchSearch && matchCategory;
  });

  if (loading) return <div className="text-center mt-5">Chargement des cours...</div>;

  return (
    <div className="container my-5">
      <h1 className="text-center mb-4">Nos cours</h1>
      <div className="row mb-4">
        <div className="col-md-6 mx-auto">
          <input
            type="text"
            className="form-control"
            placeholder="Rechercher un cours..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="col-md-3 mx-auto">
          <select className="form-select" value={category} onChange={e => setCategory(e.target.value)}>
            <option value="">Toutes catégories</option>
            <option value="Développement">Développement</option>
            <option value="Design">Design</option>
            <option value="Marketing">Marketing</option>
          </select>
        </div>
      </div>
      <div className="row">
        {filteredCourses.length === 0 && <p className="text-center">Aucun cours trouvé.</p>}
        {filteredCourses.map(course => (
          <div key={course._id} className="col-md-4 mb-4">
            <div className="card h-100 shadow-sm">
              <img src={course.thumbnail || '/placeholder-course.jpg'} className="card-img-top" alt={course.title} style={{ height: '200px', objectFit: 'cover' }} />
              <div className="card-body">
                <h5 className="card-title">{course.title}</h5>
                <p className="card-text">{course.description?.substring(0, 100)}...</p>
                <p className="text-primary fw-bold">{course.price} DT</p>
                <Link to={`/courses/${course._id}`} className="btn btn-primary">Voir détails</Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseList;