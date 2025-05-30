import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Homescreen from "./Homescreen"
import Portfolio from "./Portfolio";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import Settingscreen from "./Settingscreen";
import Favoritescreen from "./Favoritescreen";
import PortfolioScreen from "./Portfolio";
import AddToPortfolioScreen from "../AddToPortofolioScreen";


const Tab = createBottomTabNavigator();

const Maintab = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          position: "absolute",
          bottom: 20,
          left: 20,
          right: 20,
          backgroundColor: "#1c1c1e",
          borderRadius: 25,
          height: 60,
          elevation: 5,
          shadowColor: "#00f5cc",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 1.0,
          shadowRadius: 4,
        },
        tabBarIcon: ({ focused, color, size }) => {
          if (route.name === "Home") {
            return (
              <Ionicons
                name={focused ? "home" : "home-outline"}
                size={size}
                color={color}
              />
            );
          } else if (route.name === "Portfolio") {
            return (
              <MaterialIcons
                name={focused ? "pie-chart" : "pie-chart-outline"}
                size={size}
                color={color}
              />
            );
          }
        },
        tabBarActiveTintColor: "#00ffcc",
        tabBarInactiveTintColor: "#aaa",
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
        },
      })}
    >
      <Tab.Screen name="Home" component={Homescreen} />
      <Tab.Screen name="Portfolio" component={PortfolioScreen}
        options={{
          tabBarLabel: "Portofolio",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="wallet" size={size } color={color} />
            
          ),
        }}
        
      />
      <Tab.Screen
        name="Favorites"
        component={Favoritescreen}
        options={{
          tabBarLabel: "Favorites",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="heart-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={Settingscreen}
        options={{
          tabBarLabel: "Settings",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings-outline" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default Maintab;
