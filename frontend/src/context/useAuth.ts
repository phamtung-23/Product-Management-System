import { useContext, useCallback } from 'react';
import { AuthContext } from './AuthContext';
import { useNavigate } from 'react-router-dom';

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  const navigate = useNavigate();
  
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  
  // Additional useful auth utilities
  const loginAndRedirect = useCallback(async (email: string, password: string) => {
    await ctx.login({ email, password });
    navigate('/');
  }, [ctx, navigate]);
  
  const registerAndRedirect = useCallback(async (email: string, password: string, username: string) => {
    await ctx.register({ email, password, username });
    navigate('/');
  }, [ctx, navigate]);
  
  const logoutAndRedirect = useCallback(() => {
    ctx.logout();
    navigate('/login');
  }, [ctx, navigate]);
  
  return {
    ...ctx,
    loginAndRedirect,
    registerAndRedirect,
    logoutAndRedirect,
  };
};
