import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { ApiError, authAPI, LoginCredentials } from "../lib/auth";
import { toast } from "react-toastify";
import Cookies from "js-cookie";

export const useLogin = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentials: LoginCredentials) =>
      authAPI.login(credentials, router),
    onSuccess: (data) => {
      Cookies.set("admin_access_token", data?.access_token, {
        expires: 7,
      });
      Cookies.set("admin_refresh_token", data?.refresh_token, {
        expires: 7,
      });
      localStorage.setItem("admin_data", JSON.stringify(data?.user));
      // localStorage.setItem("access_token", data?.access_token);
      // localStorage.setItem("refresh_token", data?.refresh_token);
      queryClient.setQueryData(["currentUser"], data.user);
      toast.success(data?.message || "Login successful!");
      if (!data?.user?.password_changed) {
        router.push("/admin-login/change-password");
        return;
      }
      router.push("/admin/dashboard");
    },
    onError: (error: ApiError) => {
      // toast.error(error?.message || "Login failed. Please try again.");
    },
  });
};

export const useChangePassword = () => {
  const router = useRouter();
  return useMutation({
    mutationFn: authAPI.changePassword,
    onSuccess: () => {
      toast.success("Password changed successfully");
      router.push("/admin/dashboard");
    },
    onError: () => {
      toast.error("Password change failed");
    },
  });
};

export const useLogout = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authAPI.logout,
    onSuccess: () => {
      Object.keys(Cookies.get()).forEach((cookieName) => {
        Cookies.remove(cookieName);
      });
      localStorage.removeItem("access_token");
      queryClient.clear();
      toast.success("Logged out successfully");
      router.push("/admin-login");
    },
    onError: () => {
      // toast.error("Logout failed");
      localStorage.removeItem("access_token");
      queryClient.clear();
      router.push("/admin-login");
    },
  });
};
