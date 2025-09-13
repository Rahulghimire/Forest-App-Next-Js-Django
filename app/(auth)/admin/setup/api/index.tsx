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

export const fetchUsers = async (): Promise<UserList> => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}user/`, {
    headers: {
      Authorization: `Bearer  ${Cookies.get("admin_access_token")}`,
    },
  });
  if (!res.ok) throw new Error("Error fetching users");
  return res.json();
};

export const createUser = async (data: Omit<User, "id">) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}user/create/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      Authorization: `Bearer  ${Cookies.get("admin_access_token")}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Error creating user");
  return res.json();
};

export const updateUser = async (user: User) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}user/${user.id}/`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer  ${Cookies.get("admin_access_token")}`,
        // Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
      body: JSON.stringify(user),
    }
  );
  if (!res.ok) throw new Error("Error updating user");
  return res.json();
};

export const deleteUser = async (id: number) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}user/${id}/`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      // Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      Authorization: `Bearer  ${Cookies.get("admin_access_token")}`,
    },
  });
  if (!res.ok) throw new Error("Error deleting user");
  return res.json();
};
