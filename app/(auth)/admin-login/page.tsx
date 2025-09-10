"use client";
import { AuthForm } from "@/app/components/AuthForm";
import { useLogin } from "@/app/hooks/useAuth";
import { Card, Form } from "antd";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Login() {
  const [form] = Form.useForm();
  const router = useRouter();

  const loginMutation = useLogin();

  const handleSubmit = async (values: any) => {
    loginMutation.mutate(values);
    router.push("/admin/dashboard");
  };

  useEffect(() => {
    form.setFieldsValue({
      email: "test@gmail.com",
      password: "test123",
    });
  }, [form]);

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <Card className="w-[350px] shadow-lg rounded-xl">
        <h2 className="text-xl font-semibold mb-4 text-center">Admin Login</h2>
        <Form
          form={form}
          onFinish={handleSubmit}
          layout="vertical"
          autoComplete="off"
        >
          <AuthForm />
        </Form>
      </Card>
    </div>
  );
}
