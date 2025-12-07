"use server";

import { auth, signIn } from "./auth";

export const adminLoginAction = async (data: {
  email: string;
  password: string;
}) => {
  await signIn("credentials", { role: "admin", ...data, redirect: false });
  return (await auth())?.user;
};

export const userLoginAction = async (data: {
  email: string;
  password: string;
}) => {
  await signIn("credentials", { role: "user", ...data, redirect: false });
  return (await auth())?.user;
};
