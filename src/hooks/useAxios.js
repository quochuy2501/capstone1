import { useState } from "react";
import { getCookie } from "../configs/cookie";
import axios from "axios";

const useAxios = () => {
  const [accessToken, setAccessToken] = useState(
    "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjgwMDAvYXBpL2xvZ2luIiwiaWF0IjoxNjk2NDM0MjE3LCJleHAiOjE2OTY1MjA2MTcsIm5iZiI6MTY5NjQzNDIxNywianRpIjoieWVweHpXYWpmYU5ESjlLSiIsInN1YiI6IjUiLCJwcnYiOiIyM2JkNWM4OTQ5ZjYwMGFkYjM5ZTcwMWM0MDA4NzJkYjdhNTk3NmY3In0.O_9fUSAJP370GDpXHvULipZ043yaHpdNWDmR-iCWMSw"
  );

  const api = axios.create({
    baseURL: "http://localhost:8000/api",
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true,
  });

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
