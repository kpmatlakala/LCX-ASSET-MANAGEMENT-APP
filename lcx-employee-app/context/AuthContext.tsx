import React, { createContext, useState, useContext, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Session } from '@supabase/supabase-js';

// Define the shape of the context data
interface AuthContextType {
  session: Session | null;
  employeeId: string | null;
  setSession: React.Dispatch<React.SetStateAction<Session | null>>;
  isFirstLogin: boolean;
  setIsFirstLogin: React.Dispatch<React.SetStateAction<boolean>>;
  loading: boolean;
  updateSession: (newSession: Session) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [employeeId, setEmployeeId] = useState<string | null>(null);
  const [isFirstLogin, setIsFirstLogin] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      if (session) {
        getProfile(session);
      }
    };

    fetchSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        if (session) {
          getProfile(session);
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const getProfile = async (session: Session) => {
    try {
      const { user } = session;
      if (!user) throw new Error("No user found!");

      const { data, error } = await supabase
        .from("employees")
        .select("employee_id, is_first_login")
        .eq("id", user.id)
        .single();

      if (error) throw error;
      if (data) {
        setEmployeeId(data.employee_id);
        setIsFirstLogin(data.is_first_login);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const updateSession = (newSession: Session) => {
    setSession(newSession);
    getProfile(newSession);
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        employeeId,
        setSession,
        isFirstLogin,
        setIsFirstLogin,
        loading,
        updateSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
