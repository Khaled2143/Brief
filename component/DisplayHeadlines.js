import react from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { FlatList, Pressable, Image } from "react-native";

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
        onpress={() => navigation.navigate("SummaryDetails", { summary: item })}
      >
        <Image
          source={require("../img/Trump_speech.jpeg")}
          style={styles.image}
        />
        <Text style={styles.title}>{item.title}</Text>
      </Pressable>
    );
  };

  return (
    <FlatList
      data={headlines}
      renderItem={renderHeadline}
      keyExtractor={(item) => item._id}
      contentContainerStyle={styles.container}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  headlineBox: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    borderRadius: 8,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#fff",
    padding: 8,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 10,
  },
  title: {
    fontSize: 17,
    fontWeight: "bold",
    flexShrink: 1,
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
