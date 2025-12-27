"use server";
import { auth } from "../auth/auth";

export const getServerSession = async () => {
  return await auth();
};
