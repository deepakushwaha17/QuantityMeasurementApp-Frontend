import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function OAuth2CallbackPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setOAuthSession } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    const email = params.get('email');

    if (token) {
      setOAuthSession(token, email);
      navigate('/');
    } else {
      navigate('/login');
    }
  }, [location, navigate, setOAuthSession]);

  return <p>Logging in...</p>;
}

export default OAuth2CallbackPage;