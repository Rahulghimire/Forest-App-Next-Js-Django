import { Env } from "@/core/constants/env";
import { HttpClient } from "@/core/network/http-client";
import Cookies from "js-cookie";
export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  user_email: string;
  phone_number: string;
}

export interface UserList {
  count: number;
  next: string | null;
  previous: string | null;
  data: User[];
}

export const fetchApi = async (url: string): Promise<any> => {
  const res = await HttpClient.get(url, {
    headers: {
      Authorization: `Bearer ${Cookies.get("user_access_token")}`,
    },
  });

  return res.data;
};
export const createApi = async (url: string, data: Omit<any, "id">) => {
  const res = await HttpClient.post(url, data, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  return res.data;
};

export const createApiFormData = async (url: string, data: any) => {
  const res = await HttpClient.post(url, data, {
    headers: {
      Authorization: `Bearer ${Cookies.get("user_access_token")}`,
    },
  });

  return res.data;
};

export const updateApiFormData = async (url: string, data: any) => {
  const res = await HttpClient.put(`${Env.baseApiUrl}${url}/`, data);

  return res.data;
};

export const updateApi = async (url: string, user: any) => {
  const res = await HttpClient.put(`${Env.baseApiUrl}${url}${user.id}/`, user, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  return res.data;
};

export const deleteApi = async (url: string) => {
  const res = await HttpClient.delete(url, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return res.status === 204 ? {} : res.data;
};
