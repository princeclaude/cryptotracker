

import React, { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  KeyboardAvoidingView,
    Platform,
  Alert,
  Button,
  Keyboard, 
  TouchableWithoutFeedback
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome } from "@expo/vector-icons";
import * as SecureStore from 'expo-secure-store';
import * as LocalAuthentication from 'expo-local-authentication';


export default function Signin() {
    const navigation = useNavigation();
  const [enteredkey, setenteredkey] = useState('')
  const [userkey, setUserkey] = useState('')
  const [keyexist, setKeyexist] = useState(null)
  const [counter, setCounter] = useState(0)
  const [showfk, setShowfkey] = useState(false)
  const [biometricsupported, setBiometricsupported] = useState(false);
  const [keyconfirm, setKeyconfirm] = useState(null);

  useEffect(() => {
    // Check if biometric authentication is supported
    (async () => {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      const enrolled = await LocalAuthentication.isEnrolledAsync();
      setBiometricsupported(compatible && enrolled);
    })();
  }, []);

  const handleFaceIDSignIn = async () => {
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: "Authenticate with Face ID",
        fallbackLabel: "Enter Password",
      });

      if (result.success) {
        navigation.replace("Main");
      } else {
        Alert.alert("Failed", "Face ID authentication failed");
      }
    } catch (error) {
      console.error("Face ID error:", error);
      Alert.alert("Error", "An error occurred during Face ID authentication.");
    }
  };
  

  

  useEffect(() => {
    const fetchKey = async () => {
      const userkey1 = await SecureStore.getItemAsync("userKey");
      if (userkey1) {
        const showstart = userkey1.slice(0, 5);
        const showend = userkey1.slice(-5);
        const maskedkey = "*".repeat(showend.length);
        const showall =` ${showstart}${maskedkey}`;
        setUserkey(showall);
        setKeyconfirm(true);
        const compatible = await LocalAuthentication.hasHardwareAsync();
        const enrolled = await LocalAuthentication.isEnrolledAsync();
        // if (compatible && enrolled) {
        //   handleFaceIDSignIn();
        // }
      }
    };
    fetchKey();
  },[]);

  

  const handlesignin = async () => {

    
    if (!enteredkey.trim()) {
      console.log("no key entered")
      Alert.alert("please enter a valid key!");
      return;
    }
        
            
        
    try {
      const storedkey = await SecureStore.getItemAsync('userKey');
      
      if (!storedkey) {
        setKeyexist("no")
        Alert.alert("No key found, signup to get Key!")
        setTimeout(() => navigation.navigate("Signup"), 2000)
        
        return;
                
                
      }
      if (enteredkey === storedkey) {
        setUserkey(storedkey)
        navigation.navigate("Main")
        
                
      }
      else {
        Alert.alert("Invalid key, the key you entered is incorrect!")
        const newcount = counter + 1;
        setCounter(newcount)
        if (counter >= 2) {
          setShowfkey(true)
        }
      }
    } catch (error) {
      Alert.alert("Error! Something went wrong while signing in...")
      console.log(error);
    }
    
  };
  // const createkey = SecureStore.deleteItemAsync("userKey");
  // setKeyexist("no");


  const gotosignup =  () => {
    // AsyncStorage.removeItem("profile_image")
    // AsyncStorage.removeItem("favorites")
    navigation.navigate('Signup')
  };
 

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <ImageBackground
        source={require("../images/image1.jpg")}
        style={styles.background}
        imageStyle={{ opacity: 0.8 }}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.overlay}
        >
          <TouchableOpacity
            style={{ position: "absolute", top: 70, marginLeft: 15 }}
            onPress={() => navigation.goBack()}
          >
            <FontAwesome name="arrow-left" size={20} color="#00f5cc" />
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
          <View >
            
            {biometricsupported && keyconfirm ? (
              
              <TouchableOpacity onPress={ handleFaceIDSignIn} style={{width: 150, height: "40", flex: 0, justifyContent: "center",alignItems: "center", borderWidth: 3, borderRadius: 10, borderColor: "#00f5cc"}}>
                <Text style={{color: "white",fontWeight: "bold"}}>Use face ID</Text>
            </TouchableOpacity>
            ) : ""
              
            }
            
          </View>

          {keyexist === "no" ? 
            ""
         
            // <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
            //   <Text style={styles.link}>Don't have a key? Sign Up</Text>
            // </TouchableOpacity>
           : (
            <View style={{marginTop: 80}}>
              <Text style={{ color: "white" }}>Welcome user: ({userkey})</Text>
            </View>
          )}

          {showfk && (
            <TouchableOpacity
              onPress={gotosignup}
              style={{
                marginTop: 90,
                width: 200,
                height: 50,
                backgroundColor: "black",
                borderRadius: 10,
                flex: 0,
                justifyContent: "center",
                alignItems: "center",
                opacity: 0.7,
              }}
            >
              <Text
                style={{
                  textAlign: "center",
                  color: "#00f5cc",
                  fontWeight: "bold",
                  fontSize: "16",
                }}
              >
                Forgotten key?
              </Text>
            </TouchableOpacity>
          )}
        </KeyboardAvoidingView>
      </ImageBackground>
    </TouchableWithoutFeedback>
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
