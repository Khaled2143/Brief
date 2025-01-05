import { StyleSheet, View, Text, FlatList, Pressable } from "react-native";
import axios from "axios";
import { useState, useEffect, useContext } from "react";
import { useNavigation } from "@react-navigation/native";
import { TextInput } from "react-native-gesture-handler";
import { UserContext, UserProvider } from "../context/UserContext";
import retrieveComments from "./utils/retrieveComments";

const TotalDiscussion = ({ route }) => {
  const { discussion } = route.params;
  const [content, setContent] = useState("");
  const [comment, setComment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { _id: id } = discussion;
  const { user, setUser } = useContext(UserContext);

  const retrieveCommentsAndSetState = async () => {
    setLoading(true);
    try {
      const comments = await retrieveComments(id);

      setComment(comments);
    } catch (error) {
      alert("Server error: unable to retrieve commments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    retrieveCommentsAndSetState();
  }, []);

  const commentArray = Array.isArray(comment) ? comment : [];

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

  const handleRefresh = () => {
    if (!refreshing) {
      setRefreshing(true);
      retrieveCommentsAndSetState().finally(() => setRefreshing(false));
    }
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
      {/*Conditional rendering for no comments on discussions*/}

      {!comment || comment.length === 0 ? (
        <View>
          <Text>Be the first to comment!</Text>
        </View>
      ) : (
        <FlatList
          data={comment}
          keyExtractor={(item) => item._id.toString()}
          renderItem={({ item }) => (
            <View style={styles.commentContainer}>
              <Text>{item.content}</Text>
              <Text>{item.username}</Text>
              <Text>{item.likes}</Text>
              <Text>
                {new Date(item.createdAt).toLocaleString("en-US", {
                  weekday: "short",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Text>
            </View>
          )}
          refreshing={refreshing}
          onRefresh={handleRefresh}
        
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flex: 1,
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
  commentContainer: {
    flex: 1,
    borderWidth: 2,
    marginTop: 10,
    marginBottom: 10,
  },
});

export default TotalDiscussion;
