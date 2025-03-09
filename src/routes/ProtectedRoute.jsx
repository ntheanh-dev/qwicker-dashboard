import { useContext } from 'react';
import { Navigate } from 'react-router-dom';

import { AuthContext } from 'src/auth/AuthProvider';

import { AppView } from 'src/sections/overview/view';

const ProtectedRoute = () => {
  const { user } = useContext(AuthContext);
  return user ? <AppView /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
