import { StyleSheet, View, Text, FlatList, Pressable } from "react-native";
import axios from "axios";
import { useState, useEffect, useContext } from "react";
import { useNavigation } from "@react-navigation/native";
import { TextInput } from "react-native-gesture-handler";
import { UserContext, UserProvider } from "../context/UserContext";

const TotalDiscussion = ({ route }) => {
  const { discussion } = route.params;
  const [content, setContent] = useState("");
  const { _id: id } = discussion;
  const { user, setUser } = useContext(UserContext);
  console.log("CURRENT USER:", user.username);
  console.log("HERES THE CONTENT", content);

  const handleSubmit = () => {
    if (!content) {
      alert("Cannot submit without content being filled");
      return;
    }
    axios
      .post(`http://localhost:5001/api/discussions/${id}/comments`, {
        content,
        username: user.username,
      })
      .then((resposne) => {
        console.log("Comment Posted", resposne.data);
      })
      .catch((error) => {
        console.error(
          "Error posting comment:",
          error.response?.data?.message || error.message
        );
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{discussion.title}</Text>

      <Text style={styles.content}>{discussion.content}</Text>

      <TextInput
        style={styles.textInput}
        onChangeText={setContent}
        value={content}
        placeholder="Content"
      />
      <Pressable style={styles.button} onPress={handleSubmit}>
        <Text>Send</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  title: {
    fontSize: 30,
    marginTop: 20,
    marginBottom: 30,
  },
  content: {
    fontSize: 20,
    textAlign: "center",
  },
  textInput: {
    borderWidth: 2,
    marginTop: 10,
    width: "90%",
  },
  button: {
    backgroundColor: "#6200ee",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
});

export default TotalDiscussion;
