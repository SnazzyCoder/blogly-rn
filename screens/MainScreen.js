import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  Image,
  Dimensions,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  RefreshControl,
} from "react-native";
import { GlobalState } from "../DataProvider";
import { Feather } from "@expo/vector-icons";
import moment from "moment";
import _ from 'lodash'

import { SharedElement } from "react-native-shared-element";
import TouchableScale from "react-native-touchable-scale";

import { data, profile, popular } from "../data";

const MainScreen = ({ navigation }) => {
  const { width, height } = Dimensions.get("window");
  const state = useContext(GlobalState);
  const {profilePicURI} = state.UserAPI.userDetails[0]
  const [blogs, setBlogs] = state.BlogAPI.blogs;
  const setCustomBlogs = state.BlogAPI.setCustomBlogs;

  // useEffect(() => {
  // }, [])

  const Header = () => (
    <View style={styles.header}>
      <View>
        <Text style={styles.headerDate}>
          {new Date()
            .toLocaleDateString("en-GB", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })
            .replace(/ /g, "-")}
        </Text>
        <Text style={styles.headerTitle}>Bloger</Text>
      </View>
      <TouchableScale onPress={() => navigation.navigate("Account")}>
        <Image
          source={{ uri: profilePicURI }}
          style={styles.headerImage}
        />
        <View style={styles.headerImageNotification}></View>
      </TouchableScale>
    </View>
  );

  const Blogs = () =>
    _.orderBy(blogs, ['createdAt'],['desc']).map((item) => (
      <View
        key={item.id}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginVertical: 10,
        }}
      >
        {/* Blog Item Root */}
        <TouchableScale
          activeScale={0.9}
          tension={50}
          friction={7}
          userNativeDriver
          onPress={() => navigation.navigate("DetailScreen", { data: item })}
          style={{
            width: "100%",
          }}
        >
          <SharedElement id={`item.${item.id}.photo`}>
            {/* Background */}
            <Image
              source={{ uri: item.imageURI }}
              style={{
                width: "100%",
                height: height - 450,
                borderRadius: 14,
                marginRight: 30,
                backgroundColor: "black",
              }}
            />
          </SharedElement>
          <SharedElement
            id={`item.${item.id}.text`}
            style={{
              width: width - 90,
              position: "absolute",
              bottom: 90,
              left: 10,
              paddingHorizontal: 10,
            }}
          >
            <Text style={styles.blogTitle}>{item.title}</Text>
          </SharedElement>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              position: "absolute",
              bottom: 20,
              left: 20,
            }}
          >
            <SharedElement id={`item.${item.id}.profilePicURI`}>
              <Image
                resizeMode="cover"
                source={{ uri: item.profilePicURI }}
                style={styles.blogProfilePic}
              />
            </SharedElement>
            <View>
              <SharedElement id={`item.${item.id}.username`}>
                <Text style={styles.blogUsername}>{item.username}</Text>
              </SharedElement>
              <SharedElement id={`item.${item.id}.readTime`}>
                <Text style={styles.readTime}>
                  {item.readTime} • {moment(item.createdAt).fromNow()}
                </Text>
              </SharedElement>
            </View>
          </View>
        </TouchableScale>
      </View>
    ));

  return (
    <SafeAreaView style={{ flexGrow: 1, backgroundColor: "white" }}>
      <ScrollView
        style={{ flex: 1, marginTop: 30 }}
        refreshControl={
          <RefreshControl onRefresh={state.BlogAPI.refreshBlogs} />
        }
      >
        <Header />
        <View style={{ paddingHorizontal: 30 }}>
          {blogs.length > 0 ? (
            <Blogs />
          ) : (
            <View
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexGrow: 1,
                minHeight: 500,
              }}
            >
              <Feather
                name="plus-circle"
                style={{ fontSize: 50, color: "rgba(0,0,0,.5)" }}
              />
              <Text
                style={{
                  fontSize: 24,
                  fontWeight: "600",
                  color: "rgba(0,0,0,.7)",
                  marginVertical: 10,
                }}
              >
                Looks like you're new
              </Text>
              <Text
                style={{
                  width: 250,
                  textAlign: "center",
                  color: "rgba(0,0,0,.6)",
                  fontWeight: "500",
                }}
              >
                Click in the bottom tab navigator to go to create a new Blog
                Item. Load sample data by clicking the button if you're in a
                hurry.
              </Text>
              <TouchableScale
                style={{
                  flexDirection: "row",
                  padding: 12,
                  alignItems: "center",
                  width: 100,
                  backgroundColor: "#b12341",
                  borderRadius: 10,
                  justifyContent: "center",
                  marginVertical: 10,
                }}
                onPress={setCustomBlogs}
              >
                <Text style={{ color: "white", fontWeight: "bold", textAlign: "center" }}>
                  Load Samples
                </Text>
              </TouchableScale>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    paddingHorizontal: 30,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 30,
  },
  headerDate: {
    fontSize: 14,
    fontWeight: "700",
    color: "#b12341",
    textTransform: "uppercase",
  },
  headerTitle: {
    fontSize: 36,
    fontWeight: "bold",
  },
  headerImage: {
    width: 55,
    height: 55,
    borderRadius: 10,
  },
  headerImageNotification: {
    height: 14,
    width: 14,
    borderRadius: 6,
    position: "absolute",
    backgroundColor: "red",
    right: -2,
    top: -4,
    borderWidth: 2,
    borderColor: "white",
  },
  blogTitle: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    lineHeight: 28,
  },
  blogProfilePic: {
    height: 50,
    width: 50,
    borderRadius: 10,
    marginRight: 14,
  },
  blogUsername: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  readTime: {
    fontSize: 14,
    color: "white",
  },
});

export default MainScreen;
