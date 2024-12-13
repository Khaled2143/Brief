import { StyleSheet, Text, View, Pressable, Image } from "react-native";

const Headline = ({ articles, navigation, loading }) => {
  // Show a loading message while fetching
  if (loading) {
    return <Text style={styles.loading}>Loading articles...</Text>;
  }

  // Show a fallback message if no articles are available
  if (articles.length === 0) {
    return <Text style={styles.loading}>No articles available</Text>;
  }

  return (
    <View style={styles.container}>
      {articles.map((article, index) => (
        <Pressable
          key={index}
          style={styles.button}
          onPress={() => navigation.navigate("FetchData", { article })}
        >
          <Image
            source={require("../img/Trump_IMG_1.jpg")} // Replace with your image logic
            style={styles.images}
          />
          <Text numberOfLines={3} style={styles.text}>
            {article.headline}
          </Text>
        </Pressable>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    padding: 10,
  },
  images: {
    height: 75,
    width: 75,
    marginRight: 10,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 5,
    backgroundColor: "#fff",
    width: "90%",
  },
  text: {
    fontSize: 18,
    flexShrink: 1,
  },
  loading: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
  },
});

export default Headline;
