import React from "react";
import { useState } from "react";
import axios from "axios";

import {
  Text,
  View,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

const SignUp = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSignUp = () => {
    
  }
  return (
    <View style={styles.container}>
      <Text style={styles.loginText}>Sign UP here</Text>
      <TextInput
        style={styles.textInput}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.textInput}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loginText: {
    fontSize: 40,
    paddingBottom: 20,
  },
  textInput: {
    borderWidth: 0.5,
    width: "50%",
    height: "4%",
    marginBottom: 5,
  },
  button: {
    backgroundColor: "#6200ee",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
});
export default SignUp;
