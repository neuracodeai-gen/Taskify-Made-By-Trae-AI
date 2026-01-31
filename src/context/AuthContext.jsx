import React, { createContext, useContext, useState, useEffect } from 'react';
import { hashPassword } from '../utils/auth';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for active session
    const sessionUser = localStorage.getItem('taskify_user');
    if (sessionUser) {
      setUser(JSON.parse(sessionUser));
    }
    setLoading(false);
  }, []);

  const register = (name, email, password) => {
    const users = JSON.parse(localStorage.getItem('taskify_users') || '[]');
    
    if (users.find(u => u.email === email)) {
      throw new Error('Email already exists');
    }

    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      password: hashPassword(password)
    };

    users.push(newUser);
    localStorage.setItem('taskify_users', JSON.stringify(users));
    
    // Auto login after register
    login(email, password);
  };

  const login = (email, password) => {
    const users = JSON.parse(localStorage.getItem('taskify_users') || '[]');
    const hashedPassword = hashPassword(password);
    
    const foundUser = users.find(u => u.email === email && u.password === hashedPassword);
    
    if (!foundUser) {
      throw new Error('Invalid email or password');
    }

    const { password: _, ...userWithoutPassword } = foundUser;
    localStorage.setItem('taskify_user', JSON.stringify(userWithoutPassword));
    setUser(userWithoutPassword);
  };

  const logout = () => {
    localStorage.removeItem('taskify_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
