import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ThemeProvider } from "./Themecontext";
import * as notifications from "expo-notifications";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import Signup from "./screens/Signup";
import Signin from "./screens/Signin";
import Homescreen from "./screens/Homescreen";
import Coindetailscreen from "./screens/Coindetailscreen";
import Onboardingscreen from "./screens/Onboardingscreen";
import AddToPortfolioScreen from "./AddToPortofolioScreen";
import Maintab from "./screens/Maintab";
import Portfolio from "./screens/Portfolio";

import { PortfolioProvider } from "./screens/PortfolioContext";
import { checkpricealerts } from "./Pricealertmanager";
import Toast from "react-native-toast-message";

const Stack = createNativeStackNavigator();

export default function App() {
  useEffect(() => {
    notifications.requestPermissionsAsync();
    notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
      }),
    });
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      checkpricealerts();
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <PortfolioProvider>
          <NavigationContainer>
            <Stack.Navigator
              initialRouteName="Onboarding"
              screenOptions={{ headerShown: false }}
            >
              <Stack.Screen name="Onboarding" component={Onboardingscreen} />
              <Stack.Screen name="Signin" component={Signin} />
              <Stack.Screen name="Signup" component={Signup} />
              <Stack.Screen name="Main" component={Maintab} />
              <Stack.Screen
                name="Coindetailscreen"
                component={Coindetailscreen}
              />
              <Stack.Screen
                name="AddToPortofolio"
                component={AddToPortfolioScreen}
              />
              <Stack.Screen
                name="Portfolio"
                component={Portfolio}
              />
            </Stack.Navigator>
          </NavigationContainer>
        </PortfolioProvider>
      </ThemeProvider>
      <Toast/>
    </GestureHandlerRootView>
  );
}
