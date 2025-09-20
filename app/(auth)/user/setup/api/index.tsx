import Cookies from "js-cookie";
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

export const fetchApi = async (url: string): Promise<any> => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${url}`, {
    headers: {
      Authorization: `Bearer ${Cookies.get("user_access_token")}`,
    },
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    const message =
      errorData?.message ||
      errorData?.detail ||
      JSON.stringify(errorData) ||
      "Error fetching data";
    throw new Error(message);
  }

  return res.json();
};
export const createApi = async (url: string, data: Omit<any, "id">) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${url}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${Cookies.get("user_access_token")}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    const message =
      errorData?.message ||
      errorData?.detail ||
      JSON.stringify(errorData) ||
      "Error creating data";
    throw new Error(message);
  }

  return res.json();
};

export const updateApi = async (url: string, user: any) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}${url}${user.id}/`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Cookies.get("user_access_token")}`,
      },
      body: JSON.stringify(user),
    }
  );

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    const message =
      errorData?.message ||
      errorData?.detail ||
      JSON.stringify(errorData) ||
      "Error updating user";
    throw new Error(message);
  }

  return res.json();
};

export const deleteApi = async (url: string) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${url}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${Cookies.get("user_access_token")}`,
    },
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    const message =
      errorData?.message ||
      errorData?.detail ||
      JSON.stringify(errorData) ||
      "Error deleting data";
    throw new Error(message);
  }

  return res.status === 204 ? {} : res.json();
};
