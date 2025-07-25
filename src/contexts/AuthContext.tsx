import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { User, AuthState } from '../types';
import { userLogin, userRegister } from '../hooks/useApi';

interface AuthContextType extends AuthState {
  login: (email: string, password: string, remember?: boolean) => Promise<void>;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
  signup: (email: string, password: string, name: string) => Promise<void>; // <-- Add this line
}

interface AuthAction {
  type: 'LOGIN_START' | 'LOGIN_SUCCESS' | 'LOGIN_ERROR' | 'LOGOUT' | 'UPDATE_USER';
  payload?: any;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN_START':
      return { ...state, isLoading: true };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        isLoading: false,
        isAuthenticated: true,
        user: action.payload
      };
    case 'LOGIN_ERROR':
      return {
        ...state,
        isLoading: false,
        isAuthenticated: false,
        user: null
      };
    case 'LOGOUT':
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        isLoading: false
      };
    case 'UPDATE_USER':
      return {
        ...state,
        user: state.user ? { ...state.user, ...action.payload } : null
      };
    default:
      return state;
  }
};

const initialState: AuthState = {
  user: null,
  isAuthenticated: true,
  isLoading: false
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('userData');
    
    if (token && userData) {
      try {
        const user = JSON.parse(userData);
        dispatch({ type: 'LOGIN_SUCCESS', payload: user });
        console.log('Restoring user from localStorage:', user);
      } catch (error) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
        dispatch({ type: 'LOGOUT' });
      }
    } else {
      dispatch({ type: 'LOGOUT' });
    }
  }, []);

  const login = async (email: string, password: string, remember = false) => {

    dispatch({ type: 'LOGIN_START' });
    
    try {
      // Simulate API call
      let user = await userLogin({ email: email, password: password });
      if (user.success) {
        dispatch({ type: 'LOGIN_SUCCESS', payload: user.user });
        localStorage.setItem('authToken', user.token);
        localStorage.setItem('userData', JSON.stringify(user.user))
        if (remember) {
          localStorage.setItem('rememberLogin', 'true');
        }
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      dispatch({ type: 'LOGIN_ERROR' });
      throw error;
    }
  };

  const signup = async (email: string, password: string, name: string) => {
    dispatch({ type: 'LOGIN_START' });
    try {
      await userRegister({ email: email, password: password, name: name });

      // Mock: check if email is already taken
      if (email === 'admin@example.com') {
        throw new Error('Email already registered');
      }

      // Mock user creation
      const user: User = {
        id: Date.now().toString(),
        email,
        name,
        role: 'editor',
        avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
        lastLogin: new Date()
      };

      dispatch({ type: 'LOGIN_SUCCESS', payload: user });

      const token = 'mock-jwt-token';
      localStorage.setItem('authToken', token);
      localStorage.setItem('userData', JSON.stringify(user));
    } catch (error) {
      dispatch({ type: 'LOGIN_ERROR' });
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    localStorage.removeItem('rememberLogin');
    dispatch({ type: 'LOGOUT' });
  };

  const updateUser = (userData: Partial<User>) => {
    dispatch({ type: 'UPDATE_USER', payload: userData });
    if (state.user) {
      const updatedUser = { ...state.user, ...userData };
      localStorage.setItem('userData', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider value={{
      ...state,
      login,
      logout,
      updateUser,
      signup // <-- Add this line
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};