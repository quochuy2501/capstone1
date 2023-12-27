
import { useState, useMemo } from "react";
import { getCookie } from "../configs/cookie";
import axios from "axios";

const useAxios = () => {
  const [accessToken, setAccessToken] = useState("");

  const api = useMemo(() => {
    return axios.create({
      baseURL: "http://localhost:8000/api",
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });
  }, []);

  api.interceptors.request.use((config) => {
    const newAccessToken = accessToken || getCookie("access_token");
    if (newAccessToken) {
      config.headers.Authorization = `Bearer ${newAccessToken}`;
    }
    return config;
  });

  return {
    api,
    setAccessToken,
  };
};

export default useAxios;