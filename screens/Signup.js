import React, {useState} from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import uuid from 'react-native-uuid';
import * as Clipboard from "expo-clipboard";
import * as SecureStore from 'expo-secure-store';
import { FontAwesome } from "@expo/vector-icons";


export default function Signup() {
  const[generatedkey, setGeneratedkey] = useState('')
  const navigation = useNavigation();

  const handleGenerateKey = async () => {
    const newKey = uuid.v4();
    setGeneratedkey(newKey)

    try {
      // Save to clipboard
      await Clipboard.setStringAsync(newKey);

      // Save to AsyncStorage
      await SecureStore.setItemAsync("userKey", newKey);

      Alert.alert(
        "Key Generated & Copied",
        "Your unique sign-in key has been copied to your clipboard. You can paste and save it anywhere safe.",
        [
          {
            text: "Continue to Sign In",
            onPress: () => navigation.navigate("Signin"),
            },
            {
                text: "Home",
                onPress: () => navigation.navigate("Onboarding")
            }
        ]
      );
    } catch (error) {
      Alert.alert("Error", "Something went wrong. Please try again.");
      console.error(error);
    }
  };

  return (
    <ImageBackground
      source={require("../images/image1.jpg")}
      style={styles.background}
      imageStyle={{ opacity: 0.8 }}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.overlay}
      >
        <Text style={styles.title}>Sign Up</Text>
        <Text style={styles.description}>
          Tap below to generate your secure sign-in key.
        </Text>

        <TouchableOpacity style={styles.button} onPress={handleGenerateKey}>
          <Text style={styles.buttonText}>Generate Key</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("Signin")}>
          <Text style={styles.link}>Already have a key? Sign In</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "center",
  },
  overlay: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 32,
    color: "#00f5cc",
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  description: {
    color: "white",
    fontSize: 18,
    marginBottom: 40,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#00f5cc",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
  },
  buttonText: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 16,
  },
  link: {
    color: "#00f5cc",
    textAlign: "center",
      fontSize: 14,
    marginTop: 50,
    textDecorationLine: "underline"
  },
});
