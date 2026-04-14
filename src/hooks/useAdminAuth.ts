import { useState, useEffect } from 'react';

// "Vishesh@2512" encoded in SHA-256
const ADMIN_HASH = 'e956fc946cbd612b336bbb03877b7e1972e969c7b233a53f786a862a941cfa63'; 

export const useAdminAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    // Check if session exists on load
    const token = sessionStorage.getItem('vc_admin_session');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const verifyPassword = async (input: string): Promise<boolean> => {
    try {
      const encoder = new TextEncoder();
      const data = encoder.encode(input);
      const hashBuffer = await crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      
      if (hashHex === ADMIN_HASH) {
        // Create session token
        sessionStorage.setItem('vc_admin_session', btoa(Date.now().toString() + Math.random().toString(36)));
        setIsAuthenticated(true);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Crypto API Error:', error);
      return false;
    }
  };

  const logout = () => {
    sessionStorage.removeItem('vc_admin_session');
    setIsAuthenticated(false);
    window.dispatchEvent(new Event('vc_admin_logout'));
  };

  return { isAuthenticated, verifyPassword, logout };
};
