import { useEffect, useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './AdminDashboard.css';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

export default function AdminDashboard() {
  const { token: contextToken } = useAuth();
  const token = contextToken || localStorage.getItem('token');
  const [users, setUsers] = useState([]);
  const [pendingCourses, setPendingCourses] = useState([]);
  const [stats, setStats] = useState({ totalUsers: 0, totalCourses: 0, totalRevenue: 0 });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({ fullName: '', email: '', password: '', role: 'client' });
  
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectCourseId, setRejectCourseId] = useState(null);
  const [rejectMessage, setRejectMessage] = useState('');

  useEffect(() => {
    if (token) {
      fetchData();
    }
  }, [token]);

  const fetchData = async () => {
    try {
      if (!token) return;
      
      const [usersRes, coursesRes] = await Promise.all([
        axios.get('/api/admin/users', { headers: { Authorization: `Bearer ${token}` } }),
        axios.get('/api/admin/courses/pending', { headers: { Authorization: `Bearer ${token}` } })
      ]);
      setUsers(usersRes.data);
      setPendingCourses(coursesRes.data);
      setStats({
        totalUsers: usersRes.data.length,
        totalCourses: coursesRes.data.length,
        totalRevenue: 0
      });
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      setTimeout(() => setError(''), 4000);
    }
  };

  const showNotification = (msg, isError = false) => {
    if (isError) setError(msg);
    else setSuccess(msg);
    setTimeout(() => {
      setError('');
      setSuccess('');
    }, 4000);
  };

  // --- Gestion utilisateurs ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingUser ? `/api/admin/users/${editingUser._id}` : '/api/admin/users';
      const method = editingUser ? 'put' : 'post';
      const body = editingUser 
        ? { fullName: formData.fullName, email: formData.email, role: formData.role }
        : { fullName: formData.fullName, email: formData.email, password: formData.password, role: formData.role };
      await axios[method](url, body, { headers: { Authorization: `Bearer ${token}` } });
      showNotification(editingUser ? 'Utilisateur modifié' : 'Utilisateur ajouté');
      fetchData();
      setShowModal(false);
      setEditingUser(null);
      setFormData({ fullName: '', email: '', password: '', role: 'client' });
    } catch (err) {
      showNotification(err.response?.data?.message || 'Erreur', true);
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm('Supprimer cet utilisateur ?')) return;
    try {
      await axios.delete(`/api/admin/users/${userId}`, { headers: { Authorization: `Bearer ${token}` } });
      showNotification('Utilisateur supprimé');
      fetchData();
    } catch (err) {
      showNotification('Erreur suppression', true);
    }
  };

  const changeRole = async (userId, newRole) => {
    try {
      await axios.put(`/api/admin/users/${userId}/role`, { role: newRole }, { headers: { Authorization: `Bearer ${token}` } });
      showNotification('Rôle mis à jour');
      fetchData();
    } catch (err) {
      showNotification('Erreur mise à jour rôle', true);
    }
  };

  // --- Gestion cours ---
  const validateCourse = async (courseId) => {
    try {
      await axios.put(`/api/admin/courses/${courseId}/approve`, {}, { headers: { Authorization: `Bearer ${token}` } });
      showNotification('Cours approuvé avec succès');
      fetchData();
    } catch (err) {
      showNotification(err.response?.data?.message || 'Erreur lors de l\'approbation', true);
    }
  };

  const rejectCourse = async () => {
    if (!rejectCourseId) return;
    try {
      await axios.put(`/api/admin/courses/${rejectCourseId}/reject`, { message: rejectMessage }, { headers: { Authorization: `Bearer ${token}` } });
      showNotification('Cours rejeté');
      setShowRejectModal(false);
      setRejectCourseId(null);
      setRejectMessage('');
      fetchData();
    } catch (err) {
      showNotification(err.response?.data?.message || 'Erreur lors du rejet', true);
    }
  };

  // --- Graphique professionnel (6 derniers mois glissants) ---
  const getLast6MonthsChartData = () => {
    const months = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const label = d.toLocaleString('fr-FR', { month: 'short', year: 'numeric' });
      months.push({ label, year: d.getFullYear(), month: d.getMonth() });
    }
    
    const counts = months.map(m => {
      return users.filter(u => {
        if (!u.createdAt) return false;
        const created = new Date(u.createdAt);
        return created.getFullYear() === m.year && created.getMonth() === m.month;
      }).length;
    });
    
    return { labels: months.map(m => m.label), data: counts };
  };

  const { labels, data } = getLast6MonthsChartData();
  
  const chartData = {
    labels: labels,
    datasets: [
      {
        label: 'Nouveaux utilisateurs',
        data: data,
        fill: true,
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderColor: '#3b82f6',
        borderWidth: 2,
        tension: 0.3,
        pointBackgroundColor: '#3b82f6',
        pointBorderColor: '#fff',
        pointRadius: 4,
        pointHoverRadius: 6,
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'top',
        labels: { font: { size: 13, weight: 'bold' }, color: '#1e293b' }
      },
      tooltip: {
        backgroundColor: '#1e293b',
        titleColor: '#fff',
        bodyColor: '#e2e8f0',
        callbacks: {
          label: (context) => `${context.dataset.label}: ${context.raw} inscription(s)`
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: '#e2e8f0', drawBorder: true },
        title: { display: true, text: 'Nombre d\'inscriptions', color: '#475569' }
      },
      x: {
        grid: { display: false },
        title: { display: true, text: 'Mois', color: '#475569' }
      }
    },
    animation: { duration: 1000, easing: 'easeOutQuart' }
  };

  return (
    <div className="admin-dashboard">
      <h1 className="dashboard-title">Tableau de bord Admin</h1>
      
      {error && <div className="alert alert-danger alert-dismissible fade show" role="alert">{error}<button type="button" className="btn-close" onClick={() => setError('')}></button></div>}
      {success && <div className="alert alert-success alert-dismissible fade show" role="alert">{success}<button type="button" className="btn-close" onClick={() => setSuccess('')}></button></div>}

      {/* Section des statistiques (inchangée) */}
      <div className="stats-row">
        <div className="stat-card glass">👥 {stats.totalUsers} Utilisateurs</div>
        <div className="stat-card glass">📚 {stats.totalCourses} Cours en attente</div>
        <div className="stat-card glass">💰 {stats.totalRevenue} DT Revenus</div>
      </div>

      {/* Gestion des utilisateurs (placée avant le graphique) */}
      <div className="users-section glass">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2>Gestion des utilisateurs</h2>
          <button className="btn btn-primary" onClick={() => { setEditingUser(null); setFormData({ fullName: '', email: '', password: '', role: 'client' }); setShowModal(true); }}>+ Ajouter</button>
        </div>
        <table className="user-table">
          <thead><tr><th>Nom</th><th>Email</th><th>Rôle</th><th>Actions</th></tr></thead>
          <tbody>
            {users.map(u => (
              <tr key={u._id}>
                <td>{u.fullName}</td>
                <td>{u.email}</td>
                <td>
                  <select value={u.role} onChange={e => changeRole(u._id, e.target.value)}>
                    <option value="client">Client</option>
                    <option value="formateur">Formateur</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td>
                  <button className="btn-sm btn-warning me-2" onClick={() => { setEditingUser(u); setFormData({ fullName: u.fullName, email: u.email, role: u.role }); setShowModal(true); }}>✏️</button>
                  <button className="btn-sm btn-danger" onClick={() => handleDelete(u._id)}>🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Cours en attente */}
      <div className="courses-section glass">
        <h2>Cours en attente</h2>
        <div className="pending-grid">
          {pendingCourses.map(c => (
            <div key={c._id} className="pending-card">
              <h4>{c.title}</h4>
              <p>{c.description?.slice(0, 80)}...</p>
              <div className="btn-group">
                <button className="btn-info me-2" onClick={() => { setSelectedCourse(c); setShowCourseModal(true); }}>👁️ Voir détails</button>
                <button className="btn-success me-2" onClick={() => validateCourse(c._id)}>Valider</button>
                <button className="btn-danger" onClick={() => { setRejectCourseId(c._id); setShowRejectModal(true); }}>Refuser</button>
              </div>
            </div>
          ))}
          {pendingCourses.length === 0 && <p>Aucun cours en attente.</p>}
        </div>
      </div>

      {/* Graphique professionnel (maintenant en bas) */}
      <div className="chart-container glass">
        <h3>Évolution mensuelle des inscriptions</h3>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <Line data={chartData} options={chartOptions} />
        </div>
      </div>

      {/* MODAL : Ajouter/Modifier utilisateur */}
      {showModal && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5>{editingUser ? 'Modifier' : 'Ajouter'} un utilisateur</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <input type="text" className="form-control mb-2" placeholder="Nom complet" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} required />
                  <input type="email" className="form-control mb-2" placeholder="Email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required />
                  {!editingUser && <input type="password" className="form-control mb-2" placeholder="Mot de passe" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} required />}
                  <select className="form-select" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})}>
                    <option value="client">Client</option>
                    <option value="formateur">Formateur</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Annuler</button>
                  <button type="submit" className="btn btn-primary">Enregistrer</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* MODAL : Visualisation détaillée d'un cours */}
      {showCourseModal && selectedCourse && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5>Détails du cours : {selectedCourse.title}</h5>
                <button type="button" className="btn-close" onClick={() => setShowCourseModal(false)}></button>
              </div>
              <div className="modal-body">
                <p><strong>Formateur :</strong> {selectedCourse.formateur?.fullName} ({selectedCourse.formateur?.email})</p>
                <p><strong>Description :</strong> {selectedCourse.description}</p>
                <p><strong>Catégorie :</strong> {selectedCourse.category}</p>
                <p><strong>Prix :</strong> {selectedCourse.price} €</p>
                <hr />
                <h6>Sections :</h6>
                {selectedCourse.sections?.map((section, idx) => (
                  <div key={idx} className="card mb-2">
                    <div className="card-body">
                      <strong>{section.title}</strong> – {section.type === 'video' ? '🎥 Vidéo' : '📄 PDF'}
                      {section.quiz && (
                        <div className="mt-2">
                          <span className="badge bg-secondary">Quiz</span>
                          <p className="mt-1"><strong>Question :</strong> {section.quiz.question}</p>
                          <p><strong>Type :</strong> {section.quiz.type === 'mcq' ? 'QCM' : 'Réponse libre'}</p>
                          {section.quiz.options && <p><strong>Options :</strong> {section.quiz.options.join(', ')}</p>}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowCourseModal(false)}>Fermer</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL : Rejet avec message */}
      {showRejectModal && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5>Rejeter le cours</h5>
                <button type="button" className="btn-close" onClick={() => setShowRejectModal(false)}></button>
              </div>
              <div className="modal-body">
                <label className="form-label">Message de rejet (optionnel)</label>
                <textarea className="form-control" rows="3" value={rejectMessage} onChange={e => setRejectMessage(e.target.value)} placeholder="Expliquez au formateur pourquoi son cours est rejeté..."></textarea>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowRejectModal(false)}>Annuler</button>
                <button className="btn btn-danger" onClick={rejectCourse}>Confirmer le rejet</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}