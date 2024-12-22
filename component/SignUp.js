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
  const isValid = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[\W_]).{8,}$/.test(password);

  const handleSignUp = () => {
    if (!username || !password) {
      alert("Username and Password must be filled.");
      return;
    }
    if (!isValid) {
      console.log("Password does not meet criteria");
      return;
    } else {
      const userData = { username, password };

      axios
        .post("http://localhost:5001/api/signup", {
          username: username,
          password: password,
        })
        .then((response) => {
          if (response.data.success) {
            alert("Sign Up Successful ");
          } else {
            alert("Username already exists");
          }
        })
        .catch((error) => {
          console.error("Error:", error);
          alert("Something went wrong. Please try again");
        });
    }
  };
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
      <TouchableOpacity style={styles.button} onPress={handleSignUp}>
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
