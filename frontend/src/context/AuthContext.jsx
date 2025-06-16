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

  return (
    <StateContext.Provider value={{
      currentUser: user,
      token,
      setCurrentUser,
      setToken,
    }}>
      {children}
    </StateContext.Provider>
  );
};

// Custom hook untuk mempermudah penggunaan context
export const useAuth = () => useContext(StateContext);