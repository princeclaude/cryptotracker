// screens/OnboardingScreen.js

import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  Animated,
  TouchableOpacity,
  
} from "react-native";

import { useNavigation } from "@react-navigation/native";
import { FontAwesome } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

const onBordingImage = require('../images/image1.jpg')


export default function OnboardingScreen() {
  const navigation = useNavigation();
  const arrowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(arrowAnim, {
          toValue: 10,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(arrowAnim, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  

  return (
    <View style={styles.container}>
      <Image source={onBordingImage} style={styles.bgImage} />
     

      <TouchableOpacity onPress={() => navigation.navigate("Signin")}>
        <Animated.View
          style={[
            styles.startContainer,
            { transform: [{ translateX: arrowAnim }] },
          ]}
        >
          <Text style={styles.startText}>Start Tracking</Text>
          <FontAwesome name="arrow-right" size={20} color="#00f5cc" />
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bgImage: {
    width: width,
    height: "100%",
    resizeMode: "cover",
  },
  startContainer: {
    position: "absolute",
    bottom: 60,
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
  },
  startText: {
    color: "#00f5cc",
    fontSize: 18,
    marginRight: 10,
  },
});
