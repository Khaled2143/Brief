import { StyleSheet, View, Text, FlatList, Pressable } from "react-native";
import axios from "axios";
import { useState, useEffect, useContext } from "react";
import { useNavigation } from "@react-navigation/native";
import { UserContext } from "../context/UserContext";

const Discussion = () => {
  const [discussion, setDiscussion] = useState([]);
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(UserContext);

  const retrieveDiscussion = () => {
    return axios
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

  const createPost = () => {
    navigation.navigate("CreateDiscussion");
  };

  if (!discussion || discussion.length === 0) {
    return (
      <View style={styles.container}>
        <Pressable onPress={createPost}>
          <Text>Create Discussion</Text>
        </Pressable>
        <Text> No dicussions available.</Text>
      </View>
    );
  }

  const handleRefresh = () => {
    if (!refreshing) {
      setRefreshing(true);
      retrieveDiscussion().finally(() => setRefreshing(false));
    }
  };

  const handlePostClick = (discussionItem) => {
    if (user) {
      navigation.navigate("TotalDiscussion", { discussion: discussionItem });
    } else {
      return alert("You must have an account in order to view a post");
    }
  };
  return (
    <View style={styles.container}>
      <Pressable style={styles.button} onPress={createPost}>
        <Text style={styles.text}>Create Discussion</Text>
      </Pressable>

      <FlatList
        data={discussion}
        keyExtractor={(item) => item._id.toString()}
        renderItem={({ item }) => (
          <Pressable style={styles.item} onPress={() => handlePostClick(item)}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.author}>
              By: {item.author} @ {item.createdAt}
            </Text>
          </Pressable>
        )}
        refreshing={refreshing}
        onRefresh={handleRefresh}
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
  item: {
    borderWidth: 3,
    margin: 10,
  },
  button: {
    backgroundColor: "#6200ee",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: "center", // Center the text horizontally
    justifyContent: "center", // Center the text vertically
  },
  title: {
    fontSize: 30,
    textAlign: "center",
  },
});

export default Discussion;
