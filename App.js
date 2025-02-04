import { Pressable, StyleSheet, Text } from "react-native";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import React, { useState, useEffect } from "react";
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
import DisplayHeadlines from "./component/DisplayHeadlines";
import SummaryDetails from "./component/SummaryDetails";
import Home from "./component/Home";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const RootStack = createStackNavigator();

const CustomTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: "#f8f8f8", // Change this to your desired background color
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
      const response = await fetch("http://192.168.1.168:5002/summarize"); // Use your backend URL

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`); // Handle non-200 responses
      }

      const result = await response.json(); // Parse JSON from the response
      console.log("Raw Response:", result); // Log the raw response to debug

      setArticles(result.articles); // Update state with articles
    } catch (error) {
      console.error("Error Fetching Articles:", error); // Log errors
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

  const HeadlineStack = () => (
    <Stack.Navigator>
      <Stack.Screen
        name="Home Page"
        component={Home}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SummaryDetails"
        component={SummaryDetails}
        options={{ headerTitle: "", headerTransparent: true }}
      />
    </Stack.Navigator>
  );

  const MainTabs = () => (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline";
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
      <Tab.Screen name="Home" component={HeadlineStack} />

      {/* Forum Tab (DiscussionStack) */}
      <Tab.Screen name="Forum" component={DiscussionStack} />

      {/* Profile Tab (LoginStack) */}
      <Tab.Screen name="Profile" component={LoginStack} />
    </Tab.Navigator>
  );

  const RootStackScreen = () => {
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
