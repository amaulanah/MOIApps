import { createContext, useContext, useState } from "react";

// Buat Context
const StateContext = createContext({
  currentUser: null,
  token: null,
  setCurrentUser: () => {},
  setToken: () => {},
});

// Buat Provider
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({});
  // Ambil token dari localStorage saat pertama kali aplikasi dimuat
  const [token, _setToken] = useState(localStorage.getItem('ACCESS_TOKEN'));

  const setToken = (newToken) => {
    _setToken(newToken);
    if (newToken) {
      localStorage.setItem('ACCESS_TOKEN', newToken);
    } else {
      localStorage.removeItem('ACCESS_TOKEN');
    }
  };

  const setCurrentUser = (newUser) => {
    setUser(newUser);
  }

  const userCan = (permissionSlug) => {
        if (!user || !user.level || !user.level.permissions) {
            return false;
        }
        // User admin selalu bisa mengakses semuanya
        if (user.level.user_level === 'admin') {
            return true;
        }
        // Cek apakah slug permission ada di dalam daftar izin user
        return user.level.permissions.some(p => p.slug === permissionSlug);
    };

  return (
    <StateContext.Provider value={{
      currentUser: user,
      token,
      setCurrentUser,
      setToken,
      userCan,
    }}>
      {children}
    </StateContext.Provider>
  );
};

// Custom hook untuk mempermudah penggunaan context
export const useAuth = () => useContext(StateContext);