import { StatusBar } from "expo-status-bar";
import { Pressable, StyleSheet, Text } from "react-native";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import React, { useState, useEffect } from "react";
import FetchComponent from "./component/Fetch";
import Headline from "./component/Headline";
import Login from "./component/LoginForm";
import Discussion from "./component/Discussion";
import CreateComponent from "./component/CreateComponent";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import SignUp from "./component/SignUp";
import Account from "./component/Account";
import TotalDiscussion from "./component/TotalDiscussion";
import { UserContext, UserProvider } from "./context/UserContext";
import ActiveDiscussions from "./component/ActiveDiscussions";
import SplashScreen from "./component/SplashScreen";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const RootStack = createStackNavigator();

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
  const [isLoading, setIsLoading] = useState(true);

  const handleLogin = (userData) => {
    console.log("Before setUser in App.js:", userData);
    setUser(userData);
    console.log("After setUser in App.js:", user);
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

        <Stack.Screen name="ActiveDiscussions" component={ActiveDiscussions} />
      </Stack.Navigator>
    );
  };

  const DiscussionStack = () => {
    return (
      <Stack.Navigator>
        <Stack.Screen
          name="Discussion"
          component={Discussion}
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="CreateDiscussion"
          component={CreateComponent}
          options={({ navigation }) => ({
            title: "Create Discussion",
            presentation: "modal",
            gestureEnabled: true,
            headerLeft: () => null,
            headerRight: () => (
              <Pressable
                onPress={() => navigation.goBack()}
                style={{ padding: 20 }}
              >
                <Text style={{ color: "gray", fontSize: 15 }}>X</Text>
              </Pressable>
            ),
            headerShown: false,
          })}
        />

        <Stack.Screen
          name="TotalDiscussion"
          component={TotalDiscussion}
          options={{
            headerShown: false,
          }}
        />
      </Stack.Navigator>
    );
  };

  const MainTabs = () => (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Headline") {
            iconName = focused
              ? "information-circle"
              : "information-circle-outline";
          } else if (route.name === "Forum") {
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
      {/* Headline Tab */}
      <Tab.Screen name="Headline">
        {() => <Headline articles={articles} loading={loading} />}
      </Tab.Screen>

      {/* Forum Tab (DiscussionStack) */}
      <Tab.Screen name="Forum" component={DiscussionStack} />

      {/* Profile Tab (LoginStack) */}
      <Tab.Screen name="Profile" component={LoginStack} />
    </Tab.Navigator>
  );

  const RootStackScreen = () => {
    console.log("Rendering RootStacMSCREEEFBJGSHDFMGHDF");
    return (
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        <RootStack.Screen name="Splash" component={SplashScreen} />
        <RootStack.Screen name="Main" component={MainTabs} />
      </RootStack.Navigator>
    );
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <UserProvider>
      <NavigationContainer theme={CustomTheme}>
        <MainTabs />
      </NavigationContainer>
    </UserProvider>
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
