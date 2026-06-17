import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { FaGoogle, FaGithub } from 'react-icons/fa';
import { HiEye, HiEyeOff } from 'react-icons/hi';
import { useAuth } from '../../contexts/AuthContext';
import { getPendingEnrollment, clearPendingEnrollment } from '../../utils/enrollmentUtils';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

const LoginPage = () => {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    try {
      setError('');
      const user = await login(data.email, data.password);
      
      const pendingCourseId = getPendingEnrollment();
      if (pendingCourseId) {
        try {
          await axios.post(`http://localhost:5000/api/enrollments/${pendingCourseId}/buy`, {}, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          });
          clearPendingEnrollment();
          if (user.role === 'admin') navigate('/dashboard/admin');
          else if (user.role === 'formateur') navigate('/dashboard/formateur');
          else navigate(`/course/${pendingCourseId}`);
          return;
        } catch (err) {
          console.error('Inscription automatique échouée', err);
        }
      }
      
      if (user.role === 'admin') navigate('/dashboard/admin');
      else if (user.role === 'formateur') navigate('/dashboard/formateur');
      else navigate('/dashboard/client');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSocialLogin = (provider) => {
    alert(`Connexion avec ${provider} (à intégrer plus tard)`);
  };

  return (
    <div className="container d-flex align-items-center justify-content-center py-5">
      <div className="card shadow-lg border-0 rounded-4 p-4 p-md-5" style={{ maxWidth: '500px', width: '100%' }}>
        <div className="text-center mb-4">
          <h2 className="fw-bold">{t('auth.loginTitle')}</h2>
          <p className="text-muted">{t('auth.loginSubtitle')}</p>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-3">
            <label className="form-label fw-semibold">{t('auth.email')}</label>
            <input
              type="email"
              className={`form-control ${errors.email ? 'is-invalid' : ''}`}
              placeholder="exemple@domaine.com"
              {...register('email', { required: t('auth.emailRequired'), pattern: { value: /^[^\s@]+@([^\s@.,]+\.)+[^\s@.,]{2,}$/i, message: t('auth.emailInvalid') } })}
            />
            {errors.email && <div className="invalid-feedback">{errors.email.message}</div>}
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">{t('auth.password')}</label>
            <div className="input-group">
              <input
                type={showPassword ? 'text' : 'password'}
                className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                placeholder="••••••••"
                {...register('password', { required: t('auth.passwordRequired'), minLength: { value: 6, message: t('auth.passwordMin') } })}
              />
              <button className="btn btn-outline-secondary" type="button" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <HiEyeOff size={20} /> : <HiEye size={20} />}
              </button>
              {errors.password && <div className="invalid-feedback d-block">{errors.password.message}</div>}
            </div>
          </div>

          <div className="d-flex justify-content-between align-items-center mb-4">
            <div className="form-check">
              <input className="form-check-input" type="checkbox" id="remember" {...register('remember')} />
              <label className="form-check-label" htmlFor="remember">{t('auth.remember')}</label>
            </div>
            <Link to="/forgot-password" className="text-decoration-none small">{t('auth.forgotPassword')}</Link>
          </div>

          <button type="submit" className="btn btn-primary w-100 py-2 fw-semibold rounded-pill">{t('auth.loginBtn')}</button>

          <div className="text-center my-3">{t('auth.or')}</div>

          <div className="d-flex gap-2">
            <button type="button" className="btn btn-outline-secondary w-50 d-flex align-items-center justify-content-center gap-2 rounded-pill" onClick={() => handleSocialLogin('Google')}>
              <FaGoogle /> Google
            </button>
            <button type="button" className="btn btn-outline-secondary w-50 d-flex align-items-center justify-content-center gap-2 rounded-pill" onClick={() => handleSocialLogin('GitHub')}>
              <FaGithub /> GitHub
            </button>
          </div>
        </form>

        <p className="text-center mt-4 mb-0">
          {t('auth.noAccount')} <Link to="/signup" className="text-decoration-none fw-bold">{t('auth.signupBtn')}</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;