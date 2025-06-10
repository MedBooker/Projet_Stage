import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export const useAuth = () => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);

  useEffect(() => {
    // Simulez un utilisateur connecté (statique)
    const fakeUser = {
      name: "Mamadou NDIAYE",
      email: "mamadou.ndiaye@gmail.com",
      password: "password123"
    };

    localStorage.setItem("user", JSON.stringify(fakeUser));
    
    // Si token ou user existe → authentifié
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
  }, []);

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("auth_token");
    setUser(null);
    setIsAuthenticated(false);
    router.push("/login");
  };

  return { isAuthenticated, user, logout };
};