import axios from "axios";
import { GetServerSidePropsContext } from "next";
import { getSession } from "next-auth/react";

export interface ErrorType {
  response: {
    data: {
      error: string;
    };
  };
}
export interface RequestType<T> {
  data: T;
}

const baseURL = process.env.BASE_URL || process.env.NEXT_BASE_URL;
const defaultOptions = {
  baseURL,
};

const axiosInstance = axios.create(defaultOptions);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const tokenizedAxios = async (ctx?: GetServerSidePropsContext) => {
  const instance = axiosInstance;
  let session: any;
  if (ctx) {
    session = await getSession(ctx);
  } else if (typeof window && !ctx) {
    session = await getSession();
  }

  instance.interceptors.request.use((config) => {
    if (session?.user?.token) {
      config.headers["Authorization"] = `${session?.user?.token}`;
    }
    return config;
  });

  return instance;
};

export default axiosInstance;
