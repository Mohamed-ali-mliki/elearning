import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { FaGoogle, FaGithub } from 'react-icons/fa';
import { HiEye, HiEyeOff } from 'react-icons/hi';
// Si vous avez un fichier LoginPage.css, décommentez la ligne suivante :
// import './LoginPage.css';

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log('Login Data:', data);
    alert(`Connexion tentée avec : ${data.email}`);
    // Appel API ici
  };

  const handleSocialLogin = (provider) => {
    console.log(`Connexion avec ${provider}`);
    alert(`Connexion avec ${provider} (à intégrer)`);
  };

  return (
    <div className="container d-flex align-items-center justify-content-center py-5">
      <div className="card shadow-lg border-0 rounded-4 p-4 p-md-5" style={{ maxWidth: '500px', width: '100%' }}>
        <div className="text-center mb-4">
          <h2 className="fw-bold">Bienvenue !</h2>
          <p className="text-muted">Connectez-vous pour accéder à vos cours</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-3">
            <label className="form-label fw-semibold">Adresse email</label>
            <input
              type="email"
              className={`form-control ${errors.email ? 'is-invalid' : ''}`}
              placeholder="exemple@domaine.com"
              {...register('email', {
                required: "L'email est requis",
                pattern: {
                  value: /^[^\s@]+@([^\s@.,]+\.)+[^\s@.,]{2,}$/i,
                  message: 'Email invalide',
                },
              })}
            />
            {errors.email && <div className="invalid-feedback">{errors.email.message}</div>}
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Mot de passe</label>
            <div className="input-group">
              <input
                type={showPassword ? 'text' : 'password'}
                className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                placeholder="••••••••"
                {...register('password', {
                  required: 'Le mot de passe est requis',
                  minLength: { value: 6, message: 'Au moins 6 caractères' },
                })}
              />
              <button
                className="btn btn-outline-secondary"
                type="button"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <HiEyeOff size={20} /> : <HiEye size={20} />}
              </button>
              {errors.password && <div className="invalid-feedback d-block">{errors.password.message}</div>}
            </div>
          </div>

          <div className="d-flex justify-content-between align-items-center mb-4">
            <div className="form-check">
              <input className="form-check-input" type="checkbox" id="remember" {...register('remember')} />
              <label className="form-check-label" htmlFor="remember">Se souvenir de moi</label>
            </div>
            <Link to="/forgot-password" className="text-decoration-none small">Mot de passe oublié ?</Link>
          </div>

          <button type="submit" className="btn btn-primary w-100 py-2 fw-semibold rounded-pill">Se connecter</button>

          <div className="text-center my-3">ou</div>

          <div className="d-flex gap-2">
            <button
              type="button"
              className="btn btn-outline-secondary w-50 d-flex align-items-center justify-content-center gap-2 rounded-pill"
              onClick={() => handleSocialLogin('Google')}
            >
              <FaGoogle /> Google
            </button>
            <button
              type="button"
              className="btn btn-outline-secondary w-50 d-flex align-items-center justify-content-center gap-2 rounded-pill"
              onClick={() => handleSocialLogin('GitHub')}
            >
              <FaGithub /> GitHub
            </button>
          </div>
        </form>

        <p className="text-center mt-4 mb-0">
          Pas encore de compte ?{' '}
          <Link to="/signup" className="text-decoration-none fw-bold">Inscrivez-vous</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;