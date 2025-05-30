import React, { useEffect, useRef, useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import {
  View,
  Text,
  TextInput,
  FlatList,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  Modal,
  Dimensions,
  
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Coinitem from "../componenets/Coinitem";
import { useNavigation } from "@react-navigation/native";

const  width  = Dimensions.get("screen").width - 200;
const height  = Dimensions.get("screen").height - 200;


const Homescreen = () => {
  const [coins, setCoins] = useState([]);
  const [search, setSearch] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profileimage, setProfileimage] = useState(null)
  const [backgroundcolor, setBackgroundcolor] = useState("red")
  const [modalvisible, setModalvisible] = useState(false)

 

  const colors = ["green", "red", "purple", "blue","pink", "orange","#00f5cc","grey", "brown", "yellow"]

  const flatListRef = useRef(null);
  const navigation = useNavigation();

  useEffect(() => {
    const randompick = Math.floor(Math.random() * colors.length);
    setBackgroundcolor(colors[randompick]);
  }, []);

  useFocusEffect(
    useCallback(() => {
      const loadimage = async () => {
        const uri = await AsyncStorage.getItem("profile_image");

        if (uri) {
          setProfileimage(uri);
          
        }
        
        
        
      };
      loadimage()
    }, [])
  );

  const fetchCoins = async () => {
    try {
      const res = await axios.get(
        "https://api.coingecko.com/api/v3/coins/markets",
        {
          params: {
            vs_currency: "usd",
            order: "market_cap_desc",
            per_page: 200,
            page: 1,
            sparkline: false,
          },
        }
      );
      setCoins(res.data);
    } catch (error) {
      console.warn("Error fetching coins:", error.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchCoins();
  }, []);
  const navigateToSettings = () => {
    setModalvisible(false)
    setTimeout(() => {
      navigation.navigate("Settings")
    }, 1000)
  }


  // useEffect(() => {
  //   (async () => {
  //     const storedImage = await AsyncStorage.getItem("profile_image");
  //     if (storedImage) setImage(storedImage);
  //   })();
  // }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchCoins();
  };

  const filteredCoins = coins.filter(
    (coin) =>
      coin.name.toLowerCase().includes(search.toLowerCase()) ||
      coin.symbol.toLowerCase().includes(search.toLowerCase())
  );

  // Scroll to first search match when search changes
  useEffect(() => {
    if (search && filteredCoins.length > 0 && flatListRef.current) {
      flatListRef.current.scrollToIndex({
        index: 0,
        animated: true,
        viewPosition: 0.5,
      });
    }
  }, [search]);

  const renderItem = ({ item, index }) => (
    <Coinitem
     
      item={item}
      index={index}
      search={search}
      onPress={() => navigation.navigate("Coindetailscreen", { coin: item })}
    />
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "black" }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Text style={{ color: "white", fontStyle: "italic", marginTop: 20 }}>
          Welcome back!
        </Text>
        <TouchableOpacity onPress={() => setModalvisible(true)}>
          <View style={styles.contain}>
            {profileimage ? (
              <Image
                source={{ uri: profileimage }}
                style={styles.profileimage}
              />
            ) : (
              <View style={[styles.backgroundchange, { backgroundcolor }]}>
                <Text
                  style={{ textAlign: "center", fontSize: 9, color: "black" }}
                >
                  Profile
                </Text>
              </View>
            )}
          </View>
        </TouchableOpacity>
      </View>
      <Modal
        visible={modalvisible}
        transparent={true}
        animatioType="fade"
        onRequestClose={() => setModalvisible(false)}
        style={{ height: 400, width: 400, borderRadius: "50%" }}
      >
        <View style={styles.container22}>
          <TouchableOpacity
            onPress={() => setModalvisible(false)}
            style={styles.backdrop}
          />
          
            
              <Image source={{ uri: profileimage }} style={styles.fullimage} />
            
          
        </View>
      </Modal>
      <View
        style={{
          marginTop: 20,
          padding: 15,
          backgroundColor: "#00f5cc",
          borderRadius: 5,
        }}
      >
        <Text
          style={{
            textAlign: "center",
            color: "black",
            fontWeight: "bold",
            fontSize: 25,
          }}
        >
          TOP CRYPTOCOINS.
        </Text>
      </View>
      <View style={styles.searchContainer}>
        <TextInput
          placeholder="Search for Coin..."
          value={search}
          onChangeText={setSearch}
          style={styles.searchInput}
        />
      </View>

      {loading ? (
        <ActivityIndicator color="#00f5cc" size={40} />
      ) : filteredCoins.length === 0 ? (
        <Text style={styles.statusText}>No coins matched your search.</Text>
      ) : (
        <FlatList
          ref={flatListRef}
          data={filteredCoins}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          initialNumToRender={12}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          getItemLayout={(data, index) => ({
            length: 80,
            offset: 80 * index,
            index,
          })}
          onScrollToIndexFailed={(info) => {
            setTimeout(() => {
              flatListRef.current?.scrollToIndex({
                index: info.index,
                animated: true,
              });
            }, 300);
          }}
        />
      )}
    </SafeAreaView>
  );
};

export default Homescreen;

const styles = StyleSheet.create({
  searchContainer: {
    padding: 16,
  },
  container22: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0,8)",
    justifyContent: "center",
    alignItems: "center",
    height: 400,
    width: 400,
    borderRadius: "50%",

  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  fullimage: {
    width: 380,
    height: 380,
    borderRadius: "50%",
    // resizeMode: "contain",
    marginTop: 60,
    
  },
  searchInput: {
    height: 40,
    borderRadius: 10,
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 12,
  },
  placeholder: {
    width: 50,
    height: 50,
    backgroundColor: "green",
    borderRadius: 50,
  },
  statusText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "white",
  },
  contain: {
    flex: 0,

    alignItems: "flex-end",
    justifyContent: "flex-end",
  },
  profileimage: {
    width: 50,
    height: 50,
    borderRadius: 50,
  },
  backgroundchange: {
    width: 50,
    height: 50,
    borderRadius: 50,
    backgroundColor: "grey",
    opacity: 0.9,
    flex: 0,
    alignContent: "center",
    justifyContent: "center",
  },

  addButton: {
    position: "absolute",
    right: 20,
    top: "75%",
    transform: [{ translateY: -30 }],
    backgroundColor: "#00f5cc",
    borderRadius: 30,
    width: 60,
    height: 60,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 999,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  addButtonText: {
    color: "black",
    fontWeight: "bold",
    fontSize: 12,
    textAlign: "center",
  },
});
