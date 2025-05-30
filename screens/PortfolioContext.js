import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const PortfolioContext = createContext();

export const PortfolioProvider = ({ children }) => {
  const [portfolio, setPortfolio] = useState([]);

  // Load from storage when app starts
  useEffect(() => {
    loadPortfolio();
  }, []);

  const savePortfolio = async (data) => {
    setPortfolio(data);
    await AsyncStorage.setItem("@portfolio", JSON.stringify(data));
  };

  const loadPortfolio = async () => {
    try {
      const stored = await AsyncStorage.getItem("@portfolio");
      const parsed = stored ? JSON.parse(stored) : [];
      setPortfolio(parsed);
    } catch (error) {
      console.error("Failed to load portfolio:", error);
      setPortfolio([]); // fallback to empty array
    }
  };

  const clearCoin = async () => {
    setPortfolio([]);
    await AsyncStorage.removeItem("@portfolio");
  }

  const addCoin = async (newCoin) => {
    try {
      const exists = portfolio.find((c) => c.id === newCoin.id);
      let updated;

      if (exists) {
        updated = portfolio.map((c) =>
          c.id === newCoin.id
            ? {
                ...c,
                amount: parseFloat(c.amount) + parseFloat(newCoin.amount),
              }
            : c
        );
      } else {
        updated = [...portfolio, newCoin];
      }

      await savePortfolio(updated);
    } catch (error) {
      console.error("Failed to add coin:", error);
    }
  };

  const removeFromPortfolio = async (id) => {
    try {
      const updated = portfolio.filter((item) => item.id !== id);
      await savePortfolio(updated);
    } catch (error) {
      console.error("Failed to remove coin:", error);
    }
  };

  return (
    <PortfolioContext.Provider
      value={{ portfolio, addCoin, removeFromPortfolio, loadPortfolio, clearCoin }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => useContext(PortfolioContext);
