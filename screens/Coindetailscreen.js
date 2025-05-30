import React, {useState, useEffect, useContext} from "react";
import { View, Text, Image, StyleSheet, SafeAreaView, Dimensions,Linking, Alert, TextInput, Button,ScrollView, TouchableOpacity, Modal, Keyboard , TouchableWithoutFeedback} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LineChart } from "react-native-chart-kit";
import axios from "axios";
import { usePortfolio } from "./PortfolioContext";
import Socialmetrics from "../componenets/Socialmetrics";




export default function Coindetailscreen({ route }) {

  const { portfolio, addCoin, removeCoin } = usePortfolio();
  const navigation = useNavigation();
  const { coin } = route.params;
  const [alert_price, setAlert_price] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [chartdata, setChartdata] = useState([])
  const [isfavorite, setIsfavorite] = useState(false)
  const [ActionMenuVisible, setActionMenuVisible] = useState(false)
  const inportfolio = portfolio.some((item) => item.id === coin.id)
  const[ngnrate, setNgnrate] = useState(null)
  const [convertedprice, setConvertedprice] = useState(null);
  const [currencymodalvisible, setCurrencymodalvisible] = useState(false);
  const [currencies, setCurrencies] = useState([]);

  const screenwidth = Dimensions.get("window").width;
  const fiatCurrencies = [
    "USD",
    "EUR",
    "GBP",
    "NGN",
    "JPY",
    "CAD",
    "AUD",
    "ZAR",
    "INR",
    "BRL",
    "YERN",
    "CEDIS",
    
  ];


  const fetchCurrencies = async () => {
    try {
      const res = await fetch(
        "https://api.coingecko.com/api/v3/simple/supported_vs_currencies"
      );
      const data = await res.json();
      const currencyList = data.map((c) => c.toUpperCase());
      setCurrencies(currencyList);
      setCurrencymodalvisible(true);
    } catch (error) {
      console.error("Failed to fetch currencies", error);
    }
  };
  const openTradeLink = (coinId) => {
    const url = `https://www.coinmarketcap.com/currencies/${coinId}`;
    Linking.openURL(url);
  };



  const convertToCurrency = async (selectedCurrency) => {
    try {
      const res = await fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=${coin.id}&vs_currencies=${selectedCurrency.toLowerCase()}`
      );
      const data = await res.json();
      const converted = data[coin.id][selectedCurrency.toLowerCase()];
      Alert.alert(
        `${coin.name} Price in ${selectedCurrency}`,
        `${converted.toLocaleString()} ${selectedCurrency}`
      );
      setCurrencymodalvisible(false);
    } catch (error) {
      console.error("Conversion failed", error);
  }
  };
  useEffect(() => {
    const checkFavorite = async () => {
      const stored = JSON.parse(await AsyncStorage.getItem("favorites")) || [];
      const exists = stored.some((item) => item.id === coin.id);
      setIsfavorite(exists);
    };
    checkFavorite();
  }, []);

  const convertToNaira = async () => {
    try {
      const response = await fetch(
        "https://api.exchangerate-api.com/v4/latest/USD"
      );
      const data = await response.json();
      const rate = data.rates.NGN;
      setNgnrate(rate);

      const nairaValue = (coin.current_price * rate).toLocaleString();
      setConvertedprice(nairaValue);
      Alert.alert(`${coin.name} Price in Naira: ₦${nairaValue}`);
    } catch (error) {
      console.error("Failed to fetch exchange rate", error);
    }
  };

  const toggleFavorite = async () => {
    const stored = JSON.parse(await AsyncStorage.getItem("favorites")) || [];
    if (isfavorite) {
      const updated = stored.filter((item) => item.id !== coin.id);
      await AsyncStorage.setItem("favorites", JSON.stringify(updated));
      setIsfavorite(false);
      Alert.alert("Removed from Favorites");
    } else {
      const updated = [...stored, coin];
      await AsyncStorage.setItem("favorites", JSON.stringify(updated));
      setIsfavorite(true);
      Alert.alert("Added to Favorites");
    }
  };
  const togglePortfolio = () => {
    if (inportfolio) {
      removeCoin(coin.id);
    } else {
      addCoin(coin, 1); // Default amount or prompt for input
    }
  };


  useEffect(() => {
    const fetchChart = async () => {
      try {
        const res = await axios.get(
          `https://api.coingecko.com/api/v3/coins/${coin.id}/market_chart`,
          {
            params: {
              vs_currency: "usd",
              days: 7,
            },
          }
        );
        const prices = res.data.prices.map(price => price[1]);
        setChartdata(prices);
      } catch (err) {
        console.error("Failed to fetch chart data", err);
      }
    };
  
    fetchChart();
  },[]);

  const saveAlert = async () => {
    if (!alert_price) return Alert.alert("Please enter price!");

  const alert = { id: coin.id, target: parseFloat(alert_price) };
    const existing = JSON.parse(await AsyncStorage.getItem('alerts')) || [];
    
    await AsyncStorage.setItem('alerts', JSON.stringify([...existing, alert]));
    Keyboard.dismiss();
    Alert.alert('Alert saved!', `You'll be notified when ${coin.name} hits $${alert_price}`);
    setModalVisible(false)
    setAlert_price("");
};

  return (
    <View style={{ flex: 1, position: "relative" }}>
      <View
        style={{
          flexDirection: "row",
          backgroundColor: "black",
          justifyContent: "space-between",
          padding: 30,
          borderRadius: 3,
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1,
        }}
      >
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <FontAwesome
            name="arrow-left"
            color="#00f5cc"
            size={20}
            style={{ marginLeft: 0, marginTop: 20 }}
          />
        </TouchableOpacity>
        <View>
          <TouchableOpacity onPress={() => openTradeLink(coin.id)}>
            <Text
              style={{
                color: "#00f5cc",
                marginTop: 20,
                textAlign: "center",
                fontSize: 16,
                
              }}
            >
              Trade this coin
            </Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={() => setActionMenuVisible(true)}>
          <FontAwesome
            name="ellipsis-v"
            color="#00f5cc"
            size={30}
            style={{ marginTop: 20 }}
          />
        </TouchableOpacity>
      </View>

      <ScrollView style={{ flex: 1, backgroundColor: "black" }}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <SafeAreaView style={{ backgroundColor: "black", flex: 0 }}>
            <View style={{ marginTop: 80 }}>
              <Text style={styles.modalTitle}>
                Set Price Alert for {coin.name}
              </Text>
              <TextInput
                value={alert_price}
                onChangeText={setAlert_price}
                placeholder="Enter target price..."
                placeholderTextColor="white"
                keyboardType="numeric"
                style={{
                  borderWidth: 1,
                  marginBottom: 10,
                  padding: 8,
                  color: "white",
                  borderColor: "white",
                  borderRadius: 5,
                }}
              />
              {/* <Button title="Set Price Alert" onPress={saveAlert} /> */}
              <TouchableOpacity
                style={{
                  padding: 15,
                  width: 200,
                  margin: "auto",
                  borderRadius: 20,
                  backgroundColor: "#00f5cc",
                  justifyContent: "center",
                  marginTop: 20,
                }}
                onPress={saveAlert}
              >
                <Text style={{ color: "black", textAlign: "center" }}>
                  Set Price Alert
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.container}>
              <Image source={{ uri: coin.image }} style={styles.image} />
              <Text style={styles.name}>{coin.name}</Text>
              <View style={{ marginTop: 20, width: "100%" }}>
                <View style={{ marginTop: 20, width: "100%" }}>
                  <InfoRow
                    label="Current Price"
                    value={"$" + coin.current_price?.toLocaleString()}
                  />
                  <InfoRow
                    label="Market Cap"
                    value={"$" + coin.market_cap?.toLocaleString()}
                  />
                  <InfoRow
                    label="24h High"
                    value={"$" + coin.high_24h?.toLocaleString()}
                  />
                  <InfoRow
                    label="24h Low"
                    value={"$" + coin.low_24h?.toLocaleString()}
                  />
                  <InfoRow
                    label="24h Change %"
                    value={coin.price_change_percentage_24h?.toFixed(2) + "%"}
                  />
                  <InfoRow
                    label="Circulating Supply"
                    value={coin.circulating_supply?.toLocaleString()}
                  />
                  <InfoRow
                    label="Total Supply"
                    value={coin.total_supply?.toLocaleString() || "N/A"}
                  />
                  <InfoRow
                    label="Max Supply"
                    value={coin.max_supply?.toLocaleString() || "N/A"}
                  />
                  <InfoRow
                    label="ATH"
                    value={"$" + coin.ath?.toLocaleString()}
                  />
                  <InfoRow
                    label="ATH Change %"
                    value={coin.ath_change_percentage?.toFixed(2) + "%"}
                  />
                </View>
              </View>

              {chartdata.length > 0 && (
                <LineChart
                  data={{
                    labels: [],
                    datasets: [
                      {
                        data: chartdata,
                      },
                    ],
                  }}
                  width={screenwidth - 10}
                  height={220}
                  yAxisLabel="$"
                  chartConfig={{
                    backgroundColor: "#000",
                    backgroundGradientFrom: "#1E2923",
                    backgroundGradientTo: "#08130D",
                    decimalPlaces: 2,
                    color: (opacity = 1) => `rgba(0, 245, 204, ${opacity})`,
                    labelColor: () => "#FFF",
                    propsForDots: {
                      r: "2",
                      strokeWidth: "1",
                      stroke: "#00f5cc",
                    },
                  }}
                  style={{
                    marginVertical: 20,
                    borderRadius: 16,
                    alignSelf: "center",
                  }}
                />
              )}
              {/* <TouchableOpacity
                style={{
                  marginTop: 16,
                  padding: 12,
                  backgroundColor: inportfolio ? "#ff3b30" : "#00f5cc",
                  borderRadius: 10,
                  alignItems: "center",
                  width: "80%",
                  alignSelf: "center",
                }}
                onPress={togglePortfolio}
              >
                <Text
                  style={{ color: "white", fontWeight: "bold", fontSize: 16 }}
                >
                  {inportfolio ? "Remove from Portfolio" : "Add to Portfolio"}
                </Text>
              </TouchableOpacity> */}

              <Modal visible={modalVisible} transparent animationType="slide">
                <View style={styles.modalOverlay}>
                  <View style={styles.modalContent}>
                    <TextInput
                      value={alert_price}
                      onChangeText={setAlert_price}
                      placeholder="Enter target price"
                      placeholderTextColor="white"
                      keyboardType="numeric"
                      style={styles.input}
                    />
                    <TouchableOpacity
                      style={styles.saveBtn}
                      onPress={saveAlert}
                    >
                      <Text style={styles.saveBtnText}>Save Alert</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setModalVisible(false)}>
                      <Text style={{ color: "white", marginTop: 10 }}>
                        Cancel
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </Modal>
              <Modal
                visible={ActionMenuVisible}
                transparent
                animationType="fade"
              >
                <TouchableWithoutFeedback
                  onPress={() => setActionMenuVisible(false)}
                >
                  <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                      <TouchableOpacity
                        onPress={() => {
                          toggleFavorite();
                          setActionMenuVisible(false);
                        }}
                      >
                        <Text style={styles.modalTitle}>
                          {isfavorite
                            ? "Remove from Favorites"
                            : "Add to Favorites"}
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        onPress={() => {
                          setActionMenuVisible(false);
                          navigation.navigate("AddToPortofolio", {
                            coinId: coin.id,
                          });
                        }}
                      >
                        <Text style={styles.modalTitle}>Add to Portfolio</Text>
                      </TouchableOpacity>

                      <TouchableOpacity>
                        <Text style={styles.modalTitle}>
                          Set automatic price alert
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        onPress={() => setActionMenuVisible(false)}
                      >
                        <Text style={{ color: "gray", marginTop: 10 }}>
                          Cancel
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </TouchableWithoutFeedback>
              </Modal>

              <Modal
                visible={currencymodalvisible}
                transparent
                animationType="slide"
              >
                <TouchableWithoutFeedback
                  onPress={() => setCurrencymodalvisible(false)}
                >
                  <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                      <Text style={styles.modalTitle}>Select a Currency</Text>
                      <ScrollView style={{ maxHeight: 300 }}>
                        {fiatCurrencies.map((cur) => (
                          <TouchableOpacity
                            key={cur}
                            onPress={() => convertToCurrency(cur)}
                            style={{ padding: 10 }}
                          >
                            <Text style={{ color: "white" }}>{cur}</Text>
                          </TouchableOpacity>
                        ))}
                      </ScrollView>
                      <TouchableOpacity
                        onPress={() => setCurrencymodalvisible(false)}
                      >
                        <Text style={{ color: "gray", marginTop: 30 }}>
                          Cancel
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </TouchableWithoutFeedback>
              </Modal>
              <View
                style={{
                  flex: 0,
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: 100,
                }}
              >
                <TouchableOpacity
                  onPress={() =>
                    Alert.alert("Sorry you can not use this feature now!")
                  }
                  style={{
                    marginTop: 20,
                    backgroundColor: "#00f5cc",
                    padding: 12,
                    borderRadius: 8,
                    alignSelf: "center",
                  }}
                >
                  <Text style={{ color: "black", fontWeight: "bold" }}>
                    Share this Coin
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={fetchCurrencies}
                  style={{
                    marginTop: 20,
                    backgroundColor: "#00f5cc",
                    padding: 12,
                    borderRadius: 8,
                    alignSelf: "center",
                  }}
                >
                  <Text style={{ color: "black", fontWeight: "bold" }}>
                    Convert Coin
                  </Text>
                </TouchableOpacity>
              </View>
              <Socialmetrics coinId={coin.id} />
            </View>
          </SafeAreaView>
        </TouchableWithoutFeedback>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, alignItems: "center" },
  image: { width: 80, height: 80, marginBottom: 16 },
  name: { fontSize: 37, fontWeight: "bold", color: "white" },
  price: { fontSize: 18, marginVertical: 8, color: "white" },
  trackBtn: {
    marginTop: 20,
    backgroundColor: "#1e90ff",
    padding: 12,
    borderRadius: 8,
  },
  trackBtnText: { color: "white", fontSize: 16, fontWeight: "600" },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
    
    
  },
  modalContent: {
    backgroundColor: "#222",
    padding: 24,
    borderRadius: 12,
    width: "80%",
    alignItems: "center",
  },
  modalTitle: {
    color: "white",
    fontSize: 18,
    marginBottom: 10,
    textAlign: "center",
  },
  input: {
    borderColor: "#ccc",
    borderWidth: 1,
    color: "white",
    width: "100%",
    padding: 10,
    marginBottom: 12,
    borderRadius: 6,
  },
  saveBtn: {
    backgroundColor: "#28a745",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  saveBtnText: { color: "white", fontWeight: "bold" },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingVertical: 8,
    borderBottomColor: "#333",
    borderBottomWidth: 2,
    
  },
  label: {
    color: "white",
    fontSize: 16,
  },
  value: {
    color: "#00f5cc",
    fontSize: 16,
    fontWeight: "bold",
  },
});

const InfoRow = ({ label, value }) => (
  <View style={styles.infoRow}>
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.value}>{value}</Text>
  
  </View>
);