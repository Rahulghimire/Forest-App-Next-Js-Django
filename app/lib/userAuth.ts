import { message } from "antd";
import { redirect } from "next/navigation";

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
  expires_in: number;
  refresh_token: string;
  detail?: string;
  token_type: string;
  user: {
    password_changed: boolean;
    id: string;
    email: string;
    name: string;
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
  login: async (
    credentials: LoginCredentials,
    router: any
  ): Promise<LoginResponse> => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}user/login/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      }
    );

    const resData = await response.json();

    if (resData?.detail?.toLowerCase() === "password change required") {
      router && router.push("/change-password");
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      message.error(errorData.message || "Login failed");
      throw {
        message: errorData.message || "Login failed",
        status: response.status,
      } as ApiError;
    }

    return resData;
  },

  changePassword: async (credentials: PasswordCredentials): Promise<void> => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}user/change-password/`,

      {
        method: "POST",
        headers: {
          // Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      }
    );

    if (!response.ok) {
      message.error("Change password failed");
      throw new Error("Change password failed");
    }
  },

  logout: async (): Promise<void> => {
    const formData = new FormData();
    formData.append("refresh", localStorage.getItem("refresh_token") || "");

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}user/logout/`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
        body: formData,
      }
    );

    if (!response.ok) {
      message.error("Logout failed");
      throw new Error("Logout failed");
    }
  },
};
