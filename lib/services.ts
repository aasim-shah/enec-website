import axios from "axios";
import request from "./request";
const baseurl = process.env.NEXT_PUBLIC_BASE_URL;

export const fetchAllVideos = async (lang: string) => {
  try {
    const response = await request.get("/api/videos/all", {
      headers: {
        "Content-Type": "application/json",
        language: lang,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

//  pushign
export const deleteVideo = async (id: string) => {
  try {
    const response = await request.delete(`/api/videos/delete/${id}`);
    return response.data;
  } catch (error) {
    console.error("Failed to delete video", error);
    throw error;
  }
};

export const addLanuage = async (data: any) => {
  try {
    const response = await request.post("/api/languages/", data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/// fetch all languages
export const fetchAllLanguages = async () => {
  try {
    const response = await request.get("/api/languages");
    return response.data;
  } catch (error) {
    console.error("Failed to fetch languages", error);
    throw error;
  }
};

// delete language
export const deleteLanguage = async (id: string) => {
  try {
    const response = await request.delete(`/api/languages/${id}`);
    return response.data;
  } catch (error) {
    console.error("Failed to delete language", error);
    throw error;
  }
};

// get all stats

export const fetchStats = async () => {
  try {
    const response = await request.get("/api/videos/stats");
    return response.data;
  } catch (error) {
    console.error("Failed to fetch stats", error);
    throw error;
  }
};

export const getUserData = async () => {
  try {
    const response = await request.get(`/api/users/details`, {
      headers: { requiresAuth: true },
    });

    console.log({ response });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// login user using email and password
export const loginUser = async (data: any) => {
  try {
    const response = await request.post(`/api/users/login`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};
