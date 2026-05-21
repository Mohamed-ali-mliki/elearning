import { useEffect, useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import './AdminDashboard.css';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [pendingCourses, setPendingCourses] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadAdminData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Session expirée, veuillez vous reconnecter');

        // On lance les deux requêtes en parallèle
        const [usersRes, coursesRes] = await Promise.all([
          fetch('/api/admin/users', { headers: { Authorization: `Bearer ${token}` } }),
          fetch('/api/admin/courses/pending', { headers: { Authorization: `Bearer ${token}` } })
        ]);

        if (usersRes.status === 403 || coursesRes.status === 403) {
          throw new Error('Accès refusé : Vous devez être Administrateur');
        }

        if (!usersRes.ok || !coursesRes.ok) {
          throw new Error('Erreur lors du chargement des données');
        }

        const usersData = await usersRes.json();
        const coursesData = await coursesRes.json();

        setUsers(usersData);
        setPendingCourses(coursesData);
      } catch (err) {
        setError(err.message);
      }
    };

    if (user && user.role === 'admin') {
      loadAdminData();
    } else if (user) {
      setError('Accès non autorisé : Réservé aux administrateurs');
    }
  }, []);

  const changeRole = async (userId, newRole) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/admin/users/${userId}/role`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ role: newRole }),
      });
      
      if (!res.ok) throw new Error();
      
      // Refresh list
      setUsers(users.map(u => u._id === userId ? { ...u, role: newRole } : u));
    } catch (err) { setError('Erreur mise à jour rôle'); }
  };

  const validateCourse = async (courseId) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`/api/admin/courses/${courseId}/validate`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
      });
      setPendingCourses(pendingCourses.filter(c => c._id !== courseId));
    } catch (err) { setError('Erreur validation cours'); }
  };

  const deleteCourse = async (courseId) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`/api/admin/courses/${courseId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      setPendingCourses(pendingCourses.filter(c => c._id !== courseId));
    } catch (err) { setError('Erreur suppression cours'); }
  };

  if (error) return <div className="alert alert-danger m-4">{error}</div>;

  return (
    <div className="admin-dashboard container">
      <h1>Administration</h1>
      <section className="users-section card">
        <h2>Gestion des utilisateurs</h2>
        <table className="user-table">
          <thead><tr><th>Nom</th><th>Email</th><th>Rôle</th><th>Action</th></tr></thead>
          <tbody>
            {users.map(user => (
              <tr key={user._id}>
                <td>{user.fullName || user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>
                  <select value={user.role} onChange={(e) => changeRole(user._id, e.target.value)} className="role-select">
                    <option value="client">Client</option>
                    <option value="formateur">Formateur</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
      <section className="courses-section card">
        <h2>Cours en attente de validation</h2>
        <div className="course-list">
          {pendingCourses.map(course => (
            <div key={course._id} className="course-item card">
              <h3>{course.title}</h3>
              <p>{course.description}</p>
              <div className="actions">
                <button onClick={() => validateCourse(course._id)} className="btn-primary">Valider</button>
                <button onClick={() => deleteCourse(course._id)} className="btn-danger">Supprimer</button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}