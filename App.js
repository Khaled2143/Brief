import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import React, { useState, useEffect } from "react";
// Venv is a tool that create an isolated enviroment for oyur project. Ensures that the project has it own dependencies seperate fromthe global python env on your system
export default function App() {
  const [data, setData] = useState(null); // State to hold the fetched data

  useEffect(() => {
    // Asynchronous function to fetch data
    const fetchData = async () => {
      try {
        const response = await fetch("/scrape"); // Adjust based on proxy setup
        const result = await response.json();
        console.log(result);
        setData(result); // Update the state with fetched data
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData(); // Call the function
  }, []); // Empty dependency array ensures this runs once on component mount

  return (
    <View style={styles.container}>
      <Text>Open up App.js to start working on your app!</Text>
      <Text>Data: {data ? JSON.stringify(data) : "Loading..."}</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
