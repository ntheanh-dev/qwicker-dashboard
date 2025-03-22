import { useContext } from 'react';
import { Navigate } from 'react-router-dom';

import { AuthContext } from 'src/auth/AuthProvider';

// eslint-disable-next-line react/prop-types
const ProtectedRoute = ({ route: Route }) => {
  const { user } = useContext(AuthContext);
  return user ? <Route /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
