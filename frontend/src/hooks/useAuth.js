import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

/**
 * useAuth — access auth state and actions from any component.
 * Must be used inside <AuthProvider>.
 */
const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default useAuth;
