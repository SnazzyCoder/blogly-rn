import React, { useState, useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TextInput,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import TouchableScale from "react-native-touchable-scale";
import { GlobalState } from "../DataProvider";
import moment from "moment";
import _ from "lodash";

const SearchScreen = ({ navigation }) => {
  const [isSelecting, setIsSelecting] = useState(false);
  const [isAllSelected, setIsAllSelected] = useState(false);
  const state = useContext(GlobalState);
  const { deleteBlogs, selectedBlogIds } = state.BlogAPI;
  const [blogs, setBlogs] = state.BlogAPI.blogs;
  const [searchTerm, setSearchTerm] = state.BlogAPI.searchTerm;
  const { toggleSelect, selectAll, deselectAll } =
    state.BlogAPI.selectFunctions;

  return (
    <SafeAreaView
      style={{ backgroundColor: "white", flexGrow: 1, paddingHorizontal: 30 }}
    >
      <View
        style={{
          marginVertical: 10,
          marginTop: 30,
          paddingHorizontal: 30,
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          height: 50,
        }}
      >
        {isSelecting && (
          <TouchableScale
            style={[
              styles.iconContainer,
              { marginHorizontal: 0, marginRight: 5 },
            ]}
            onPress={() => setIsSelecting(false)}
          >
            <Ionicons name="arrow-back" style={styles.icon} />
          </TouchableScale>
        )}
        <TextInput
          style={{
            paddingHorizontal: 20,
            borderRadius: 10,
            fontSize: 14,
            backgroundColor: "#f3f3f3",
            fontWeight: "bold",
            flexGrow: 1,
            height: "100%",
            marginRight: 5,
          }}
          onChangeText={setSearchTerm}
          defaultValue={searchTerm}
          placeholder="Search blog"
        />
        {isSelecting && (
          <>
            <TouchableScale
              style={styles.iconContainer}
              onPress={() => {
                deleteBlogs(selectedBlogIds);
              }}
            >
              <Ionicons name="trash" style={styles.icon} />
            </TouchableScale>
            <TouchableScale
              style={styles.iconContainer}
              onPress={
                isAllSelected
                  ? () => {
                      // Deselct Select
                      deselectAll();
                      setIsAllSelected(false);
                    }
                  : () => {
                      // Select All
                      selectAll();
                      setIsAllSelected(true);
                    }
              }
            >
              <Ionicons
                name={!isAllSelected ? "checkmark-done-circle" : "close-circle"}
                style={styles.icon}
              />
            </TouchableScale>
          </>
        )}
      </View>
      <View
        style={{
          marginBottom: 150,
          flexGrow: 1,
        }}
      >
        {blogs.length > 0 ? (
          <FlatList
            data={_.orderBy(blogs, ["title", ["asc"]])}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View
                style={{
                  opacity: isSelecting ? (item.isSelected ? 1 : 0.3) : 1,
                  flexGrow: 1,
                }}
              >
                <TouchableOpacity
                  style={{
                    flexDirection: "row",
                    paddingBottom: 30,
                    paddingLeft: 30,
                    alignItems: "center",
                    marginTop: 30,
                  }}
                  onLongPress={() => {
                    setIsSelecting(true);
                  }}
                  onPress={
                    !isSelecting
                      ? () => {
                          // Normal function
                          navigation.navigate("DetailScreen", { data: item });
                        }
                      : () => {
                          // Toggle Selecting function
                          toggleSelect(item.id);
                        }
                  }
                >
                  <View style={{ marginRight: 30 }}>
                    <Image
                      source={{ uri: item.imageURI }}
                      style={{ width: 100, height: 100, borderRadius: 10 }}
                    />
                  </View>
                  <View style={{ width: "60%" }}>
                    <View
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <Text
                        style={{
                          color: "#b12341",
                          fontWeight: "bold",
                          marginBottom: 4,
                        }}
                      >
                        {moment(item.createdAt).format("Do MMM, YYYY")}
                      </Text>
                      {isSelecting && (
                        <Feather
                          size={23}
                          name={item.isSelected ? "check-circle" : "circle"}
                          style={{
                            color: item.isSelected ? "green" : "gray",
                          }}
                        />
                      )}
                    </View>
                    <Text
                      style={{
                        fontWeight: "bold",
                        fontSize: 18,
                        marginBottom: 10,
                      }}
                    >
                      {item.title}
                    </Text>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        opacity: 0.4,
                      }}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          marginRight: 16,
                          alignItems: "center",
                        }}
                      >
                        <Feather name="book-open" size={14} color="#000" />
                        <Text style={{ marginHorizontal: 4, fontSize: 12 }}>
                          {item.readTime}
                        </Text>
                      </View>
                      <View
                        style={{
                          flexDirection: "row",
                          marginRight: 16,
                          alignItems: "center",
                        }}
                      >
                        <Feather name="user" size={14} color="#000" />
                        <Text style={{ marginHorizontal: 4, fontSize: 12 }}>
                          {item.username}
                        </Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
            )}
          />
        ) : (
          <View
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexGrow: 1,
              opacity: 0.6,
            }}
          >
            <View
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                maxWidth: "60%",
              }}
            >
              <Feather name="coffee" size={46} />
              <Text
                style={{ fontSize: 20, fontWeight: "bold", marginVertical: 15 }}
              >
                ProTip !
              </Text>
              <Text style={{ textAlign: "center" }}>
                You can select multiple blog items here by holding (long
                pressing) them.
              </Text>
            </View>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    height: "100%",
    width: 50,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f3f3f3",
    borderRadius: 10,
    marginHorizontal: 5,
  },
  icon: {
    fontSize: 25,
    color: "rgba(0,0,0,0.6)",
  },
});

export default SearchScreen;
