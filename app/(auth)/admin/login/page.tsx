"use client";
import { AuthForm } from "@/app/components/AuthForm";
import { Card, Form, Input } from "antd";
import { useRouter } from "next/navigation";

export default function Login() {
  const [form] = Form.useForm();
  const router = useRouter();

  const handleSubmit = (values: any) => {
    console.log(values);
    router.push("/dashboard");
  };

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
