import React, { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { showMessage } from "react-native-flash-message";
import { Asset } from "expo-asset";

const UserAPI = () => {
  const [refreshVar, setRefreshVar] = useState(false);
  const [userDetails, setUserDetails] = useState({});

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const jsonValues = await AsyncStorage.getItem("@userDetails");
        const source = jsonValues !== null ? JSON.parse(jsonValues) : {};
        const toSet = {
          ...source,
          profilePicURI:
            source.profilePicURI ||
            Asset.fromModule(require("../assets/default_user.jpg")).uri,
          name: source.name || "No Name",
        };
        setUserDetails(toSet);
      } catch (err) {
        console.log("Error", err);
      }
    };

    fetchDetails();
    // handleSubmits({name: "Mohit Yadav", "profilePicURI": "https://images.pexels.com/photos/1082962/pexels-photo-1082962.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"})
  }, [refreshVar]);

  handleSubmits = async (newDetails) => {
    try {
      await AsyncStorage.setItem("@userDetails", JSON.stringify(newDetails));
      refreshAccount();
    } catch (err) {
      console.log("Error", err);
    }
  };

  const refreshAccount = () => setRefreshVar(!refreshVar);

  return {
    userDetails: [userDetails, setUserDetails],
    refreshAccount,
    handleSubmits,
  };
};

export default UserAPI;
