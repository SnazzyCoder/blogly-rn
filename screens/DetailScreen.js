// DetailScreen.js
import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  Share,
} from "react-native";
import { SharedElement } from "react-native-shared-element";
import { Feather } from "@expo/vector-icons";
import moment from "moment";

const DetailScreen = (props) => {
  const { width, height } = Dimensions.get("window");

  const { data } = props.route.params;

  return (
    <ScrollView style={styles.container}>
      <View>
        <SharedElement id={`item.${data.id}.photo`}>
          <Image
            source={{ uri: data.imageURI }}
            resizeMode="cover"
            style={{
              width: "100%",
              height: height - 450,
              borderBottomLeftRadius: 10,
              borderBottomRightRadius: 10,
            }}
          />
        </SharedElement>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            position: "absolute",
            bottom: 14,
            left: 10,
          }}
        >
          <SharedElement id={`item.${data.id}.profilePicURI`}>
            <Image
              resizeMode="cover"
              source={{ uri: data.profilePicURI }}
              style={{
                width: 60,
                height: 60,
                borderRadius: 10,
                marginRight: 14,
              }}
            />
          </SharedElement>
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              paddingRight: 20,
            }}
          >
            <View>
              <SharedElement id={`item.${data.id}.username`}>
                <Text
                  style={{ color: "white", fontSize: 16, fontWeight: "bold" }}
                >
                  {data.username}
                </Text>
              </SharedElement>
              <SharedElement id={`item.${data.id}.readTime`}>
                <Text style={{ color: "white", fontSize: 14 }}>
                  {data.readTime} • {moment(data.createdAt).fromNow()}
                </Text>
              </SharedElement>
            </View>
            <TouchableOpacity
              onPress={async () =>
                await Share.share({
                  message: `Hey, your conctact has shared an article with you on Bloger. Have a sneak peak:\n\n"${data.title}"\n\nBy ${data.username} • ${data.readTime}\n\n${data.content}\n\n======================\nThat was it. To read more such stories, and experience the full features, download the Bloger app now. (Bloger is an application created for WLV University's Mobile dev assignment)`,
                })
              }
            >
              <Feather name="share" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View style={{ paddingHorizontal: 10, paddingTop: 14 }}>
        <SharedElement
          id={`item.${data.id}.text`}
          style={{ width: width - 30, marginBottom: 14 }}
        >
          <Text style={{ fontSize: 22, fontWeight: "bold", lineHeight: 32 }}>
            {data.title}
          </Text>
        </SharedElement>
        <Text
          style={{
            fontSize: 14,
            lineHeight: 28,
            textAlign: "justify",
            opacity: 0.5,
          }}
        >
          {data.content}
        </Text>
      </View>

      <View style={{ position: "absolute", top: 40, left: 10 }}>
        <TouchableOpacity onPress={() => props.navigation.goBack()}>
          <Feather name="arrow-left" size={25} color="white" />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default DetailScreen;
