"use server";

import { AuthError } from "next-auth";
import { auth, signIn } from "./auth";

export const adminLoginAction = async (data: {
  email: string;
  password: string;
}) => {
  try {
    await signIn("credentials", { role: "admin", ...data, redirect: false });
  } catch (error) {
    return {
      error:
        (error as AuthError)?.cause?.err?.message || "Something went Wrong",
    };
  }
  return { data: (await auth())?.user };
};

export const userLoginAction = async (data: {
  email: string;
  password: string;
}) => {
  try {
    await signIn("credentials", { role: "user", ...data, redirect: false });
  } catch (error) {
    return {
      error:
        (error as AuthError)?.cause?.err?.message || "Something went Wrong",
    };
  }
  return { data: (await auth())?.user };
};
