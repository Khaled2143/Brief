import { StyleSheet, View, Text } from "react-native";
import DisplayHeadlines from "./DisplayHeadlines";
import { UserContext } from "../context/UserContext.js";
import { useContext } from "react";
import { useFonts } from "expo-font";
import { useEffect } from "react";
import { TextInput } from "react-native-gesture-handler";
import { Ionicons } from "react-native-vector-icons";

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
        <Text style={styles.discover}>Discover Breaking News</Text>

        <View style={styles.search}>
          <Ionicons name="search-outline" size={20} color="#f3f3f3" />

          <TextInput
            placeholder="Search Headlines..."
            placeholderTextColor="#fff"
            style={styles.input}
          ></TextInput>
        </View>
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
    backgroundColor: "#161a25",
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
    marginTop: 4,
  },
  welcome: {
    fontFamily: "SF-Pro-Display",
    color: "#D4D4D4",
    fontSize: 15,
  },
  search: {
    flexDirection: "row",
    backgroundColor: "#41434c",
    width: "90%",
    height: 50,
    borderWidth: 1,
    borderRadius: 13,
    marginTop: 13,
    opacity: 0.8,
    shadowColor: "#000",
    shadowRadius: 4,
    elevation: 4,
    paddingLeft: 10,
    alignItems: "center",
  },
  input: {
    marginLeft: 7,
    flex: 1,
    color: "#f3f3f3",
    fontFamily: "SF-Pro-Display",
  },
});

export default Home;
