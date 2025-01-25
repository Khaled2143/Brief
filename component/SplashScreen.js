import { StyleSheet, View, Text, Animated } from "react-native";
import { useFonts } from "expo-font";

const SplashScreen = () => {
  const [fontLoaded] = useFonts({
    Righteous: require("../assets/fonts/Righteous-Regular.ttf"),
  });

  if (!fontLoaded) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Brief.</Text>
      <Text style={styles.footerText}>Made With Love</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: "white",
    fontSize: 62,
    fontFamily: "Righteous",
    zIndex: 1,
  },
  footerText: {
    position: "absolute",
    bottom: 20,
    color: "gray",
    fontSize: 12,
    fontFamily: "Righteous",
    zIndex: 1,
  },
});

export default SplashScreen;
