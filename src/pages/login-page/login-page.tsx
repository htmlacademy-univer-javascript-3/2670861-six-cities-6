import Header from '@/components/header';
import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '@store/api-actions';
import { useAppDispatch, useAppSelector } from '@store/index';
import { selectAuthorizationStatus } from '@store/selectors';

function LoginPage(): JSX.Element | null {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const authorizationStatus = useAppSelector(selectAuthorizationStatus);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Перенаправление, если уже авторизован
  if (authorizationStatus === 'AUTH') {
    navigate('/');
    return null;
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    dispatch(login(formData))
      .unwrap()
      .then(() => {
        navigate('/');
      })
      .catch(() => {
        setError('Failed to sign in. Please check your credentials.');
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="page page--gray page--login">
      <Header />

      <main className="page__main page__main--login">
        <div className="page__login-container container">
          <section className="login">
            <h1 className="login__title">Sign in</h1>
            <form className="login__form form" onSubmit={handleSubmit}>
              <div className="login__input-wrapper form__input-wrapper">
                <label className="visually-hidden">E-mail</label>
                <input
                  className="login__input form__input"
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="login__input-wrapper form__input-wrapper">
                <label className="visually-hidden">Password</label>
                <input
                  className="login__input form__input"
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  disabled={isLoading}
                />
              </div>
              {error && (
                <div style={{ color: 'red', marginBottom: '10px' }}>
                  {error}
                </div>
              )}
              <button
                className="login__submit form__submit button"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? 'Signing in...' : 'Sign in'}
              </button>
            </form>
          </section>
          <section className="locations locations--login locations--current">
            <div className="locations__item">
              <a className="locations__item-link" href="#">
                <span>Amsterdam</span>
              </a>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default LoginPage;
