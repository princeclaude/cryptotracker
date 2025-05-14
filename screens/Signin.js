

import React, {useState} from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  KeyboardAvoidingView,
    Platform,
  Alert
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome } from "@expo/vector-icons";
import * as SecureStore from 'expo-secure-store';


export default function Signin() {
    const navigation = useNavigation();
    const [enteredkey, setenteredkey] = useState('')

  const handlesignin = async () => {
    if (!enteredkey.trim()) {
      console.log("no key entered")
      Alert.alert("please enter a valid key!");
      return;
    }
        
            
        
    try {
      const storedkey = await SecureStore.getItemAsync('userkey');
      console.log("stored data", storedkey)
      if (!storedkey) {
        Alert.alert("No key found, signup to get Key!")
        return;
                
                
      }
      if (enteredkey === storedkey) {
        Alert.alert("success! signed in")
                
      }
      else {
        Alert.alert("Invalid key, the key you entered is incorrect!")
      }
    } catch (error) {
      Alert.alert("Error! Something went wrong while signing in...")
      console.log(error);
    }

  };

  // const gotosignup = () => {
  //   navigation.navigate('Signup')
  // };

  return (
    <ImageBackground
      source={require("../images/image1.jpg")}
      style={styles.background}
      imageStyle={{ opacity: 0.8}}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.overlay}
          >
              <TouchableOpacity style={{position: "absolute", top: 70, marginLeft: 15}} onPress={() => navigation.goBack()}>
                  <FontAwesome name="arrow-left" size={20} color="#00f5cc"/>
              </TouchableOpacity>
        <Text style={styles.title}>Sign In</Text>
        <TextInput
          placeholder="Enter your key"
          placeholderTextColor="#999"
                  style={styles.input}
                  value={enteredkey}
                  onChangeText={setenteredkey}
        />

              <TouchableOpacity onPress={handlesignin} style={styles.button}>
          <Text style={styles.buttonText}>Sign In</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
          <Text style={styles.link}>Don't have a key? Sign Up</Text>
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
    marginBottom: 40,
    textAlign: "center",
  },
  input: {
    height: 50,
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    marginBottom: 20,
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
      textDecorationLine: "underline",
      marginTop: 50,
    },
});
