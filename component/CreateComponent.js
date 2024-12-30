import axios from "axios";
import { useState, useEffect, useContext } from "react";
import {
  Text,
  View,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { UserContext } from "../context/UserContext";

const CreateComponent = () => {
  const navigation = useNavigation();
  const [username, setUsername] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [content, setContent] = useState("");
  const { user } = useContext(UserContext);

  const calcTime = () => {
    var currentdate = new Date();
    return (
      currentdate.getDate() +
      "/" +
      (currentdate.getMonth() + 1) +
      "/" +
      currentdate.getFullYear() +
      " @ " +
      currentdate.getHours() +
      ":" +
      currentdate.getMinutes()
    );
  };

  useEffect(() => {
    setDate(calcTime());
  }, []);

  const handlePost = async () => {
    setDate(calcTime());
    if (!content || !title) {
      Alert.alert("Content and title must be filled");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5001/api/discussions",
        {
          title: title.trim(),
          content: content.trim(),
          author: user.username.trim(),
          createdAt: date,
        },
        console.log({
          title,
          content,
          author: user.username,
          createdAt: date,
        })
      );
      if (response.data.success) {
        alert("Post created successfully");
        setTitle("");
        setContent("");
        setLoading(false);
        navigation.goBack();
      } else {
        throw new Error("Post Creation Failed.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error", "Failed to create the discussion. Please try again later");
    } finally {
      setLoading(false);
    }
  };

  if (user) {
    return (
      <View style={styles.container}>
        <Text>Title</Text>

        <TextInput
          placeholder="Enter Title"
          style={styles.input}
          onChangeText={setTitle}
          value={title}
          multiline
        />
        <Text>Content</Text>

        <TextInput
          placeholder="Enter Content"
          style={styles.input}
          onChangeText={setContent}
          value={content}
          multiline
        />
        <Text>
          By: {user.username} on {date}
        </Text>

        <Pressable onPress={handlePost} style={styles.button}>
          <Text> Create Discussion</Text>
        </Pressable>
      </View>
    );
  } else {
    return (
      <View style={styles.container}>
        <Text>You must have an account in order to make a post. </Text>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 10,
    alignItems: "center",
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    width: "80%",
    paddingBottom: 100,
  },
  button: {
    backgroundColor: "#6200ee",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
});

export default CreateComponent;
