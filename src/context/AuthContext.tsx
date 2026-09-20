import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole } from '../types';
import { StorageService } from '../services/storageService';

interface AuthContextType {
  currentUser: UserProfile | null;
  role: UserRole;
  login: (email: string, role?: UserRole) => void;
  loginWithGoogle: (role?: UserRole) => void;
  register: (name: string, email: string, role: UserRole, college?: string) => void;
  switchRole: (newRole: UserRole) => void;
  logout: () => void;
  updateProfile: (data: Partial<UserProfile>) => void;
}

const DEFAULT_USER: UserProfile = {
  uid: 'usr-student-409',
  name: 'Aarav Sharma',
  email: 'aarav.sharma@campus.edu',
  role: 'user',
  college: 'Imperial Institute of Technology',
  phone: '+91 98765 43210',
  photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const DEFAULT_HOST: UserProfile = {
  uid: 'host-council-101',
  name: 'Nexus Tech Club & Council',
  email: 'nexus.events@campus.edu',
  role: 'host',
  college: 'Imperial Institute of Technology',
  phone: '+91 91234 56789',
  photoURL: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('campuspass_auth_user_v1');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return DEFAULT_USER;
      }
    }
    return DEFAULT_USER;
  });

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('campuspass_auth_user_v1', JSON.stringify(currentUser));
      // Seed initial demo ticket for this user if student
      if (currentUser.role === 'user') {
        StorageService.seedInitialData(currentUser.uid, currentUser.name, currentUser.email);
      }
    } else {
      localStorage.removeItem('campuspass_auth_user_v1');
    }
  }, [currentUser]);

  const login = (email: string, targetRole: UserRole = 'user') => {
    const user: UserProfile = {
      ...(targetRole === 'host' ? DEFAULT_HOST : DEFAULT_USER),
      email,
      role: targetRole,
      updatedAt: new Date().toISOString()
    };
    setCurrentUser(user);
  };

  const loginWithGoogle = (targetRole: UserRole = 'user') => {
    const user: UserProfile = {
      ...(targetRole === 'host' ? DEFAULT_HOST : DEFAULT_USER),
      name: targetRole === 'host' ? 'Dr. Ramesh Rao (Host)' : 'Aarav Sharma (Student)',
      role: targetRole,
      updatedAt: new Date().toISOString()
    };
    setCurrentUser(user);
  };

  const register = (name: string, email: string, role: UserRole, college?: string) => {
    const newUser: UserProfile = {
      uid: `usr-${Date.now().toString(36)}`,
      name,
      email,
      role,
      college: college || 'National College of Engineering',
      photoURL: `https://api.dicebear.com/7.x/bottts/svg?seed=${name}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setCurrentUser(newUser);
  };

  const switchRole = (newRole: UserRole) => {
    if (!currentUser) {
      setCurrentUser(newRole === 'host' ? DEFAULT_HOST : DEFAULT_USER);
      return;
    }
    const updated: UserProfile = {
      ...currentUser,
      role: newRole,
      name: newRole === 'host' && !currentUser.name.includes('Host') && !currentUser.name.includes('Club') 
        ? `${currentUser.name} (Organizer)` 
        : currentUser.name,
      updatedAt: new Date().toISOString()
    };
    setCurrentUser(updated);
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const updateProfile = (data: Partial<UserProfile>) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...data, updatedAt: new Date().toISOString() };
    setCurrentUser(updated);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        role: currentUser?.role || 'user',
        login,
        loginWithGoogle,
        register,
        switchRole,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
