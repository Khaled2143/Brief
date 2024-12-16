import { StyleSheet, View, Text } from "react-native";

const Discussion = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Hello Bruv</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 30,
    textAlign: "center",
  },
  container: {
    flex: 1,
    justifyContent: "center",
  },
});

export default Discussion;
