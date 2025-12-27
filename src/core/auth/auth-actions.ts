"use server";

import { AuthError } from "next-auth";
import { ApiError } from "next/dist/server/api-utils";
import { cookies } from "next/headers";
import { redirect, RedirectType } from "next/navigation";
import { auth, signIn } from "./auth";

export const adminLoginAction = async (data: {
  email: string;
  password: string;
}) => {
  try {
    await signIn("credentials", { role: "admin", ...data, redirect: false });
    return { data: (await auth())?.user };
  } catch (error) {
    const err = error as AuthError;
    if (err instanceof ApiError) {
      console.log("first");
    }
    return {
      error: {
        message: err?.cause?.err?.message || "Something went Wrong",
      },
    };
  }
};

export const userLoginAction = async (data: {
  email: string;
  password: string;
}) => {
  try {
    await signIn("credentials", { role: "user", ...data, redirect: false });
  } catch (error) {
    const err = error as AuthError;
    if (
      err.cause?.err instanceof ApiError &&
      err.cause?.err.statusCode == 307
    ) {
      (await cookies()).set("email", data.email);
      redirect("/change-password", RedirectType.push);
    }
    return {
      error:
        (error as AuthError)?.cause?.err?.message || "Something went Wrong",
    };
  }
  return { data: (await auth())?.user };
};
