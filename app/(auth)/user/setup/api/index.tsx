export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  user_email: string;
  phone_number: string;
}

export interface UserList {
  count: number;
  next: string | null;
  previous: string | null;
  data: User[];
}
import Cookies from "js-cookie";

export const fetchApi = async (url: string): Promise<UserList> => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${url}`, {
    headers: {
      // Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      Authorization: `Bearer  ${Cookies.get("user_access_token")}`,
    },
  });

  if (!res.ok) throw new Error("Error fetching users");
  return res.json();
};

export const createApi = async (url: string, data: Omit<User, "id">) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${url}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer  ${Cookies.get("user_access_token")}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Error creating user");
  return res.json();
};

export const updateApi = async (url: string, user: User) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}${url}${user.id}/`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer  ${Cookies.get("user_access_token")}`,
      },
      body: JSON.stringify(user),
    }
  );

  if (!res.ok) throw new Error("Error updating user");
  return res.json();
};

export const deleteApi = async (url: string) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${url}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer  ${Cookies.get("user_access_token")}`,
    },
  });

  if (!res.ok) throw new Error("Error deleting user");
  return res.json();
};
