import React, { useState, useEffect } from "react";
import { View, TextInput, Button, StyleSheet, Text, Alert, Image, TouchableWithoutFeedback } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

import { useRoute } from "@react-navigation/native";
import Toast from "react-native-toast-message";

export default function AddToPortfolioScreen({ navigation }) {
  
  const route = useRoute();
  const coinId = route.params?.coinId;

  const [amount, setAmount] = useState("");
  const [coin, setCoin] = useState(null);

  useEffect(() => {
    const fetchCoin = async () => {
      try {
        const res = await axios.get(`https://api.coingecko.com/api/v3/coins/markets`, {
          params: {
            vs_currency: "usd",
            ids: coinId,
          },
        });
        setCoin(res.data[0]);
      } catch (error) {
        console.error("Failed to fetch coin data", error);
      }
    };

    if (coinId) fetchCoin();
  }, [coinId]);

  const addToPortfolio = async () => {
    if (!amount) return Alert.alert("Please enter amount");

    const newItem = {
      id: coin.id,
      name: coin.name,
      symbol: coin.symbol,
      image: coin.image,
      amount: parseFloat(amount),
    };

    const stored = JSON.parse(await AsyncStorage.getItem("@portfolio")) || [];
    const updated = [...stored.filter(item => item.id !== coin.id), newItem];
    await AsyncStorage.setItem("@portfolio", JSON.stringify(updated));
   
    Toast.show({
      type: "success",
      text1: `${coin.name} added to portfolio!`,
      position: "top",
      visibilityTime: 2000,

      

    })
    navigation.goBack();
  };

  if (!coin) {
    return (
      <View style={styles.container}>
        <Text style={{ color: "white" }}>Loading coin...</Text>
      </View>
    );
  }

  return (
    <TouchableWithoutFeedback onPress={() => navigation.goBack()}>
      <View style={styles.container}>
        <Image source={{ uri: coin.image }} style={styles.image} />
        <Text style={styles.title}>{coin.name}</Text>

        <TextInput
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
          placeholder="Enter amount owned"
          placeholderTextColor="gray"
          style={styles.input}
        />

        <Button title="Add to Portfolio" onPress={addToPortfolio} />
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  image: {
    width: 60,
    height: 60,
    marginBottom: 10,
  },
  title: {
    color: "white",
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    width: "100%",
    borderColor: "gray",
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
    color: "white",
    marginBottom:20,
},
});