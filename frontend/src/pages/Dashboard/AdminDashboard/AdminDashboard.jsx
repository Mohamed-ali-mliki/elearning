import { useEffect, useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import './AdminDashboard.css';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function AdminDashboard() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [pendingCourses, setPendingCourses] = useState([]);
  const [stats, setStats] = useState({ totalUsers: 0, totalCourses: 0, totalRevenue: 0 });
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({ fullName: '', email: '', password: '', role: 'client' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const [usersRes, coursesRes] = await Promise.all([
        fetch('/api/admin/users', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/admin/courses/pending', { headers: { Authorization: `Bearer ${token}` } })
      ]);
      const usersData = await usersRes.json();
      const coursesData = await coursesRes.json();
      setUsers(usersData);
      setPendingCourses(coursesData);
      setStats({
        totalUsers: usersData.length,
        totalCourses: coursesData.length,
        totalRevenue: 0
      });
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const url = editingUser ? `/api/admin/users/${editingUser._id}` : '/api/admin/users';
    const method = editingUser ? 'PUT' : 'POST';
    const body = editingUser ? { fullName: formData.fullName, email: formData.email, role: formData.role } : formData;
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(body)
    });
    if (res.ok) {
      fetchData();
      setShowModal(false);
      setEditingUser(null);
      setFormData({ fullName: '', email: '', password: '', role: 'client' });
    } else {
      const err = await res.json();
      setError(err.message);
    }
  };

  const handleDelete = async (userId) => {
    if (!confirm('Supprimer cet utilisateur ?')) return;
    const token = localStorage.getItem('token');
    const res = await fetch(`/api/admin/users/${userId}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
    if (res.ok) fetchData();
    else setError('Erreur suppression');
  };

  const changeRole = async (userId, newRole) => {
    const token = localStorage.getItem('token');
    await fetch(`/api/admin/users/${userId}/role`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ role: newRole })
    });
    fetchData();
  };

  const validateCourse = async (courseId) => {
    const token = localStorage.getItem('token');
    await fetch(`/api/admin/courses/${courseId}/validate`, { method: 'PUT', headers: { Authorization: `Bearer ${token}` } });
    fetchData();
  };

  const deleteCourse = async (courseId) => {
    const token = localStorage.getItem('token');
    await fetch(`/api/admin/courses/${courseId}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
    fetchData();
  };

  // Graphique dynamique basé sur les données réelles (ex: utilisateurs créés par mois)
  const getMonthlyUserCounts = () => {
    const months = {};
    users.forEach(u => {
      const date = new Date(u.createdAt);
      const month = `${date.getFullYear()}-${date.getMonth()+1}`;
      months[month] = (months[month] || 0) + 1;
    });
    const labels = Object.keys(months).sort();
    const data = labels.map(l => months[l]);
    return { labels, data };
  };
  const { labels, data } = getMonthlyUserCounts();
  const chartData = {
    labels: labels.length ? labels : ['Jan', 'Fév', 'Mar'],
    datasets: [{ label: 'Nouveaux utilisateurs', data: data.length ? data : [0,0,0], borderColor: '#3b82f6', tension: 0.3 }]
  };

  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="admin-dashboard">
      <h1 className="dashboard-title">Tableau de bord Admin</h1>
      <div className="stats-row">
        <div className="stat-card glass">👥 {stats.totalUsers} Utilisateurs</div>
        <div className="stat-card glass">📚 {stats.totalCourses} Cours en attente</div>
        <div className="stat-card glass">💰 {stats.totalRevenue} DT Revenus</div>
      </div>
      <div className="chart-container glass">
        <h3>Évolution mensuelle des inscriptions</h3>
        <Line data={chartData} />
      </div>

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
                <td>{u.fullName}</td><td>{u.email}</td>
                <td>
                  <select value={u.role} onChange={e => changeRole(u._id, e.target.value)}>
                    <option value="client">Client</option><option value="formateur">Formateur</option><option value="admin">Admin</option>
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

      <div className="courses-section glass">
        <h2>Cours en attente</h2>
        <div className="pending-grid">
          {pendingCourses.map(c => (
            <div key={c._id} className="pending-card">
              <h4>{c.title}</h4>
              <p>{c.description?.slice(0, 80)}...</p>
              <div className="btn-group">
                <button className="btn-success" onClick={() => validateCourse(c._id)}>Valider</button>
                <button className="btn-danger" onClick={() => deleteCourse(c._id)}>Refuser</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal Bootstrap (ajoutez Bootstrap JS si nécessaire) */}
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
                    <option value="client">Client</option><option value="formateur">Formateur</option><option value="admin">Admin</option>
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
    </div>
  );
}