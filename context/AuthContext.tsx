import { useMutation } from "@apollo/client";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useAtom } from "jotai";
import { createContext, useContext, useEffect, useState } from "react";
import { LOGIN_USER } from "../graphql/mutations/login";
import { UserAtom } from "../utils/atoms";

interface AuthContextType {
  user: any;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  token: string | null;
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useAtom(UserAtom);
  const [token, setToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  const [LoginUser] = useMutation(LOGIN_USER);

  useEffect(() => {
    const checkAuthStatus = async () => {
      const tokenStore = await SecureStore.getItemAsync("token");
      if (tokenStore) {
        setToken(tokenStore);
        setIsAuthenticated(true);
      }
    };
    checkAuthStatus();
  });

  const login = async (email: string, mdp: string) => {
    try {
      const { data } = await LoginUser({
        variables: { email, mdp },
      });
      const token = data?.loginUser?.token;
      const user = data?.loginUser?.user;

      if (token && user) {
        await SecureStore.setItemAsync("token", token);
        setToken(token);
        setUser(user);
        setIsAuthenticated(true);
        router.push("/(tabs)/Home");
      } else {
        throw new Error("Échec de l'authentification");
      }
    } catch (err) {
      console.error("Érreur lors de la connexion:", err);
    }
  };

  const logout = async () => {
    await SecureStore.deleteItemAsync("token");
    // await SecureStore.deleteItemAsync("userInfo")

    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    router.push("/Login");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth doit être utilisé a l'intérieur du AuthProvider");
  }
  return context;
};
