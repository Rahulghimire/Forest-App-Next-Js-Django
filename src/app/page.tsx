"use client";
import { AuthForm } from "@/components/AuthForm";
import { useUserLogin } from "@/hooks/useAuthUser";
import { Card, Form } from "antd";
import { AntButton } from "../components/AntButton";

export default function Home() {
  const [form] = Form.useForm();

  const loginMutation = useUserLogin();

  const handleSubmit = (values: { email: string; password: string }) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("user_email", values?.email);
    }
    loginMutation.mutate(values);
  };

  return (
    <div className="flex justify-center items-center bg-gray-100 h-screen">
      <Card className="shadow-lg rounded-xl w-[350px]">
        <h2 className="mb-4 font-semibold text-xl text-center">User Login</h2>
        <Form
          form={form}
          onFinish={handleSubmit}
          layout="vertical"
          autoComplete="off"
        >
          <AuthForm />
          <AntButton
            type="primary"
            htmlType="submit"
            block
            loading={loginMutation.isPending}
          >
            Submit
          </AntButton>
        </Form>
      </Card>
    </div>
  );
}
