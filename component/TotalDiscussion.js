import { StyleSheet, View, Text, FlatList, Pressable } from "react-native";
import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";

const TotalDiscussion = ({ route }) => {
  const { discussion } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{discussion.title}</Text>

      <Text style={styles.content}>{discussion.content}</Text>
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
});

export default TotalDiscussion;
