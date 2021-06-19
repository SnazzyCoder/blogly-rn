import React, { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { v4 as uuid } from "uuid";
import _ from "lodash";

import { data } from "../data";

const BlogAPI = () => {
  const [blogs, setBlogs] = useState([]);
  const [sourceBlogs, setSourceBlogs] = useState([]);
  const [searchBlogs, setSearchBlogs] = useState([]);
  const [selectedBlogIds, setSelectedBlogIds] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [refreshVar, setRefreshVar] = useState(true);

  useEffect(() => {
    // Startup
    const getBlogs = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem("@blogs");
        setSourceBlogs(jsonValue != null ? JSON.parse(jsonValue) : []);
      } catch (e) {
        // error reading value
        console.log("Error!!", e);
      }
    };

    getBlogs();
    // setCustomBlogs()
  }, [refreshVar]);

  useEffect(() => {
    // Source loaded Effect
    setBlogs(
      processPosts(sourceBlogs.map((blog) => ({ ...blog, isSelected: false })))
    );
    // deleteBlogs(['df00aeaf-4a5c-499c-ae15-e3e5473c4a26'])
  }, [sourceBlogs]);

  useEffect(() => {
    setSelectedBlogIds(
      blogs
        .map((blog) => (blog.isSelected ? blog.id : null))
        .filter((ele) => !!ele)
    );
  }, [blogs]);

  useEffect(() => {
    // Search Effect
    if (searchTerm == "") return setBlogs(processPosts(sourceBlogs));

    setBlogs(
      processPosts(
        _.filter(sourceBlogs, ({ title }) => {
          // Advanced Search (checks if serach term and match have all characters in common)
          return title.toLowerCase().includes(searchTerm.toLowerCase());
        })
      )
    );
  }, [searchTerm]);

  const refreshBlogs = () => setRefreshVar(!refreshVar);

  const setCustomBlogs = async () => {
    await AsyncStorage.setItem(
      "@blogs",
      JSON.stringify(data.map((blog) => ({ ...blog, id: uuid() })))
    );
    refreshBlogs()
  };

  const toggleSelect = (id) => {
    setBlogs(
      blogs.map((blog) =>
        blog.id === id ? { ...blog, isSelected: !blog.isSelected } : blog
      )
    );
  };
  const processPosts = (toSet) => {
    // Wrap set blog everywhere to append imoprtant values like is Selected etc.
    return toSet.map((blogItem) => ({
      ...blogItem,
      isSelected: false,
      readTime: getReadTime(blogItem.content),
    }));
  };
  
  const getReadTime = (article) => {
    const wordsPerMinute = 200; // Average case.
    
    let textLength = article.split(" ").length; // Split by words
    if (textLength < 0) return "0 min read";
    return `${Math.round(textLength / wordsPerMinute)} min`;
  };
  
  const selectAll = () => {
    setBlogs(blogs.map((blog) => ({ ...blog, isSelected: true })));
  };
  const deselectAll = () => {
    setBlogs(blogs.map((blog) => ({ ...blog, isSelected: false })));
  };

  const deleteBlogs = async (blogsToDelete) => {
    // Argument: blogsToDelete = array of ids of blog to delete
    const toSet = sourceBlogs.filter(
      (sourceBlog) => !blogsToDelete.includes(sourceBlog.id)
    );
    await AsyncStorage.setItem("@blogs", JSON.stringify(toSet));

    refreshBlogs();
  };
  // deleteBlogs(["d9f0baca-ea51-4fef-a293-6b70dd446d3c"])

  const newBlog = async ({ title, content, imageURI, username, profilePicURI }) => {
    try {
      const singleItem = {title, content, imageURI, createdAt: Date.now(), updatedAt: Date.now(), username: username || "New User", profilePicURI: profilePicURI || require('../assets/icon.png'), id: uuid()}
      const toAdd = [...sourceBlogs, singleItem]
      await AsyncStorage.setItem("@blogs", JSON.stringify(toAdd));
      refreshBlogs()
    } catch (e) {
      // saving error
      console.log("Error!!", e);
    }
  };

  return {
    searchTerm: [searchTerm, setSearchTerm],
    blogs: [blogs, setBlogs],
    sourceBlogs: [sourceBlogs, setSourceBlogs],
    selectFunctions: { toggleSelect, selectAll, deselectAll },
    selectedBlogIds,
    deleteBlogs,
    selectedBlogIds,
    deleteBlogs,
    setCustomBlogs,
    refreshBlogs,
    newBlog
  };
};

export default BlogAPI;
