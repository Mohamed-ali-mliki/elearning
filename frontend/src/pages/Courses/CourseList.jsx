import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { FaSearch, FaClock, FaBookOpen } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import './CourseList.css';

const CourseList = () => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [categorie, setCategorie] = useState(searchParams.get('categorie') || '');
  const [tri, setTri] = useState('date');
  const [page, setPage] = useState(1);
  const parPage = 6;

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch('/api/courses?status=approved');
        if (!res.ok) throw new Error();
        const data = await res.json();
        setCourses(data);
      } catch (err) {
        console.log("Erreur chargement cours", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  useEffect(() => {
    setPage(1);
    const params = {};
    if (search) params.search = search;
    if (categorie) params.categorie = categorie;
    setSearchParams(params);
  }, [search, categorie]);

  let filtres = courses.filter(c => {
    const titreMatch = c.title.toLowerCase().includes(search.toLowerCase());
    const catMatch = categorie === '' || c.category === categorie;
    return titreMatch && catMatch;
  });

  if (tri === 'prix-croissant') filtres.sort((a,b) => a.price - b.price);
  if (tri === 'prix-decroissant') filtres.sort((a,b) => b.price - a.price);
  if (tri === 'date') filtres.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));

  const debut = (page-1) * parPage;
  const fin = debut + parPage;
  const coursPage = filtres.slice(debut, fin);
  const totalPages = Math.ceil(filtres.length / parPage);

  if (loading) return <div className="text-center mt-5"><div className="spinner-border text-primary"></div><p>{t('common.loading')}</p></div>;

  return (
    <div>
      <div className="courses-header-bg" style={{ backgroundImage: "url('https://images.pexels.com/photos/267885/pexels-photo-267885.jpeg')" }}>
        <div className="overlay-dark"></div>
        <div className="container h-100 d-flex align-items-center">
          <div className="text-white text-center w-100">
            <h1 className="display-4 fw-bold">{t('courses.title')}</h1>
            <p className="lead">{t('courses.subtitle')}</p>
          </div>
        </div>
      </div>

      <div className="container my-5">
        <div className="row mb-4 g-2">
          <div className="col-md-5">
            <div className="input-group">
              <span className="input-group-text"><FaSearch /></span>
              <input type="text" className="form-control" placeholder={t('courses.searchPlaceholder')} value={search} onChange={e => setSearch(e.target.value)} />
            </div>
          </div>
          <div className="col-md-3">
            <select className="form-select" value={categorie} onChange={e => setCategorie(e.target.value)}>
              <option value="">{t('courses.allCategories')}</option>
              <option value="Développement">💻 {t('home.categoryWeb')}</option>
              <option value="Design">🎨 {t('home.categoryDesign')}</option>
              <option value="Marketing">📈 {t('home.categoryMarketing')}</option>
            </select>
          </div>
          <div className="col-md-3">
            <select className="form-select" value={tri} onChange={e => setTri(e.target.value)}>
              <option value="date">{t('courses.sortDate')}</option>
              <option value="prix-croissant">{t('courses.sortPriceAsc')}</option>
              <option value="prix-decroissant">{t('courses.sortPriceDesc')}</option>
            </select>
          </div>
          <div className="col-md-1 text-end">
            <span className="badge bg-secondary p-2">{filtres.length} {t('courses.courses')}</span>
          </div>
        </div>

        {coursPage.length === 0 && <div className="alert alert-warning">{t('courses.noResults')}</div>}
        <div className="row g-4">
          {coursPage.map(c => (
            <div key={c._id} className="col-md-4">
              <div className="course-card h-100">
                <div className="course-img">
                  <img 
                    src={c.thumbnail ? `http://localhost:5000/${c.thumbnail}` : '/default-course.jpg'} 
                    alt={c.title} 
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/default-course.jpg';
                    }}
                  />
                  <div className="course-price">{c.price} DT</div>
                </div>
                <div className="course-body">
                  <div className="course-category">{c.category || 'Général'}</div>
                  <h5 className="course-title">{c.title}</h5>
                  <p className="course-description">{c.description?.substring(0, 80)}...</p>
                  <div className="course-meta">
                    <span><FaClock /> {c.duration || '2h'}</span>
                    <span><FaBookOpen /> {c.sections?.length || 0} {t('courses.lessons')}</span>
                  </div>
                  <Link to={`/courses/${c._id}`} className="btn btn-outline-primary btn-sm rounded-pill mt-2 w-100">{t('courses.details')}</Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {totalPages > 1 && (
          <nav className="mt-5">
            <ul className="pagination justify-content-center">
              <li className={`page-item ${page===1?'disabled':''}`}><button className="page-link" onClick={()=>setPage(p=>p-1)}>{t('common.previous')}</button></li>
              {[...Array(totalPages)].map((_,i)=>(
                <li key={i} className={`page-item ${page===i+1?'active':''}`}><button className="page-link" onClick={()=>setPage(i+1)}>{i+1}</button></li>
              ))}
              <li className={`page-item ${page===totalPages?'disabled':''}`}><button className="page-link" onClick={()=>setPage(p=>p+1)}>{t('common.next')}</button></li>
            </ul>
          </nav>
        )}
      </div>
    </div>
  );
};

export default CourseList;