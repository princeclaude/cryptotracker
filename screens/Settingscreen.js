// src/screens/SettingsScreen.js
import React, { useState,useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert, Switch, SafeAreaView, Modal, Button, Image } from "react-native";
import * as SecureStore from "expo-secure-store";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../Themecontext"; 
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { usePortfolio } from "./PortfolioContext";



const Settingscreen = () => {
    const navigation = useNavigation();
  const { darkMode, toggleTheme } = useTheme()
  const [modalvisible, setModalvisible] = useState(false)
  const [image, setImage] = useState(null);

  const { clearCoin } = usePortfolio();


  useEffect(() => {
    // Load previously saved profile image
    (async () => {
      const savedImage = await AsyncStorage.getItem("profile_image");
      if (savedImage) setImage(savedImage);
    })();
  }, []);

  

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Denied", "Please allow access to your photos.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "Images",
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setImage(uri);
      await AsyncStorage.setItem("profile_image", uri);
      Alert.alert("Image set!")
      
    }
  };

  const handleSignOut = async () => {
    // await SecureStore.deleteItemAsync("userKey");
    navigation.replace("Onboarding"); 
  };
  const handleClearPortfolio = async () => {
    try {
      await AsyncStorage.removeItem("@portfolio");
      Alert.alert("Portfolio data cleared");
    } catch (error) {
      Alert.alert("Failed to clear portfolio data");
    }
  };

  const handleDeleteKey = async () => {
    try {
      const storedKey = await SecureStore.getItemAsync("userKey");
      if (storedKey) {
        await SecureStore.deleteItemAsync("userKey");
        await AsyncStorage.removeItem("profile_image")
        await AsyncStorage.removeItem("favorites")
        clearCoin()
        Alert.alert("Key deleted successfully");
        setModalvisible(false);
        navigation.reset({
          index: 0,
          routes: [{ name: "Signup" }],
        });
      } else {
        Alert.alert("No key found to delete.");
        setModalvisible(false);
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error deleting key.");
      setModalvisible(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View
        style={[
          styles.container,
          { backgroundColor: darkMode ? "#0e1117" : "#fff" },
        ]}
      >
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Text style={[styles.title, { color: darkMode ? "#fff" : "#000" }]}>
            Settings
          </Text>
          <View style={styles.row}>
            {/* <Text style={[styles.label, { color: darkMode ? "#fff" : "#000" }]}>
            Dark Mode
          </Text> */}
            <Switch value={darkMode} onValueChange={toggleTheme} />
          </View>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleSignOut}>
          <Text style={styles.buttonText}>Sign Out</Text>
        </TouchableOpacity>
        <View style={styles.container}>
        
            <Button
              title="Delete Key"
              color="red"
              onPress={() => setModalvisible(true)}
            />
          
          <Modal
            visible={modalvisible}
            transparent
            animationType="slide"
            onRequestClose={() => setModalvisible(false)}
            
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <Text style={styles.modalText}>
                  Are you sure you want to delete your key?
                  you might loose all saved data!
                </Text>
                <View style={styles.buttonRow}>
                  <Button
                    title="Cancel"
                    onPress={() => setModalvisible(false)}
                  />
                  <Button title="OK" color="red" onPress={handleDeleteKey} />
                </View>
              </View>
            </View>
          </Modal>
        </View>
        <View style={{marginBottom: 400}}>
          <Button title="Clear Portfolio" onPress={handleClearPortfolio}/>
        </View>

        <View>
          {image && (
            <Image source={{ uri: image }} style={styles.profileImage} />
          )}
          <Button title="Change Profile Picture" onPress={pickImage} />
          
        </View>

        <Text style={[styles.version, { color: darkMode ? "#888" : "#444" }]}>
          App Version 1.0.0
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default Settingscreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0e1117",
    padding: 20,
    justifyContent: "space-between",
  },
  container299: { flex: 1, justifyContent: "center", padding: 20 },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#00000099",
  },
  modalContent: {
    backgroundColor: "#00f5cc",
    padding: 25,
    borderRadius: 10,
    width: "80%",
  },
  modalText: { fontSize: 18, marginBottom: 20, textAlign: "center" },
  buttonRow: { flexDirection: "row", justifyContent: "space-around" },
  title: {
    fontSize: 24,
    color: "#fff",
    marginTop: 0,
  },
  button: {
    // backgroundColor: "#1c1f26",
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  buttonText: {
    color: "#ff5e5e",
    textAlign: "center",
    fontWeight: "bold",
  },
  
  version: {
    color: "#888",
    textAlign: "center",
    marginBottom: 40,
  },
});
