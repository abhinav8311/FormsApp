import React, { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('googleAccessToken');
    if (!token) {
      setCurrentUser(null);
      setLoading(false);
      return;
    }
    // Fetch Google user profile
    fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((profile) => {
        if (profile && profile.sub) {
          setCurrentUser({
            id: profile.sub,
            name: profile.name,
            email: profile.email,
            picture: profile.picture,
          });
        } else {
          setCurrentUser(null);
        }
        setLoading(false);
      })
      .catch(() => {
        setCurrentUser(null);
        setLoading(false);
      });
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
