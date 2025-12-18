import { adminLoginAction } from "@/core/auth/auth-actions";
import { Env } from "@/core/constants/env";
import Cookies from "js-cookie";
import { toast } from "react-toastify";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface PasswordCredentials {
  old_password: string;
  new_password: string;
  confirm_password: string;
}

export interface LoginResponse {
  access_token: string;
  // expires_in: number;
  refresh_token: string;
  token_type: string;
  user: {
    password_changed: boolean;
    id: string;
    name: string;
    email: string;
    role: string;
    permissions: string[];
  };
  message: string;
}

export interface ApiError {
  message: string;
  status: number;
}

export const authAPI = {
  login: async (credentials: LoginCredentials, router: any) => {
    const resData = await adminLoginAction(credentials);
    if (resData.error) {
      toast.error(resData.error || "Login failed");
      return;
    }
    if (!resData.data?.password_changed) {
      router.push("/admin-login/change-password");
    }

    return resData.data;
  },

  changePassword: async (credentials: PasswordCredentials): Promise<void> => {
    const response = await fetch(
      `${Env.baseApiUrl}user/change-password/`,

      {
        method: "POST",
        headers: {
          Authorization: `Bearer  ${Cookies.get("admin_access_token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      }
    );

    if (!response.ok) {
      toast.error("Change password failed");
      throw new Error("Change password failed");
    }
  },

  logout: async (): Promise<void> => {
    const formData = new FormData();
    formData.append("refresh", Cookies.get("admin_refresh_token") || "");

    const response = await fetch(`${Env.baseApiUrl}user/logout/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer  ${Cookies.get("admin_access_token")}`,
      },
      body: formData,
    });

    if (!response.ok) {
      toast.error("Logout failed");
      throw new Error("Logout failed");
    }
  },
};
