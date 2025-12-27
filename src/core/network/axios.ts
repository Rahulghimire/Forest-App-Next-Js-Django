import axios from "axios";
import https from "https";
import { getServerSession } from "../actions/session.action";
import { Env } from "../constants/env";

const ONE_MINUTE_IN_MS = 60 * 1000;

const httpAgent = new https.Agent({
  rejectUnauthorized: false,
});

export const Http = axios.create({
  baseURL: Env.baseApiUrl || "https://beta.onlinenotesnepal.com",
  timeout: ONE_MINUTE_IN_MS,
  httpsAgent: httpAgent,
});

Http.interceptors.request.use(
  async (config) => {
    try {
      const session = await getServerSession();
      const accessToken = session?.user?.access_token || "";
      if (config.headers) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
    } catch (e) {
      console.error(e);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
