import { createContext, useContext, useState } from "react";

// Buat Context
const StateContext = createContext({
  currentUser: null,
  token: null,
  setCurrentUser: () => {},
  setToken: () => {},
  userCan: () => false,
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
    // Jika data user belum ada, kembalikan false
    if (!user || !user.level) {
        return false;
    }

    // JIKA USER ADALAH ADMIN, SELALU BERIKAN AKSES (return true)
    if (user.level.user_level === 'admin') {
        return true;
    }
    
    // Untuk role lain, cek apakah 'permissions' ada dan tidak kosong
    if (!user.level.permissions || user.level.permissions.length === 0) {
        return false;
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
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(StateContext);