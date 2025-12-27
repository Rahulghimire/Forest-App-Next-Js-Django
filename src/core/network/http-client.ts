import { AxiosRequestConfig } from "axios";

import { Http } from "./axios";
import { MethodType } from "./axios.type";

export const HttpClient = {
  get: <T>(url: string, config?: AxiosRequestConfig<T>) =>
    createRequest<T>("get", url, undefined, config),
  post: <T>(url: string, data?: unknown, config?: AxiosRequestConfig<T>) =>
    createRequest<T>("post", url, data, config),
  put: <T>(url: string, data?: unknown, config?: AxiosRequestConfig<T>) =>
    createRequest<T>("put", url, data, config),
  patch: <T>(url: string, data?: unknown, config?: AxiosRequestConfig<T>) =>
    createRequest<T>("patch", url, data, config),
  delete: <T>(url: string, config?: AxiosRequestConfig<T>) =>
    createRequest<T>("delete", url, undefined, config),
};
const createRequest = async <TData>(
  method: MethodType,
  url: string,
  data?: unknown,
  config?: AxiosRequestConfig<TData>
) => {
  switch (method) {
    case "get":
    case "delete":
      return await Http[method]<TData>(url, config);
    case "post":
    case "put":
    case "patch":
      return await Http[method]<TData>(url, data, config);
    default:
      return Promise.reject("Method not supported");
  }
};
