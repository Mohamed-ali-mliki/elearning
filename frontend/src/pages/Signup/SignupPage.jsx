// src/pages/SignUp.jsx
// import './Home.css';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { FaGoogle, FaGithub } from 'react-icons/fa';
import { HiEye, HiEyeOff } from 'react-icons/hi';

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const password = watch('password');

  const onSubmit = (data) => {
    console.log('SignUp Data:', data);
    alert(`Inscription réussie pour : ${data.fullName}`);
  };

  const handleSocialSignUp = (provider) => {
    console.log(`Inscription avec ${provider}`);
    alert(`Inscription avec ${provider} (à intégrer)`);
  };

  return (
    <div className="container d-flex align-items-center justify-content-center py-5">
      <div className="card shadow-lg border-0 rounded-4 p-4 p-md-5" style={{ maxWidth: '550px', width: '100%' }}>
        <div className="text-center mb-4">
          <h2 className="fw-bold">Créez votre compte</h2>
          <p className="text-muted">Rejoignez notre communauté d'apprenants</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-3">
            <label className="form-label fw-semibold">Nom complet</label>
            <input
              type="text"
              className={`form-control ${errors.fullName ? 'is-invalid' : ''}`}
              placeholder="Jean Dupont"
              {...register('fullName', {
                required: 'Le nom complet est requis',
                minLength: { value: 2, message: 'Au moins 2 caractères' },
              })}
            />
            {errors.fullName && <div className="invalid-feedback">{errors.fullName.message}</div>}
          </div>

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
                  minLength: { value: 6, message: 'Minimum 6 caractères' },
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

          <div className="mb-3">
            <label className="form-label fw-semibold">Confirmer le mot de passe</label>
            <div className="input-group">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                placeholder="Confirmez votre mot de passe"
                {...register('confirmPassword', {
                  required: 'Veuillez confirmer le mot de passe',
                  validate: (value) => value === password || 'Les mots de passe ne correspondent pas',
                })}
              />
              <button
                className="btn btn-outline-secondary"
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <HiEyeOff size={20} /> : <HiEye size={20} />}
              </button>
              {errors.confirmPassword && <div className="invalid-feedback d-block">{errors.confirmPassword.message}</div>}
            </div>
          </div>

          <div className="mb-4 form-check">
            <input
              type="checkbox"
              className={`form-check-input ${errors.terms ? 'is-invalid' : ''}`}
              id="terms"
              {...register('terms', { required: 'Vous devez accepter les conditions d\'utilisation' })}
            />
            <label className="form-check-label" htmlFor="terms">
              J'accepte les <Link to="/terms">conditions générales</Link>
            </label>
            {errors.terms && <div className="invalid-feedback d-block">{errors.terms.message}</div>}
          </div>

          <button type="submit" className="btn btn-primary w-100 py-2 fw-semibold rounded-pill">Créer mon compte</button>

          <div className="text-center my-3">ou</div>

          <div className="d-flex gap-2">
            <button
              type="button"
              className="btn btn-outline-secondary w-50 d-flex align-items-center justify-content-center gap-2 rounded-pill"
              onClick={() => handleSocialSignUp('Google')}
            >
              <FaGoogle /> Google
            </button>
            <button
              type="button"
              className="btn btn-outline-secondary w-50 d-flex align-items-center justify-content-center gap-2 rounded-pill"
              onClick={() => handleSocialSignUp('GitHub')}
            >
              <FaGithub /> GitHub
            </button>
          </div>
        </form>

        <p className="text-center mt-4 mb-0">
          Déjà inscrit ?{' '}
          <Link to="/login" className="text-decoration-none fw-bold">Connectez-vous</Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;