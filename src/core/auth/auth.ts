import { LoginResponse } from "@/lib/auth";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
        role: {},
      },
      authorize: async (credentials) => {
        if (credentials.role == "admin") {
          // login for admin
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}admin/login/`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(credentials),
            }
          );

          if (!response.ok) throw new Error(await response.json());
          const resData: LoginResponse = await response.json();
          // console.log(resData.);
          return {
            ...resData.user,
            access_token: resData.access_token,
            expires_in: resData.expires_in,
            refresh_token: resData.refresh_token,
            token_type: resData.token_type,
          };
        } else {
          // login for normal user
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

          if (!response.ok) throw new Error(await response.json());
          const resData: LoginResponse = await response.json();
          // console.log(resData.);
          return {
            ...resData.user,
            access_token: resData.access_token,
            expires_in: resData.expires_in,
            refresh_token: resData.refresh_token,
            token_type: resData.token_type,
          };
        }
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user)
        return {
          ...token,
          access_token: user.access_token,
          refresh_token: user.refresh_token,
          exp: user.expires_in,
        };
      else if (token.exp && Date.now() < token.exp * 1000) {
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
        expires: user.expires_in?.toString() || token.exp?.toString() || "0",
        user: user,
      };
    },
    signIn({ user }) {
      return !!user;
    },
  },
});

declare module "next-auth" {
  /**
   * The shape of the user object returned in the OAuth providers' `profile` callback,
   * or the second parameter of the `session` callback, when using a database.
   */
  interface User {
    access_token: string;
    expires_in: number;
    refresh_token: string;
    token_type: string;
    password_changed: boolean;
    id: string;
    email: string;
    name: string;
    role: string;
    permissions: string[];
  }
}
