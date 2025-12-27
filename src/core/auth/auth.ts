import { Env } from "@/core/constants/env";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { ApiError } from "next/dist/server/api-utils";
import { ApiUser, LoginResponseDTO } from "../types/auth.types";

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
        role: {},
      },
      authorize: async (credentials) => {
        let res: Response;
        if (credentials.role == "admin") {
          res = await fetch(`${Env.baseApiUrl}user/login/`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(credentials),
          });
        } else {
          res = await fetch(`${Env.baseApiUrl}user/login/`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(credentials),
          });
        }

        if (res.status == 307) {
          throw new ApiError(307, (await res.json()).detail);
        }
        if (!res.ok) throw new Error((await res.json()).error);
        const resData: LoginResponseDTO = await res.json();
        return {
          ...resData.user,
          access_token: resData.access_token,
          // expires_in: resData?.expires_in,
          refresh_token: resData?.refresh_token,
          token_type: resData?.token_type,
        };
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.user = user;
        token.access_token = user.access_token;
        token.refresh_token = user.refresh_token;

        return token;
      } else if (token.exp && Date.now() < token.exp * 1000) {
        return token;
      } else {
        // subsequent calls, if the access token is expired
        if (!token.refresh_token) throw new TypeError("Missing refresh token");
        try {
          // const response = await refresh(token.refresh_token);
          // TODO: implement token refresh functionality here :)
          throw new TypeError("Refresh not implemented");
        } catch (error) {
          console.error("Error refreshing access_token", error);
          token.error = "RefreshTokenError";
          return token;
        }
      }
    },
    async session({ session, token, user }) {
      return {
        ...session,
        user: {
          ...(token.user as ApiUser),
          access_token: token.access_token,
          refresh_token: token.refresh_token,
        },
      };
    },
    signIn({ user }) {
      return !!user;
    },
  },
});

declare module "next-auth" {
  interface Session {
    user: ApiUser;
    access_token: string;
    refresh_token: string;
  }
  interface User extends ApiUser {
    access_token: string;
    refresh_token: string;
    token_type: string;
  }
}
