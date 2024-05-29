/* eslint-disable no-lone-blocks */
import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import { useUser } from './UserContext.tsx';

interface AuthProps {
  authState?: { token: string | null; authenticated: boolean | null };

  onRegister?: (
    firstName: string,
    lastName: string,
    email: string,
    userName: string,
    password: string,
    confirmPassword: string,
  ) => Promise<any>;

  onLogin?: (userName: string, password: string) => Promise<any>;
  onLogout?: () => Promise<any>;
  onConfirmEmail?: (userId: string, code: string) => Promise<any>;
  onResetPassword?: (email: string, password: string, confirmPassword: string) => Promise<any>;
  onPushOffer ?: (clinicId: number, hotelId:number,treatmentId: number , title: string, description: string, currency: string, price: number, discount: number , isActive: boolean, startDate: string, endDate: string, imagesToAdd: string[] ) => Promise<any>;
  }

export const TOKEN_KEY = 'jwt-token';

export const API_URL = 'https://healthcareintourism-test.azurewebsites.net/api';
export const AuthContext = createContext<AuthProps>({});

export const useAuth = () => {
  return useContext(AuthContext);
};
export const AuthProvider = ({ children }: any) => {
  const [cookies, setCookie, removeCookie] = useCookies([TOKEN_KEY]);
  const {setUser} = useUser();
  const [authState, setAuthState] = useState<{
    token: string | null;
    authenticated: boolean | null;
  }>({
    token: null,
    authenticated: null,
  });

  useEffect(() => {
    const loadToken = async () => {
      const token = await cookies['jwt-token'];
      if (token) {
        axios.defaults.headers.common[`Authorization`] = `Bearer ${token}`;
        setAuthState({
          token: token,
          authenticated: true,
        });
      }
    };
    loadToken();
  }, [cookies]);

  const register = async (
    firstName: string,
    lastName: string,
    email: string,
    userName: string,
    password: string,
    confirmPassword: string
  ) => {
    try {
      const result = await axios.post(`${API_URL}/Account/register`, {
        firstName,
        lastName,
        email,
        userName,
        password,
        confirmPassword,
      });
      return result;
    } catch (e) {
      return { error: true, msg: (e as any).response.data };
    }
  };

  const confirmEmail = async (userId: string, code: string) => {
    try {
      const result = await axios.post(`${API_URL}/Account/confirm-email`, {
        userId,
        code,
      });
    {/* 
      setAuthState({
        token: result.data.jwToken,
        authenticated: true,
      });

      axios.defaults.headers.common[`Authorization`] = `Bearer ${result.data.jwToken}`;
      await SecureStore.setItemAsync(TOKEN_KEY, result.data.jwToken);
*/}

      return result;
    } catch (e) {
      console.log((e as any).response);
      return { error: true, msg: (e as any).response.data.message };
    }
  };

  

 const pushOffer = async (clinicId: number, hotelId:number,treatmentId: number , title: string, description: string, currency: string, price: number, discount: number , isActive: boolean, startDate: string, endDate: string, imagesToAdd: string[] ) => {
  try {
    const queryParams = { clinicId , hotelId ,treatmentId, title, description, currency, price, discount, isActive, startDate, endDate, imagesToAdd };
    const url = `${API_URL}/Agency/PushOfferAsync`;
    const token =cookies[TOKEN_KEY]; 
    setAuthState({
      token: token,
      authenticated: true,
    });
    
    axios.defaults.headers.common[`Authorization`] = `Bearer ${token}`;
    if (!authState.authenticated || !token) {
      throw new Error('User is not authenticated');
    }

    const response = await axios.post(url, queryParams, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (response.status !== 200) {
      throw new Error(`Request failed with status ${response.status}`);
    }
    return response.data.data;
  } catch (error) {
    return {
      error: true,
      msg: error,
    };
  }
};

  const login = async (userName: string, password: string) => {
    try {
      const result = await axios.post(`${API_URL}/Account/authenticate`, {
        userName,
        password,
      });

      setAuthState({
        token: result.data.data.jwToken,
        authenticated: true,
      });
      axios.defaults.headers.common[`Authorization`] = `Bearer ${result.data.data.jwToken}`;
      setUser(result.data.data);
      setCookie(TOKEN_KEY, result.data.data.jwToken);
      console.log(cookies[TOKEN_KEY])
      return result.data.data;
    } catch (e) {
      return { error: true, msg: (e as any).response.data };
    }
  };

  const logout = async () => {
    removeCookie(TOKEN_KEY);

    axios.defaults.headers.common[`Authorization`] = '';

    setAuthState({
      token: null,
      authenticated: false,
    });
  };
  const resetPassword = async (email: string, password: string, confirmPassword: string): Promise<any> => {
    try {
      return await axios.post(`${API_URL}/Account/reset-password`, {
        email,
        token: cookies[TOKEN_KEY],
        password,
        confirmPassword,
      });
    } catch (e) {
      return {
        error: true,
        msg: (e as any).response?.data?.msg || 'An error occurred while reseting the password.',
      };
    }
  };

  const value = {
    onRegister: register,
    onLogin: login,
    onLogout: logout,
    onConfirmEmail: confirmEmail,
    onResetPassword: resetPassword,
    onPushOffer: pushOffer,
    authState,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
