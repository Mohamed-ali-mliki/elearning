import { useEffect, useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './AdminDashboard.css';
import { FaUsers, FaBookOpen, FaMoneyBillWave, FaUserPlus, FaEdit, FaTrashAlt, FaEye, FaCheck, FaSyncAlt, FaEnvelope, FaTimes } from 'react-icons/fa';
import { MdOutlineMarkEmailUnread } from 'react-icons/md';
import { useTranslation } from 'react-i18next';
import { COMMISSION_RATE } from '../../../config/constants';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

export default function AdminDashboard() {
  const { t } = useTranslation();
  const { token: contextToken } = useAuth();
  const token = contextToken || localStorage.getItem('token');
  const [users, setUsers] = useState([]);
  const [pendingCourses, setPendingCourses] = useState([]);
  const [stats, setStats] = useState({ totalUsers: 0, totalCourses: 0, totalRevenue: 0 });
  const [financial, setFinancial] = useState({ totalSales: 0, adminRevenue: 0, formateurTotal: 0 });
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

  const [messages, setMessages] = useState([]);
  const [activeTab, setActiveTab] = useState('users');
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [showMessageModal, setShowMessageModal] = useState(false);

  useEffect(() => {
    if (token) {
      fetchData();
      fetchMessages();
      fetchFinancialStats();
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

  const fetchFinancialStats = async () => {
    try {
      const res = await axios.get('/api/admin/stats/financial', { headers: { Authorization: `Bearer ${token}` } });
      setFinancial(res.data);
      setStats(prev => ({ ...prev, totalRevenue: res.data.adminRevenue }));
    } catch (err) {
      console.error('Erreur chargement financier', err);
    }
  };

  const fetchMessages = async () => {
    try {
      const res = await axios.get('/api/admin/messages', { headers: { Authorization: `Bearer ${token}` } });
      setMessages(res.data);
    } catch (err) {
      console.error('Erreur chargement messages', err);
    }
  };

  const markAsRead = async (id) => {
    try {
      await axios.put(`/api/admin/messages/${id}/read`, {}, { headers: { Authorization: `Bearer ${token}` } });
      fetchMessages();
      showNotification(t('dashboard.admin.messageRead'));
    } catch (err) {
      showNotification(t('common.error'), true);
    }
  };

  const deleteMessage = async (id) => {
    if (!window.confirm(t('common.deleteConfirm'))) return;
    try {
      await axios.delete(`/api/admin/messages/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      fetchMessages();
      showNotification(t('dashboard.admin.messageDeleted'));
    } catch (err) {
      showNotification(t('common.error'), true);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingUser ? `/api/admin/users/${editingUser._id}` : '/api/admin/users';
      const method = editingUser ? 'put' : 'post';
      const body = editingUser 
        ? { fullName: formData.fullName, email: formData.email, role: formData.role }
        : { fullName: formData.fullName, email: formData.email, password: formData.password, role: formData.role };
      await axios[method](url, body, { headers: { Authorization: `Bearer ${token}` } });
      showNotification(editingUser ? t('dashboard.admin.userUpdated') : t('dashboard.admin.userAdded'));
      fetchData();
      setShowModal(false);
      setEditingUser(null);
      setFormData({ fullName: '', email: '', password: '', role: 'client' });
    } catch (err) {
      showNotification(err.response?.data?.message || t('common.error'), true);
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm(t('common.deleteConfirm'))) return;
    try {
      await axios.delete(`/api/admin/users/${userId}`, { headers: { Authorization: `Bearer ${token}` } });
      showNotification(t('dashboard.admin.userDeleted'));
      fetchData();
    } catch (err) {
      showNotification(t('common.error'), true);
    }
  };

  const changeRole = async (userId, newRole) => {
    try {
      await axios.put(`/api/admin/users/${userId}/role`, { role: newRole }, { headers: { Authorization: `Bearer ${token}` } });
      showNotification(t('dashboard.admin.roleUpdated'));
      fetchData();
    } catch (err) {
      showNotification(t('common.error'), true);
    }
  };

  const validateCourse = async (courseId) => {
    try {
      await axios.put(`/api/admin/courses/${courseId}/approve`, {}, { headers: { Authorization: `Bearer ${token}` } });
      showNotification(t('dashboard.admin.courseApproved'));
      fetchData();
    } catch (err) {
      showNotification(err.response?.data?.message || t('common.error'), true);
    }
  };

  const rejectCourse = async () => {
    if (!rejectCourseId) return;
    try {
      await axios.put(`/api/admin/courses/${rejectCourseId}/reject`, { message: rejectMessage }, { headers: { Authorization: `Bearer ${token}` } });
      showNotification(t('dashboard.admin.courseRejected'));
      setShowRejectModal(false);
      setRejectCourseId(null);
      setRejectMessage('');
      fetchData();
    } catch (err) {
      showNotification(err.response?.data?.message || t('common.error'), true);
    }
  };

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
    datasets: [{
      label: t('dashboard.admin.chartLabel'),
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
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: { position: 'top', labels: { font: { size: 13, weight: 'bold' }, color: '#1e293b' } },
      tooltip: { backgroundColor: '#1e293b', titleColor: '#fff', bodyColor: '#e2e8f0', callbacks: { label: (context) => `${context.dataset.label}: ${context.raw} ${t('dashboard.admin.enrollments')}` } }
    },
    scales: {
      y: { beginAtZero: true, grid: { color: '#e2e8f0' }, title: { display: true, text: t('dashboard.admin.enrollments'), color: '#475569' } },
      x: { grid: { display: false }, title: { display: true, text: t('dashboard.admin.month'), color: '#475569' } }
    },
    animation: { duration: 1000, easing: 'easeOutQuart' }
  };

  return (
    <div className="admin-dashboard">
      <h1 className="dashboard-title">{t('dashboard.admin.title')}</h1>
      
      {error && <div className="alert alert-danger">{error}<button type="button" className="btn-close" onClick={() => setError('')}></button></div>}
      {success && <div className="alert alert-success">{success}<button type="button" className="btn-close" onClick={() => setSuccess('')}></button></div>}

      <div className="stats-row">
        <div className="stat-card glass"><FaUsers className="me-2" /> {stats.totalUsers} {t('dashboard.statsUsers')}</div>
        <div className="stat-card glass"><FaBookOpen className="me-2" /> {stats.totalCourses} {t('dashboard.admin.pendingCourses')}</div>
        {/* Carte Revenus améliorée - sans doublon */}
        <div className="stat-card glass border-primary" style={{ borderLeft: '4px solid #0d6efd' }}>
          <h5><FaMoneyBillWave className="me-2" /> Revenus de la plateforme</h5>
          <div className="mt-2">
            <div className="d-flex justify-content-between">
              <span>Volume global des ventes</span>
              <strong>{financial.totalSales.toFixed(2)} DT</strong>
            </div>
            <div className="d-flex justify-content-between text-primary fw-bold">
              <span>Revenu net admin ({COMMISSION_RATE * 100}%)</span>
              <span>{financial.adminRevenue.toFixed(2)} DT</span>
            </div>
            <div className="d-flex justify-content-between text-muted small">
              <span>Total à reverser aux formateurs ({(1 - COMMISSION_RATE) * 100}%)</span>
              <span>{financial.formateurTotal.toFixed(2)} DT</span>
            </div>
            <hr className="my-1" />
            <div className="d-flex justify-content-between fs-5 fw-bold text-primary">
              <span>Revenu net admin</span>
              <span>{financial.adminRevenue.toFixed(2)} DT</span>
            </div>
          </div>
          <small className="text-muted">Basé sur toutes les ventes de cours approuvés</small>
        </div>
      </div>

      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button className={`nav-link ${activeTab === 'users' ? 'active' : ''}`} onClick={() => setActiveTab('users')}>
            <FaUsers className="me-1" /> {t('dashboard.admin.usersTab')}
          </button>
        </li>
        <li className="nav-item">
          <button className={`nav-link ${activeTab === 'courses' ? 'active' : ''}`} onClick={() => setActiveTab('courses')}>
            <FaBookOpen className="me-1" /> {t('dashboard.admin.pendingTab')}
          </button>
        </li>
        <li className="nav-item">
          <button className={`nav-link ${activeTab === 'messages' ? 'active' : ''}`} onClick={() => setActiveTab('messages')}>
            <FaEnvelope className="me-1" /> {t('dashboard.admin.messagesTab')} <span className="badge bg-danger ms-1">{messages.filter(m => !m.isRead).length}</span>
          </button>
        </li>
      </ul>

      {activeTab === 'users' && (
        <div className="users-section glass">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h2>{t('dashboard.admin.manageUsers')}</h2>
            <button className="btn btn-primary" onClick={() => { setEditingUser(null); setFormData({ fullName: '', email: '', password: '', role: 'client' }); setShowModal(true); }}>
              <FaUserPlus className="me-1" /> {t('dashboard.admin.addUser')}
            </button>
          </div>
          <table className="user-table">
            <thead><tr><th>{t('auth.fullName')}</th><th>{t('auth.email')}</th><th>{t('dashboard.admin.role')}</th><th>{t('dashboard.admin.actions')}</th></tr></thead>
            <tbody>
              {users.map(u => (
                <tr key={u._id}>
                  <td>{u.fullName}</td>
                  <td>{u.email}</td>
                  <td>
                    <select value={u.role} onChange={e => changeRole(u._id, e.target.value)}>
                      <option value="client">{t('auth.roleClient')}</option>
                      <option value="formateur">{t('auth.roleFormateur')}</option>
                      <option value="admin">{t('dashboard.admin.admin')}</option>
                    </select>
                  </td>
                  <td>
                    <button className="btn-sm btn-warning me-2" onClick={() => { setEditingUser(u); setFormData({ fullName: u.fullName, email: u.email, role: u.role }); setShowModal(true); }}>
                      <FaEdit />
                    </button>
                    <button className="btn-sm btn-danger" onClick={() => handleDelete(u._id)}>
                      <FaTrashAlt />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'courses' && (
        <div className="courses-section glass">
          <h2>{t('dashboard.admin.pendingCourses')}</h2>
          <div className="pending-grid">
            {pendingCourses.map(c => (
              <div key={c._id} className="pending-card">
                <h4>{c.title}</h4>
                <p>{c.description?.slice(0, 80)}...</p>
                <div className="btn-group">
                  <button className="btn-info me-2" onClick={() => { setSelectedCourse(c); setShowCourseModal(true); }}>
                    <FaEye className="me-1" /> {t('dashboard.admin.view')}
                  </button>
                  <button className="btn-success me-2" onClick={() => validateCourse(c._id)}>
                    <FaCheck className="me-1" /> {t('dashboard.admin.accept')}
                  </button>
                  <button className="btn-danger" onClick={() => { setRejectCourseId(c._id); setShowRejectModal(true); }}>
                    <FaTimes className="me-1" /> {t('dashboard.admin.reject')}
                  </button>
                </div>
              </div>
            ))}
            {pendingCourses.length === 0 && <p>{t('dashboard.admin.noPending')}</p>}
          </div>
        </div>
      )}

      {activeTab === 'messages' && (
        <div className="messages-section glass">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2><MdOutlineMarkEmailUnread className="me-2" /> {t('dashboard.admin.messages')}</h2>
            <button className="btn btn-outline-primary btn-sm rounded-pill" onClick={fetchMessages}>
              <FaSyncAlt className="me-1" /> {t('common.refresh')}
            </button>
          </div>

          {messages.length === 0 ? (
            <div className="alert alert-info text-center">{t('dashboard.admin.noMessages')}</div>
          ) : (
            <div className="messages-grid">
              {messages.map((msg) => (
                <div key={msg._id} className={`message-card ${!msg.isRead ? 'unread' : 'read'}`}>
                  <div className="message-header">
                    <div className="message-sender">
                      <strong>{msg.name}</strong>
                      <span className="message-email">{msg.email}</span>
                    </div>
                    <span className={`message-status ${!msg.isRead ? 'status-unread' : 'status-read'}`}>
                      {!msg.isRead ? t('dashboard.admin.unread') : t('dashboard.admin.read')}
                    </span>
                  </div>
                  <div className="message-subject">{msg.subject}</div>
                  <div className="message-preview">
                    {msg.message.length > 100 ? msg.message.substring(0, 100) + '...' : msg.message}
                  </div>
                  <div className="message-footer">
                    <small className="message-date">
                      {new Date(msg.createdAt).toLocaleString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </small>
                    <div className="message-actions">
                      <button className="btn-action view" onClick={() => { setSelectedMessage(msg); setShowMessageModal(true); }} title={t('common.view')}>
                        <FaEye />
                      </button>
                      {!msg.isRead && (
                        <button className="btn-action read" onClick={() => markAsRead(msg._id)} title={t('dashboard.admin.markRead')}>
                          <FaCheck />
                        </button>
                      )}
                      <button className="btn-action delete" onClick={() => deleteMessage(msg._id)} title={t('common.delete')}>
                        <FaTrashAlt />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="chart-container glass mt-4">
        <h3>{t('dashboard.admin.graphTitle')}</h3>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <Line data={chartData} options={chartOptions} />
        </div>
      </div>

      {showModal && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5>{editingUser ? t('common.edit') : t('common.add')} {t('dashboard.admin.user')}</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <input type="text" className="form-control mb-2" placeholder={t('auth.fullName')} value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} required />
                  <input type="email" className="form-control mb-2" placeholder={t('auth.email')} value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required />
                  {!editingUser && <input type="password" className="form-control mb-2" placeholder={t('auth.password')} value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} required />}
                  <select className="form-select" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})}>
                    <option value="client">{t('auth.roleClient')}</option>
                    <option value="formateur">{t('auth.roleFormateur')}</option>
                    <option value="admin">{t('dashboard.admin.admin')}</option>
                  </select>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>{t('common.cancel')}</button>
                  <button type="submit" className="btn btn-primary">{t('common.save')}</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {showCourseModal && selectedCourse && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5>{t('dashboard.admin.courseDetails')} : {selectedCourse.title}</h5>
                <button type="button" className="btn-close" onClick={() => setShowCourseModal(false)}></button>
              </div>
              <div className="modal-body">
                <p><strong>{t('dashboard.admin.instructor')} :</strong> {selectedCourse.formateur?.fullName} ({selectedCourse.formateur?.email})</p>
                <p><strong>{t('courseDetail.overview')} :</strong> {selectedCourse.description}</p>
                <p><strong>{t('courses.category')} :</strong> {selectedCourse.category}</p>
                <p><strong>{t('courseDetail.price')} :</strong> {selectedCourse.price} €</p>
                <hr />
                <h6>{t('courseDetail.sections')} :</h6>
                {selectedCourse.sections?.map((section, idx) => (
                  <div key={idx} className="card mb-2">
                    <div className="card-body">
                      <strong>{section.title}</strong> – {section.type === 'video' ? '🎥 Vidéo' : '📄 PDF'}
                      {section.quiz && (
                        <div className="mt-2">
                          <span className="badge bg-secondary">{t('watch.quizTitle')}</span>
                          <p className="mt-1"><strong>{t('dashboard.admin.question')} :</strong> {section.quiz.question}</p>
                          <p><strong>{t('dashboard.admin.type')} :</strong> {section.quiz.type === 'mcq' ? 'QCM' : 'Réponse libre'}</p>
                          {section.quiz.options && <p><strong>{t('dashboard.admin.options')} :</strong> {section.quiz.options.join(', ')}</p>}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowCourseModal(false)}>{t('common.close')}</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showRejectModal && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5>{t('dashboard.admin.reject')} {t('dashboard.admin.course')}</h5>
                <button type="button" className="btn-close" onClick={() => setShowRejectModal(false)}></button>
              </div>
              <div className="modal-body">
                <label className="form-label">{t('dashboard.admin.rejectionMsg')}</label>
                <textarea className="form-control" rows="3" value={rejectMessage} onChange={e => setRejectMessage(e.target.value)} placeholder={t('dashboard.admin.rejectionPlaceholder')}></textarea>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowRejectModal(false)}>{t('common.cancel')}</button>
                <button className="btn btn-danger" onClick={rejectCourse}>{t('dashboard.admin.confirmReject')}</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showMessageModal && selectedMessage && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title">{t('dashboard.admin.messageFrom')} {selectedMessage.name}</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowMessageModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="mb-3"><strong>{t('contact.name')} :</strong> {selectedMessage.name} ({selectedMessage.email})</div>
                <div className="mb-3"><strong>{t('contact.subject')} :</strong> {selectedMessage.subject}</div>
                <div className="mb-3"><strong>{t('common.date')} :</strong> {new Date(selectedMessage.createdAt).toLocaleString('fr-FR')}</div>
                <div className="mb-3">
                  <strong>{t('contact.message')} :</strong>
                  <div className="message-full-content p-3 bg-light rounded mt-2">{selectedMessage.message}</div>
                </div>
              </div>
              <div className="modal-footer">
                {!selectedMessage.isRead && (
                  <button className="btn btn-success" onClick={() => { markAsRead(selectedMessage._id); setShowMessageModal(false); }}>
                    <FaCheck className="me-1" /> {t('dashboard.admin.markRead')}
                  </button>
                )}
                <button className="btn btn-secondary" onClick={() => setShowMessageModal(false)}>{t('common.close')}</button>
                <button className="btn btn-danger" onClick={() => { deleteMessage(selectedMessage._id); setShowMessageModal(false); }}>
                  <FaTrashAlt className="me-1" /> {t('common.delete')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}