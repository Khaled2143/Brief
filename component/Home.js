import { StyleSheet, View, Text } from "react-native";
import DisplayHeadlines from "./DisplayHeadlines";
import { UserContext } from "../context/UserContext.js";
import { useContext } from "react";
import { useFonts } from "expo-font";
import { useEffect } from "react";

const Home = () => {
  const { user } = useContext(UserContext);

  useEffect(() => {
    const loadFonts = async () => {
      await Font.loadAsync({
        Righteous: require("../assets/fonts/Righteous-Regular.ttf"),
        "SF-Pro-Display-Bold": require("../assets/fonts/SF-Pro-Display-Bold.otf"),
        "SF-Pro-Display-Regular": require("../assets/fonts/SF-Pro-Display-Regular.otf"),
      });
    };

    loadFonts();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.logo}>Brief.</Text>
        <Text style={styles.welcome}>
          Good Morning {user?.username || "Guest"}!👋
        </Text>
        <Text style={styles.discover}>Discover The Latet News</Text>
      </View>

      <View>
        <DisplayHeadlines />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 8,
    backgroundColor: "#151924",
  },
  logo: {
    fontFamily: "Righteous",
    fontSize: 32,
    marginBottom: 20,
    color: "#FFFF",
  },
  headerContainer: {
    padding: 20,
    paddingTop: 40,
  },
  discover: {
    color: "white",
    fontSize: 22,
    fontFamily: "SF-Pro-Display",
    fontWeight: "bold",
    marginTop: 7,
  },
  welcome: {
    fontFamily: "SF-Pro-Display",
    color: "#D4D4D4",
  },
});

export default Home;
