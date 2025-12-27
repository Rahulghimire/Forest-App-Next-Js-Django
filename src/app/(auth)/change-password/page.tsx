import { cookies } from "next/headers";
import ChangePassword from "./partials/change-password";

const page = async () => {
  const email = (await cookies()).get("email");
  return <ChangePassword userEmail={email?.value} />;
};

export default page;
