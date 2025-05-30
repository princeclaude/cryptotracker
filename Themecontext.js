
import React, { createContext, useState, useContext } from "react";

const Themecontext = createContext();

export const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(true); 

  const toggleTheme = () => setDarkMode((prev) => !prev);

  return (
    <Themecontext.Provider value={{ darkMode, toggleTheme }}>
      {children}
    </Themecontext.Provider>
  );
};

export const useTheme = () => useContext(Themecontext);
