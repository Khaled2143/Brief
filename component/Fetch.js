import { StyleSheet, Text, View, ScrollView } from "react-native";

const FetchComponent = ({ route }) => {
  const { article } = route.params; // Get the article data

  return (
    <ScrollView style={styles.container}>
      {/* Display article headline */}
      <Text style={styles.headline}>{article.headline}</Text>

      {/* Display the full summarized content */}
      <Text style={styles.content}>{article.content}</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  headline: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  content: {
    fontSize: 16,
    lineHeight: 24,
    marginTop: 10,
    textAlign: "justify",
    marginBottom: 10,
  },
});

export default FetchComponent;
