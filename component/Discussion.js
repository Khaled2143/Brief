import { StyleSheet, View, Text, FlatList, Pressable } from "react-native";
import axios from "axios";
import { useState, useEffect } from "react";

const Discussion = () => {
  const [discussion, setDiscussion] = useState([]);

  const retrieveDiscussion = () => {
    axios
      .get("http://localhost:5001/api/discussions")
      .then((response) => {
        if (response.data.success) {
          setDiscussion(response.data.data);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("Server error: Unable to retrieve data.");
      });
  };

  useEffect(() => {
    retrieveDiscussion();
  }, []);

  if (!discussion || discussion.length === 0) {
    return (
      <View style={styles.container}>
        <Text> No dicussions available.</Text>
      </View>
    );
  }
  return (
    <View>
      <Pressable>+</Pressable>
      <FlatList
        data={discussion}
        keyExtractor={(item) => item._id.toString()}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.author}>{item.author}</Text>
            <Text style={styles.content}>{item.content}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 30,
    textAlign: "center",
  },
  container: {
    flex: 1,
    justifyContent: "center",
  },
});

export default Discussion;
