// pages/Dashboard/AdminDashboard/AdminDashboard.jsx
import { useEffect, useState } from 'react';
import './AdminDashboard.css';

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [pendingCourses, setPendingCourses] = useState([]);

  // Récupérer la liste des utilisateurs
  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/admin/users', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setUsers(data);
    };
    const fetchPendingCourses = async () => {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/admin/courses/pending', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setPendingCourses(data);
    };
    fetchUsers();
    fetchPendingCourses();
  }, []);

  const changeRole = async (userId, newRole) => {
    const token = localStorage.getItem('token');
    await fetch(`/api/admin/users/${userId}/role`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ role: newRole }),
    });
    // Rafraîchir la liste
    const res = await fetch('/api/admin/users', {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setUsers(data);
  };

  const validateCourse = async (courseId) => {
    const token = localStorage.getItem('token');
    await fetch(`/api/admin/courses/${courseId}/validate`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
    });
    setPendingCourses(pendingCourses.filter(c => c._id !== courseId));
  };

  const deleteCourse = async (courseId) => {
    const token = localStorage.getItem('token');
    await fetch(`/api/admin/courses/${courseId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    setPendingCourses(pendingCourses.filter(c => c._id !== courseId));
  };

  return (
    <div className="admin-dashboard container">
      <h1>Administration</h1>

      <section className="users-section card">
        <h2>Gestion des utilisateurs</h2>
        <table className="user-table">
          <thead>
            <tr><th>Nom</th><th>Email</th><th>Rôle</th><th>Action</th></tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user._id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>
                  <select
                    value={user.role}
                    onChange={(e) => changeRole(user._id, e.target.value)}
                    className="role-select"
                  >
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