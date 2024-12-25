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

const Account = ({ route }) => {
  const { username } = route.params;

  return (
    <View>
      <Text>Welcome, {username}</Text>
    </View>
  );
};

export default Account;
