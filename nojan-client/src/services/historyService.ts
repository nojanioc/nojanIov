import { GetServerSidePropsContext } from "next";
import { tokenizedAxios } from "./axios";

export type historyFilterType = "monthly" | "full" | "yearly";
export type DeviceNameType = "dishwasher" | "pizzaoven";

export interface HistoryReqType {
  deviceName?: DeviceNameType;
  filter?: historyFilterType;
  limit?: number;
  page?: number;
}

export type HistoryType = {
  machineName: string;
  receivedAt: string;
  status: number;
};

export interface HistoryResponseType {
  filter: historyFilterType;
  history: HistoryType[];
  pasge: number;
  pages: number;
  total: number;
  deviceName: DeviceNameType;
}

export const getHistory = async ({
  ctx,
  params,
}: {
  ctx?: GetServerSidePropsContext;
  params?: HistoryReqType;
}) => {
  const axios = await tokenizedAxios(ctx);
  return axios.get("/history", { params: { ...params } }).then((res) => {
    return res.data;
  });
};
