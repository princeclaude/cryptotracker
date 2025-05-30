// PriceAlertManager.js
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";

export const checkpricealerts= async () => {
  try {
    const stored = await AsyncStorage.getItem("alerts");
    const alerts = JSON.parse(stored) || [];

    if (alerts.length === 0) return;

    const ids = alerts.map(alert => alert.id).join(",");
    const res = await fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${ids}`);
    const data = await res.json();

    for (const coin of data) {
      const matchingAlerts = alerts.filter(a => a.id === coin.id && coin.current_price >= a.target);
      for (const alert of matchingAlerts) {
       
        await Notifications.scheduleNotificationAsync({
          content: {
            title: `${coin.name} reached your target!`,
            body: `${coin.name} is now $${coin.current_price}`,
          },
          trigger: null,
        });

       
        const remaining = alerts.filter(a => !(a.id === alert.id && a.target === alert.target));
        await AsyncStorage.setItem("alerts", JSON.stringify(remaining));
      }
    }
  } catch (error) {
    console.error("Price alert check failed",error);
}
};