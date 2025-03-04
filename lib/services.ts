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
// update video ( updateVideo )
export const updateVideo = async (data: any) => {
  try {
    const response = await request.put(`/api/videos/update`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Failed to update video", error);
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

export const updateLanguage = async (data: any) => {
  try {
    const response = await request.put(`/api/languages/${data.id}`, data);
    return response.data;
  } catch (error) {
    console.error("Failed to update language", error);
    throw error;
  }
};

export const fetchAllLanguages = async () => {
  try {
    const response = await request.get("/api/languages");
    return response.data;
  } catch (error) {
    console.error("Failed to fetch languages", error);
    throw error;
  }
};

export const deleteLanguage = async (id: string) => {
  try {
    const response = await request.delete(`/api/languages/${id}`);
    return response.data;
  } catch (error) {
    console.error("Failed to delete language", error);
    throw error;
  }
};

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
