import axios from "axios";
import { useState, useEffect } from "react";
import {
  Text,
  View,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
  Pressable,
} from "react-native";

const CreateComponent = () => {
  const [username, setUsername] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  const retrieveUsername = () => {
    axios
      .get("http://localhost:5001/api/user/username")
      .then((response) => {
        if (response.data.success) {
          setUsername(response.data.data);
        } else {
          setError(true);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        setError(true);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  useEffect(() => {
    retrieveUsername();
  }, []);

  if (username) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }
  if (error) {
    return (
      <View style={styles.container}>
        <Text>Unable to load username. Please try again later.</Text>
      </View>
    );
  }

  return (

      <Pressable>Create Dicussion</Pressable>

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default CreateComponent;
