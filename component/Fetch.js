import { StyleSheet, View, Text, ActivityIndicator } from "react-native";
import React, { useState, useEffect } from "react";

const FetchComponent = () => {
  const [data, setData] = useState(null); // Stores fetched data
  const [error, setError] = useState(null); // State for error handling
  const [loading, setLoading] = useState(true); // State for loading indicator

  const fetchData = async () => {
    try {
      console.log("Fetching Data...");
      const response = await fetch("http://127.0.0.1:5000/summarize");

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const result = await response.json();
      console.log("Fetched Data:", result);
      setData(result.response); // Directly set the response string
    } catch (err) {
      console.error("Error fetching data:", err);
      setError(err.toString());
    } finally {
      setLoading(false); // Ensure loading stops
    }
  };

  useEffect(() => {
    fetchData(); // Fetch data when the component mounts
  }, []);

  return (
    <View style={styles.container}>
      {loading && <ActivityIndicator size="large" color="#0000ff" />}
      {error && <Text style={styles.error}>Error: {error}</Text>}
      {data && <Text style={styles.text}>Summary: {data}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  text: {
    fontSize: 16,
    textAlign: "center",
  },
  error: {
    color: "red",
    fontSize: 16,
    textAlign: "center",
  },
});

export default FetchComponent;
