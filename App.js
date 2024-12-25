import { StatusBar } from "expo-status-bar";
import { StyleSheet } from "react-native";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import React, { useState, useEffect } from "react";
import FetchComponent from "./component/Fetch";
import Headline from "./component/Headline";
import Login from "./component/LoginForm";
import Discussion from "./component/Discussion";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import SignUp from "./component/SignUp";
import Account from "./component/Account";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const CustomTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: "#ede8d0", // Change this to your desired background color
  },
};

export default function App() {
  const [articles, setArticles] = useState([]); // Stores articles
  const [loading, setLoading] = useState(true); // Tracks loading state
  const [user, setUser] = useState(null);

  const handleLogin = (userData) => {
    setUser(userData);
    alert("Login successful!");
  };

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

  const LoginStack = () => {
    return (
      <Stack.Navigator screenOptions={{ animationEnabled: false }}>
        <Stack.Screen name="Login" options={{ headerShown: false }}>
          {() => <Login onLogin={handleLogin} />}
        </Stack.Screen>

        <Stack.Screen
          name="SignUp"
          component={SignUp}
          options={{ title: "Create an account", headerShown: false }}
        />

        <Stack.Screen
          name="Account"
          component={Account}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    );
  };
  return (
    <NavigationContainer theme={CustomTheme}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === "Headline") {
              iconName = focused
                ? "information-circle"
                : "information-circle-outline";
            } else if (route.name === "Discussion") {
              iconName = focused ? "list" : "list-outline";
            } else {
              iconName = focused ? "log-in" : "log-in-outline";
            }
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: "tomato",
          tabBarInactiveTintColor: "gray",
        })}
      >
        <Tab.Screen name="Headline">
          {() => <Headline articles={articles} loading={loading} />}
        </Tab.Screen>

        <Tab.Screen name="Discussion" component={Discussion} />

        <Tab.Screen name="Profile" component={LoginStack} />
      </Tab.Navigator>
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
