"use client";
import { AntButton } from "@/components/AntButton";
import { AuthForm } from "@/components/AuthForm";
import { adminLoginAction } from "@/core/auth/auth-actions";
import { useLogin } from "@/hooks/useAuth";
import { Card, Form } from "antd";
import { useEffect } from "react";

export default function Login() {
  const [form] = Form.useForm();

  const loginMutation = useLogin();

  const handleSubmit = async (values: any) => {
    try {
      adminLoginAction(values);
    } catch (e) {
      console.log(e.message, "login error");
    }
    // loginMutation.mutate(values);
    if (typeof window !== "undefined") {
      localStorage.setItem("user_email", values?.email);
    }
  };

  useEffect(() => {
    form.setFieldsValue({
      email: "test@gmail.com",
      password: "test123",
    });
  }, [form]);

  return (
    <div className="flex justify-center items-center bg-gray-100 h-screen">
      <Card className="shadow-lg rounded-xl w-[350px]">
        <h2 className="mb-4 font-semibold text-xl text-center">Admin Login</h2>
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
