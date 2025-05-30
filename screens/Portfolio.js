import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
  Share,
  Alert,
  LayoutAnimation,
  Platform,
  UIManager,
} from "react-native";
import { usePortfolio, removeFromPortfolio, loadPortfolio } from "./PortfolioContext"; // Make sure loadPortfolio is exported
import Swipeable from "react-native-gesture-handler/Swipeable";
import { RectButton } from "react-native-gesture-handler";
import Toast from "react-native-toast-message";
import { useFocusEffect } from "@react-navigation/native";

const screenWidth = Dimensions.get("window").width;

export default function Portfolio() {
  const { portfolio, removeFromPortfolio, loadPortfolio } = usePortfolio();
  const [enrichedPortfolio, setEnrichedPortfolio] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (Platform.OS === "android") {
      UIManager.setLayoutAnimationEnabledExperimental &&
        UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }, []);
  

  const fetchMarketData = async () => {
    if (portfolio.length === 0) {
      setEnrichedPortfolio([]);
      return;
    }

    try {
      const coinIds = portfolio.map((item) => item.id).join(",");
      const response = await fetch(
       `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${coinIds}`
      );
      const marketData = await response.json();

      const enriched = portfolio.map((item) => {
        const coin = marketData.find((c) => c.id === item.id);
        return {
          ...item,
          name: coin?.name || item.id,
          current_price: coin?.current_price || 0,
          image: coin?.image || null,
        };
      });

      setEnrichedPortfolio(enriched);
    } catch (error) {
      console.error("Failed to fetch market data", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      const loadAndFetch = async () => {
        await loadPortfolio(); // Refresh context data
        await fetchMarketData(); // Enrich and update local state
      };
      loadAndFetch();
    }, [])
  );
  useEffect(() => {
    fetchMarketData(); 
  }, [portfolio]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadPortfolio();
    // await fetchMarketData();
    setRefreshing(false);
  };

  const handleShare = async (item) => {
    try {
      const symbol = item.symbol ? item.symbol.toUpperCase() : "N/A";
      const name = item.name || "Unknown Coin";
      const price = item.current_price
        ? `$${item.current_price.toLocaleString()}`
        : "N/A";
      const amount = item.amount || 0;
      const coinLink = item.id
        ? `https://www.coingecko.com/en/coins/${item.id}`
        : "";

      const message = `Check out this coin in my portfolio ${name} (${symbol})\nCurrent price ${price}\nAmount Owned: ${amount} \n\nLearn more: ${coinLink}`;
      await Share.share({ message });
    } catch (error) {
      console.error("Error sharing", error);
    }
  };

  const renderRightActions = (item) => (
    <View style={{ flex: 0, flexDirection: "row" }}>
      <RectButton
        style={[styles.rightAction, { backgroundColor: "green" }]}
        onPress={() => handleShare(item)}
      >
        <Text style={styles.actionText}>Share</Text>
      </RectButton>

      <RectButton
        style={styles.rightAction}
        onPress={() => {
          Alert.alert(
            "Remove Coin!",
           ` Are you sure you want to remove ${item.name} from your portfolio?`,
            [
              { text: "Cancel", style: "cancel" },
              {
                text: "Remove",
                style: "destructive",
                onPress: () => {
                  LayoutAnimation.configureNext(
                    LayoutAnimation.Presets.easeInEaseOut
                  );
                  removeFromPortfolio(item.id);
                  Toast.show({
                    type: "success",
                    text1: `${item.name} removed!`,
                    position: "bottom",
                    visibilityTime: 2000,
                  });
                },
              },
            ]
          );
        }}
      >
        <Text style={styles.actionText}>Remove</Text>
      </RectButton>
    </View>
  );

  const renderItem = ({ item }) => (
    <Swipeable renderRightActions={() => renderRightActions(item)}>
      <View style={styles.card}>
        {item.image && (
          <Image source={{ uri: item.image }} style={styles.image} />
        )}
        <View style={{ marginLeft: 10 }}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.price}>
            Price: ${item.current_price.toLocaleString()}
          </Text>
          <Text style={styles.amount}>
            Amount Owned: {item.amount.toLocaleString()} {item.symbol.toUpperCase()}
          </Text>
          <Text style={styles.total}>
            Worth: ${(item.current_price * item.amount).toLocaleString()}
          </Text>
        </View>
      </View>
    </Swipeable>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "black" }}>
      <View style={styles.container}>
        <Text style={styles.header}>Your Portfolio</Text>
        {enrichedPortfolio.length === 0 ? (
          <Text style={styles.empty}>No coins in your portfolio.</Text>
        ) : (
          <FlatList
            data={enrichedPortfolio}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    padding: 20,
  },
  header: {
    fontSize: 24,
    color: "#00f5cc",
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#1e1e1e",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    alignItems: "center",
  },
  image: { width: 40, height: 40, borderRadius: 20 },
  name: { color: "white", fontSize: 18 },
  price: { color: "#ccc" },
  amount: { color: "#ccc" },
  total: { color: "#00f5cc", fontWeight: "bold", fontSize: 19 },
  empty: {
    color: "#888",
    textAlign: "center",
    marginTop: 100,
    fontSize: 16,
  },
  rightAction: {
    backgroundColor: "red",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    borderRadius: 10,
    marginBottom: 15,
    marginLeft: 5,
    width: 100,
  },
  actionText: {
    color: "#fff",
},
});