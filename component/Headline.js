import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Image,
  FlatList,
} from "react-native";

import { useState, useEffect } from "react";

const Headline = ({ articles, navigation, loading }) => {
  const [localArticles, setLocalArticles] = useState([]);
  const [topArticle, setTopArticle] = useState(null);

  const getHottestArticles = () => {
    let max = 0;
    let hottestArticle = null;
    for (let i = 0; i < localArticles.length; i++) {
      if (localArticles[i].counter > max) {
        max = localArticles[i].counter;
        hottestArticle = localArticles[i];
      }
    }
    return hottestArticle;
  };

  useEffect(() => {
    setTopArticle(getHottestArticles());
  }, [localArticles]);

  useEffect(() => {
    if (articles) {
      const updateArticles = articles.map((article) => ({
        ...article,
        counter: 0,
      }));
      setLocalArticles(updateArticles);
    }
  }, [articles]);
  // Show a loading message while fetching
  if (loading) {
    return <Text style={styles.loading}>Loading articles...</Text>;
  }

  // Show a fallback message if no articles are available
  if (articles.length === 0) {
    return <Text style={styles.loading}>No articles available</Text>;
  }

  return (
    <FlatList
      contentContainerStyle={styles.container}
      data={localArticles} // Pass the articles array as data
      keyExtractor={(item, index) => index.toString()} // Unique key for each item
      renderItem={({ item }) => (
        <Pressable
          style={styles.button}
          onPress={() => navigation.navigate("FetchData", { article: item })}
          onPressIn={() => {
            setLocalArticles((prevArticles) =>
              prevArticles.map((article) => {
                if (article === item) {
                  console.log(
                    `Count for ${item.headline}: ${article.counter + 1}`
                  );
                  return { ...article, counter: article.counter + 1 };
                }
                return article;
              })
            );
          }}
        >
          <Image
            source={
              item.image_url
                ? { uri: item.image_url }
                : require("../img/Trump_IMG_1.jpg")
            }
            style={styles.images}
          />
          <Text numberOfLines={3} style={styles.text}>
            {item.headline}
          </Text>
        </Pressable>
      )}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    alignItems: "center",
  },
  images: {
    height: 75,
    width: 75,
    marginRight: 10,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    padding: 10,
    marginBottom: 10,
    borderWidth: 0.5,
    borderColor: "black",
    borderRadius: 5,
    backgroundColor: "#ede8d0",
    width: "100%",
    height: 100,
  },
  text: {
    fontSize: 18,
    marginLeft: 20,
    flexShrink: 1, // Prevent text from expanding
    flexGrow: 1, // Use available space evenly
    textAlignVertical: "center", // Center-align text vertically
    lineHeight: 22, // Optional for consistent text spacing
  },

  loading: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
  },
});

export default Headline;
