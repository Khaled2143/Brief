import { StatusBar } from "expo-status-bar";
import { StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import React, { useState, useEffect } from "react";
import FetchComponent from "./component/Fetch";
import Headline from "./component/Headline";

const Stack = createStackNavigator();

export default function App() {
  const [articles, setArticles] = useState([]); // Stores articles
  const [loading, setLoading] = useState(true); // Tracks loading state

  const fetchArticles = async () => {
    try {
      const response = await fetch("http://192.168.1.168:5001/summarize"); // Update with your backend URL
      const result = await response.json();
      setArticles(result.articles); // Assume `articles` is part of the response
    } catch (error) {
      console.error("Error Fetching Articles:", error);
    } finally {
      setLoading(false); // Stop the loading spinner
    }
  };

  useEffect(() => {
    fetchArticles(); // Fetch articles when the app loads
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator>
  
        <Stack.Screen name="Headline">
          {(props) => (
            <Headline {...props} articles={articles} loading={loading} />
          )}
        </Stack.Screen>

       
        <Stack.Screen
          name="FetchData"
          component={FetchComponent}
          options={{ title: "Article Details" }}
        />
      </Stack.Navigator>
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ede8d0",
    alignItems: "center",
    justifyContent: "center",
  },
});
