import React from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, Dimensions } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { FlatList, Pressable, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get("window");
const boxWidth = width * 0.6;

const DisplayHeadlines = () => {
  const [headlines, setHeadlines] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    axios
      .get("http://localhost:5001/api/summaries")
      .then((response) => {
        if (response.data.success) {
          setHeadlines(response.data.data);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching summaries:", error);
        setError(error);
        setLoading(false);
      });
  }, []);

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

  if (loading) {
    return <Text>Loading headlines...</Text>;
  }

  if (error) {
    return <Text>{error}</Text>;
  }

  const renderHeadline = ({ item }) => {
    return (
      <Pressable
        style={styles.headlineBox}
        onPress={() => navigation.navigate("SummaryDetails", { summary: item })}
      >
        <Image source={{ uri: item.imageUrl }} style={styles.image} />
        <Text style={styles.title}>{item.title}</Text>
      </Pressable>
    );
  };

  return (
    <FlatList
      horizontal={true}
      snapToAlignment="start"
      snapToInterval={boxWidth + 16}
      decelerationRate="fast"
      data={headlines}
      renderItem={renderHeadline}
      keyExtractor={(item) => item._id}
      contentContainerStyle={styles.container}
      showsHorizontalScrollIndicator={false}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    justifyContent: "space-between",
  },

  headlineBox: {
    alignItems: "flex-start",
    flexDirection: "column",
    marginRight: 10,
    marginBottom: 16,
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#000",
    backgroundColor: "#333",
    width: boxWidth,
    height: boxWidth * 1.2,
    padding: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 1,
    shadowRadius: 6,
  },
  image: {
    width: "100%",
    height: "60%",
    borderRadius: 8,
    marginRight: 10,
    resizeMode: "cover",
  },
  title: {
    fontFamily: "SF-Pro-Display",
    fontSize: 18,
    fontWeight: "bold",
    flexShrink: 1,
    flexWrap: "wrap",
    color: "white",
    marginTop: 8,
    marginHorizontal: 4,
  },
  loading: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
  },
  error: {
    fontSize: 16,
    color: "red",
    textAlign: "center",
    marginTop: 20,
  },
});
export default DisplayHeadlines;
