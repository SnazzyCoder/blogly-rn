import React, { useState, useEffect, useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  TextInput,
  TouchableOpacity,
  Dimensions,
  RefreshControl,
  Alert,
} from "react-native";
import TouchableScale from "react-native-touchable-scale";
import { Ionicons } from "@expo/vector-icons";
import { GlobalState } from "../DataProvider";
import * as ImagePicker from "expo-image-picker";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AccountScreen = () => {
  const state = useContext(GlobalState);
  const [details, setDetails] = useState({ name: "", profilePicURI: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [sourceDetails] = state.UserAPI.userDetails;
  const UserAPI = state.UserAPI;
  const [blogs] = state.BlogAPI.blogs;

  useEffect(() => {
    setDetails(sourceDetails);
    (async () => {
      if (Platform.OS !== "web") {
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          alert("Sorry, we need camera roll permissions to make this work!");
        }
      }
    })();
  }, []);

  useEffect(() => {
    if (sourceDetails !== details) {
      setIsEditing(true);
      console.log("changing");
    } else {
      setIsEditing(false);
      console.log("Changed");
    }
  }, [details]);

  const handleDetailsChange = (val) => {
    setDetails({ ...details, ...val });
  };

  const handleSave = () => {
    state.UserAPI.handleSubmits(details);
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [2, 2],
      quality: 0.5,
    });

    if (!result.cancelled) {
      setDetails({ ...details, profilePicURI: result.uri });
    }
  };

  const { width, height } = Dimensions.get("window");

  useEffect(() => {}, []);

  return (
    <SafeAreaView style={{ backgroundColor: "white", flexGrow: 1 }}>
      <KeyboardAwareScrollView
        refreshControl={
          <RefreshControl onRefresh={() => UserAPI.refreshAccount()} />
        }
        style={{marginTop: 30}}
      >
        <View style={{ flexGrow: 1, paddingHorizontal: 30 }}>
          <View style={styles.header} style={{ zIndex: 100 }}>
            <TouchableScale
              style={{
                backgroundColor: "#6fc2ec",
                width: 50,
                height: 50,
                display: "flex",
                position: "absolute",
                alignItems: "center",
                justifyContent: "center",
                top: 0,
                right: 0,
                zIndex: 100,
                shadowOpacity: 1,
                shadowRadius: 1,
                shadowColor: "rgba(0,0,0,.5)",
                shadowOffset: { width: 0, height: 1 },
                borderRadius: 18,
              }}
              onPress={() => handleSave()}
            >
              <Ionicons
                name="checkmark-circle"
                color="black"
                size={27}
                style={{ fontWeight: "bold" }}
              />
            </TouchableScale>
          </View>
          <View style={styles.content}>
            {/* Content */}
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                flexGrow: 0,
                alignItems: "center",
                justifyContent: "center",
                marginTop: 50,
                marginBottom: 50,
              }}
            >
              <View
                style={{
                  display: "flex",
                  flexDirection: "column",
                  backgroundColor: "#b12341",
                  width: width + 200,
                  height: 130,
                  position: "absolute",
                  bottom: 40,
                  transform: [{ rotate: "-15deg" }],
                }}
              ></View>
              <TouchableScale onPress={pickImage}>
                <Image
                  source={{
                    uri:
                      details && details.profilePicURI
                        ? details.profilePicURI
                        : "",
                  }}
                  style={styles.image}
                />
                <Ionicons
                  name="camera"
                  size={20}
                  color="black"
                  style={{
                    backgroundColor: "#6fc2ec",
                    position: "absolute",
                    top: -3,
                    right: -3,
                    padding: 7,
                    overflow: "hidden",
                    borderRadius: 13,
                  }}
                />
              </TouchableScale>
            </View>
            <View style={{ marginVertical: 10 }}>
              <TextInput
                style={{
                  padding: 20,
                  borderRadius: 10,
                  fontSize: 14,
                  backgroundColor: "#f3f3f3",
                  fontWeight: "bold",
                }}
                placeholder="Your name"
                value={details.name}
                onChangeText={(value) => handleDetailsChange({ name: value })}
              />
            </View>
            <View style={{ marginVertical: 10 }}>
              <Text style={styles.headerText}>Advanced Settings</Text>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  width: "100%",
                  overflow: "scroll",
                }}
              >
                <TouchableScale
                  style={[
                    styles.box,
                    { marginRight: 10, backgroundColor: "#6fc2ec" },
                  ]}
                  onPress={() => {
                    AsyncStorage.getAllKeys().then(AsyncStorage.multiRemove);
                    UserAPI.refreshAccount();
                  }}
                >
                  <View>
                    <View style={styles.iconContainer}>
                      <Ionicons
                        color="#6fc2ec"
                        name="trash"
                        style={styles.icon}
                      />
                    </View>
                    <Text style={styles.boxTitle}>Storage</Text>
                    <View style={styles.boxTextContainer}>
                      <Text style={styles.boxText}>
                        Wipe all{" "}
                        <Text style={{ textDecorationLine: "underline" }}>
                          Data.
                        </Text>
                      </Text>
                      <Ionicons name="arrow-forward" style={styles.boxArrow} />
                    </View>
                  </View>
                </TouchableScale>
                <TouchableScale
                  onPress={() =>
                    Alert.alert(
                      "Protip",
                      "Go to the search tab and hold onto an item to enter selection mode!"
                    )
                  }
                  style={[
                    styles.box,
                    { marginLeft: 10, backgroundColor: "#f7be7d" },
                  ]}
                >
                  <View>
                    <View style={styles.iconContainer}>
                      <Ionicons
                        color="#f7be7d"
                        name="happy"
                        style={styles.icon}
                      />
                    </View>
                    <Text style={styles.boxTitle}>Pro Tip</Text>
                    <View style={styles.boxTextContainer}>
                      <Text style={styles.boxText}>
                        Click to{" "}
                        <Text style={{ textDecorationLine: "underline" }}>
                          View.
                        </Text>
                      </Text>
                      <Ionicons name="arrow-forward" style={styles.boxArrow} />
                    </View>
                  </View>
                </TouchableScale>
              </View>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                  padding: 10,
                }}
              >
                <View style={styles.subText}>
                  <Text style={styles.subTextTop}>Your Blogs</Text>
                  <Text style={styles.subTextBottom}>
                    {
                      blogs.filter((blog) => blog.username === details.name)
                        .length
                    }
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  image: {
    width: 150,
    height: 150,
    borderRadius: 50,
  },
  content: {
    marginVertical: 15,
  },
  header: {},
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 15,
  },
  subText: {
    textAlign: "center",
    justifyContent: "center",
    display: "flex",
    alignItems: "center",
  },
  subTextTop: {
    fontWeight: "bold",
    color: "gray",
    fontSize: 15,
    marginVertical: 10,
  },
  subTextBottom: {
    fontSize: 18,
    fontWeight: "bold",
  },
  box: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    flex: 1,
    padding: 15,
    borderRadius: 20,
    height: 200,
  },
  icon: {
    fontSize: 30,
  },
  iconContainer: {
    borderRadius: 15,
    backgroundColor: "white",
    flexGrow: 0,
    maxHeight: 50,
    maxWidth: 50,
    padding: 5,
    height: 50,
    width: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  boxTitle: {
    color: "rgba(0,0,0,.6)",
    fontWeight: "bold",
    marginBottom: 10,
    marginTop: 15,
    fontSize: 15,
  },
  boxTextContainer: {
    display: "flex",
    justifyContent: "space-between",
    flexDirection: "row",
    flexGrow: 1,
    width: "100%",
  },
  boxText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "rgba(0,0,0,.5)",
    lineHeight: 25,
  },
  boxArrow: {
    fontSize: 20,
    color: "rgba(0,0,0,.5)",
    paddingRight: 100,
  },
});

export default AccountScreen;
