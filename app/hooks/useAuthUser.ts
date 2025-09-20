import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { ApiError, authAPI, LoginCredentials } from "../lib/userAuth";
import Cookies from "js-cookie";

export const useUserLogin = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentials: LoginCredentials) =>
      authAPI.login(credentials, router),
    onSuccess: (data) => {
      Cookies.set("user_access_token", data?.access_token, { expires: 7 });
      Cookies.set("user_refresh_token", data?.refresh_token, { expires: 7 });
      // localStorage.setItem("access_token", data?.access_token);
      // localStorage.setItem("refresh_token", data?.refresh_token);
      localStorage.setItem("user_data", JSON.stringify(data?.user));
      queryClient.setQueryData(["currentUser"], data.user);
      toast.success(data?.message || "Login successful!");
      if (!data?.user?.password_changed) {
        router.push("/change-password");
        return;
      }
      router.push("/user/dashboard");
    },
    onError: (error: ApiError) => {
      toast.error(error?.message || "Login failed. Please try again.");
    },
  });
};

export const useUserChangePassword = () => {
  const router = useRouter();
  return useMutation({
    mutationFn: authAPI.changePassword,
    onSuccess: () => {
      toast.success("Password changed successfully");
      // router.push("/user/dashboard");
      router.push("/");
    },
    onError: () => {
      toast.error("Password change failed");
    },
  });
};

export const useUserLogout = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authAPI.logout,
    onSuccess: () => {
      localStorage.removeItem("access_token");
      Object.keys(Cookies.get()).forEach((cookieName) => {
        Cookies.remove(cookieName);
      });
      queryClient.clear();
      toast.success("Logged out successfully");
      router.push("/");
    },
    onError: () => {
      // toast.error("Logout failed");
      localStorage.removeItem("access_token");
      queryClient.clear();
      router.push("/");
    },
  });
};
