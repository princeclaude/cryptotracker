import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  Easing,
  StyleSheet,
  Image,
} from 'react-native';

const Coinitem = ({ item, index, search, onPress }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (index === 0 && search) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 1.08,
            duration: 500,
            useNativeDriver: true,
            easing: Easing.inOut(Easing.ease),
          }),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
            easing: Easing.inOut(Easing.ease),
          }),
        ])
      ).start();
    }
  }, [search]);

  const highlightText = (text, query) => {
    if (!query) return <Text>{text}</Text>;

    const regex = new RegExp(`(${query})`, 'i');
    const parts = text.split(regex);

    return (
      <Text style={styles.name}>
        {parts.map((part, idx) =>
          regex.test(part) ? (
            <Text key={idx} style={styles.highlight}>
              {part}
            </Text>
          ) : (
            <Text key={idx}>{part}</Text>
          )
        )}
      </Text>
    );
  };

  const content = (
    <View style={styles.container}>
      <Image source={{uri: item.image}} style={styles.logo} />
      <View>
        {highlightText(item.name, search)}
     
      {/* <Text style={{color: "white", fontWeight: "bold", fontSize: 15}}>{item.name.toUpperCase()}</Text> */}

      <Text style={styles.symbol}>{item.symbol.toUpperCase()}</Text>
      </View>
      <Text style={styles.price}>${item.current_price.toLocaleString()}</Text>
    </View>
  );

  return (
    <TouchableOpacity onPress={onPress}>
      {index === 0 && search ? (
        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>{content}</Animated.View>
      ) : (
        content
      )}
    </TouchableOpacity>
  );
};

export default Coinitem;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: "white",
  },
  symbol: {
    fontSize: 14,
    color: 'white',
  },
  logo: {
    width: 36,
    height: 36,
    borderRadius: 18,

  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: "white"
  },
  highlight: {
    backgroundColor: 'green',
    color: 'white',
},
});