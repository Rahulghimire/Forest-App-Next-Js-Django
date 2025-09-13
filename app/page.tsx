"use client";
import { AuthForm } from "@/app/components/AuthForm";
import { Card, Form } from "antd";
import { AntButton } from "./components/AntButton";
import { useUserLogin } from "./hooks/useAuthUser";

export default function Home() {
  const [form] = Form.useForm();

  const loginMutation = useUserLogin();

  const handleSubmit = (values: any) => {
    localStorage.setItem("user_email", values?.email);
    loginMutation.mutate(values);
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <Card className="w-[350px] shadow-lg rounded-xl">
        <h2 className="text-xl font-semibold mb-4 text-center">User Login</h2>
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
