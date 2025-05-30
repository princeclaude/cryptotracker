import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
    StyleSheet,
    SafeAreaView,
  Dimensions,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";


const height = Dimensions.get("screen").height;
const show = height - 500;

export default function Favoritescreen() {
    const [favorites, setFavorites] = useState([]);
    const [message, setMessage] = useState("");
  const navigation = useNavigation();

  useEffect(() => {
    const loadFavorites = async () => {
        const data = JSON.parse(await AsyncStorage.getItem("favorites")) || [];
        if (!data) {
            setMessage(" You have nothing in your Favorites!")
            
        }
        setFavorites(data);
        
    };

    const unsubscribe = navigation.addListener("focus", loadFavorites); // Refresh on tab switch
    return unsubscribe;
  }, [navigation]);

  const goToDetails = (coin) => {
    navigation.navigate("Coindetailscreen", { coin });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "black" }}>
      <View style={{ flex: 0, backgroundColor: "black", padding: 16 }}>
        <Text style={{ color: "#00f5cc", fontSize: 27, marginBottom: 10, textAlign:"center", fontWeight: "bold"}}>
          Favorite Coins
        </Text>

        {favorites.length === 0 ? (
          <View
            style={{
              flex: 0,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "black",
              padding: 20,
            }}
          >
            <Text
              style={{
                color: "white",
                margin: "auto",
                fontWeight: "bold",
                marginTop: show,
              }}
            >
              Nothing in Favorites!
            </Text>
          </View>
        ) : (
          <FlatList
            data={favorites}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.item}
                onPress={() => goToDetails(item)}
              >
                <Text style={styles.itemText}>{item.name}</Text>
              </TouchableOpacity>
            )}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  item: {
    padding: 16,
    backgroundColor: "#222",
    borderRadius: 10,
    marginBottom: 10,
  },
  itemText: {
    color: "white",
    fontSize: 16,
  },
});
