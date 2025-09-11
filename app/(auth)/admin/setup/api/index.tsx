
export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

export const fetchUsers = async (): Promise<User[]> => {
  const res = await fetch("/users/list/");
  if (!res.ok) throw new Error("Error fetching users");
  return res.json();
};


export const createUser = async (data: Omit<User, "id">) => {
  const res = await fetch("/api/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Error creating user");
  return res.json();
};

export const updateUser = async (user: User) => {
  const res = await fetch(`/api/users/${user.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user),
  });
  if (!res.ok) throw new Error("Error updating user");
  return res.json();
};

export const deleteUser = async (id: number) => {
  const res = await fetch(`/api/users/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Error deleting user");
  return res.json();
};

