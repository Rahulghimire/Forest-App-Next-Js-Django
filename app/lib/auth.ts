export interface LoginCredentials {
  email: string;
  password: string;
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
      throw {
        message: errorData.message || "Login failed",
        status: response.status,
      } as ApiError;
    }

    return response.json();
  },

  logout: async (): Promise<void> => {
    const response = await fetch("/api/auth/logout", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!response.ok) {
      throw new Error("Logout failed");
    }
  },
};
