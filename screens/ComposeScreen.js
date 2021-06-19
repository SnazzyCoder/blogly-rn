import React, { useState, useEffect, useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TextInput,
  Image,
} from "react-native";
import TouchableScale from "react-native-touchable-scale";
import { GlobalState } from "../DataProvider";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";

const initialState = {
  title: "",
  content: "",
  imageURI: "",
};
const placeholderImage =
  "https://images.pexels.com/photos/3435272/pexels-photo-3435272.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940";

export default function ComposeScreen({ navigation }) {
  const state = useContext(GlobalState);
  const saveNewBlog = state.BlogAPI.newBlog;
  const [userDetails] = state.UserAPI.userDetails;
  const [newBlog, setNewBlog] = useState(initialState);

  useEffect(() => {
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

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.cancelled) {
      setNewBlog({ ...newBlog, imageURI: result.uri });
    }
  };

  const handleSave = () => {
    saveNewBlog({
      ...newBlog,
      username: userDetails.name,
      profilePicURI: userDetails.profilePicURI,
    });
    setNewBlog(initialState);
  };

  return (
    <SafeAreaView style={{ flexGrow: 1, backgroundColor: "white" }}>
      <KeyboardAwareScrollView
        style={{
          paddingHorizontal: 20,
          paddingTop: 30
        }}
      >
        {/* Top Content */}
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {/* Header */}
          <Text
            style={{
              fontSize: 24,
              fontWeight: "bold",
            }}
          >
            {/* Header Text */}
            Compose
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
            }}
            onPress={() => {
              if (!newBlog.title || !newBlog.content || !newBlog.imageURI)
                return alert(
                  "Please fill out all fields, attach a photo as well"
                );
              handleSave();
              navigation.navigate("MainScreen");
            }}
          >
            <Text style={{ color: "white", fontWeight: "bold" }}>Post</Text>
          </TouchableScale>
        </View>
        <TouchableScale
          style={{
            width: "100%",
            maxHeight: 300,
            marginVertical: 20,
            marginTop: 25,
          }}
          tension={80}
          friction={100}
          onPress={pickImage}
          onLongPress={() => {
            setNewBlog({ ...newBlog, imageURI: placeholderImage });
          }}
        >
          {newBlog.imageURI ? (
            <>
              <Image
                source={{ uri: newBlog.imageURI }}
                style={{ width: "100%", height: "100%", borderRadius: 15 }}
              />
              <Ionicons
                name="create"
                size={30}
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
              <TouchableScale
                style={{
                  backgroundColor: "#6fc2ec",
                  position: "absolute",
                  top: -3,
                  left: -3,
                  borderRadius: 13,
                }}
                onPress={() => setNewBlog({ ...newBlog, imageURI: "" })}
              >
                <Ionicons
                  name="close"
                  size={30}
                  color="black"
                  style={{
                    padding: 7,
                    overflow: "hidden",
                  }}
                />
              </TouchableScale>
            </>
          ) : (
            <View
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderWidth: 2,
                borderStyle: "dashed",
                borderColor: "rgba(0,0,0,.6)",
                borderRadius: 20,
                paddingVertical: 20,
              }}
            >
              <Ionicons
                name="images"
                style={{
                  fontSize: 50,
                  color: "rgba(0,0,0,.6)",
                }}
              />
              <Text
                style={{
                  fontSize: 24,
                  fontWeight: "bold",
                  color: "rgba(0,0,0,.6)",
                  marginVertical: 10,
                }}
              >
                Add an image
              </Text>
              <Text
                style={{
                  color: "rgba(0,0,0,.4)",
                  textAlign: "center",
                  maxWidth: "70%",
                }}
              >
                Add an image from your gallery to make the post more amazing
              </Text>
            </View>
          )}
        </TouchableScale>
        <TextInput
          style={[styles.textBox, { height: 65, fontSize: 18 }]}
          placeholder="Title"
          value={newBlog.title}
          onChangeText={(value) => setNewBlog({ ...newBlog, title: value })}
        />
        <TextInput
          style={[
            styles.textBox,
            { paddingVertical: 20, paddingTop: 20, minHeight: 200 },
          ]}
          placeholder="Content"
          value={newBlog.content}
          onChangeText={(value) => setNewBlog({ ...newBlog, content: value })}
          multiline
        />
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  textBox: {
    paddingHorizontal: 20,
    borderRadius: 10,
    backgroundColor: "#f3f3f3",
    fontWeight: "bold",
    marginRight: 5,
    marginVertical: 10,
    minHeight: 35,
  },
});
