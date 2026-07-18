import axios from "axios";
import { getSession } from "next-auth/react";

const axiosPrivate = axios.create({
  headers: {
    "Content-Type": "application/json",
  },
});

axiosPrivate.interceptors.request.use(
  async (config) => {
    const session = await getSession();
    if (session?.user) {
      config.headers.Authorization = `Bearer ${session.user.id}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosPrivate.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error)
);

export default axiosPrivate;
