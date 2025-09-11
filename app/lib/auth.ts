import { message } from "antd";

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
  token_type: string;
  must_change_password: boolean;
  user: {
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
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
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


    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      message.error(errorData.message || "Login failed");
      throw {
        message: errorData.message || "Login failed",
        status: response.status,
      } as ApiError;
    }

    return response.json();
  },

  changePassword: async (
   credentials: PasswordCredentials
  ): Promise<void> => {
    const response = await fetch("/user/change-password/", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      message.error("Change password failed");
      throw new Error("Change password failed");
    }
  },

  logout: async (): Promise<void> => {
    const response = await fetch("/api/auth/logout", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    });

    if (!response.ok) {
      message.error("Logout failed");
      throw new Error("Logout failed");
    }
  },
};
