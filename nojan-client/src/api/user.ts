import axiosInstance, { tokenizedAxios } from "@/services/axios";
import { DeviceNameType } from "@/services/historyService";
import { GetServerSidePropsContext } from "next";

export interface RegisterFormData {
  email: string;
  password: string;
  username: string;
  devices: Array<{
    name: DeviceNameType;
    ip: string;
  }>;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface LoginResponseType {
  token: string;
  user: UserType;
}

export interface UserType {
  id: string;
  username: string;
  email: string;
  role: string;
  devices: DeviceNameType[];
}

export type UserResponseType = UserType[];

const userUrls = {
  token: "/auth/login",
  users: "/auth/customers",
  register: "/auth/customers",
  me: "/auth/me",
};

export const registerUser = async (
  data: RegisterFormData,
  ctx?: GetServerSidePropsContext
) => {
  const axios = await tokenizedAxios(ctx);
  return axios.post(userUrls.register, data);
};

export const login = async (data: {
  email: string;
  password: string;
  username: string;
}) => {
  return axiosInstance.post<LoginResponseType>(userUrls.token, data);
};

export const getUsers = async (ctx?: GetServerSidePropsContext) => {
  const axios = await tokenizedAxios(ctx);
  return axios.get<UserResponseType>(userUrls.users);
};

export const deleteUser = async (
  email: string,
  ctx?: GetServerSidePropsContext
) => {
  const axios = await tokenizedAxios(ctx);
  return axios.delete<LoginResponseType>(`${userUrls.users}/${email}`);
};

export const getMe = async (ctx?: GetServerSidePropsContext) => {
  const axios = await tokenizedAxios(ctx);
  return axios.get<UserType>(userUrls.me);
};
