import React, { useContext } from "react";
import { useState, useEffect } from "react";
import axios from "axios";

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
import { FlatList } from "react-native-gesture-handler";

const ActiveDiscussions = ({ route }) => {
  const { discussions } = route.params;
  return (
    <View>
      <Text> HELLO WELCOME TO THE DISUCSSIONS SECTION</Text>
      <FlatList
        data={discussions}
        keyExtractor={(item) => item._id.toString()}
        renderItem={({ item }) => <Text>{item.title}</Text>}
      />
    </View>
  );
};

export default ActiveDiscussions;
