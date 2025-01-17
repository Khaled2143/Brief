import React, { useContext } from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import ActiveDiscussions from "./ActiveDiscussions";
import { useNavigation } from "@react-navigation/native";
import {
  Text,
  View,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { UserContext } from "../context/UserContext";

const Account = ({ route }) => {
  const { username } = route.params;
  const { user, setUser } = useContext(UserContext);
  const [discussion, setDiscussion] = useState([]);
  const navigation = useNavigation();

  const userID = user.userID;

  const retrieveDiscussions = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5001/api/users/${userID}/active-discussions`
      );
      console.log("API RESPONSME:", response.data);

      if (response.data.success) {
        setDiscussion(response.data.activeDiscussions);
      }
    } catch (error) {
      console.error("Error retrieving interacted disucssions", error);
    }
  };

  useEffect(() => {
    retrieveDiscussions();
  }, []);

  const viewActiveDisucssions = () => {
    navigation.navigate("ActiveDiscussions", { discussions: discussion });
  };

  return (
    <View>
      <Text style={styles.welcome}>Welcome, {username}</Text>
      <Pressable onPress={viewActiveDisucssions}>
        <Text>Active Disucssions</Text>
      </Pressable>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignContent: "center",
  },
  welcome: {
    fontSize: 35,
    textAlign: "center",
    marginTop: 25,
  },
});
export default Account;
