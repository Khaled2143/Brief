import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import * as Font from "expo-font";

import {
  FlatList,
  Pressable,
  Image,
  Animated,
  View,
  Text,
  StyleSheet,
  ScrollView,
} from "react-native";

const SummaryDetails = ({ route }) => {
  const navigation = useNavigation();
  const { summary } = route.params;

  useEffect(() => {
    const loadFonts = async () => {
      await Font.loadAsync({
        "SF-Pro-Display-Bold": require("../assets/fonts/SF-Pro-Display-Bold.otf"),
        "SF-Pro-Display-Regular": require("../assets/fonts/SF-Pro-Display-Regular.otf"),
      });
    };

    loadFonts();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: summary.imageUrl }} style={styles.image} />
      </View>

      <View style={styles.contentContainer}>
        <Text style={styles.title}>{summary.title}</Text>

        {summary.section.map((section, index) => (
          <View key={index} style={styles.section}>
            <Text style={styles.header}>{section.header}</Text>
            <Text style={styles.content}>{section.content}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  imageContainer: {
    height: 400,
    overflow: "hidden",
  },
  image: {
    height: "100%",
    width: "100%",
    resizeMode: "cover",
  },
  contentContainer: {
    padding: 24,
    backgroundColor: "#f8f8f8",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  title: {
    fontFamily: "SF-Pro-Display-Bold",
    fontSize: 24,
    fontWeight: "bold",
    color: "black",
    marginBottom: 16,
  },
  section: {
    marginBottom: 16,
  },
  header: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
  },
  content: {
    fontFamily: "SF-Pro-Display",
    color: "black",
    lineHeight: 20,
  },
});

export default SummaryDetails;
