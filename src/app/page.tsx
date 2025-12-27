"use client";
import { AuthForm } from "@/components/AuthForm";
import { userLoginAction } from "@/core/auth/auth-actions";
import { showErrorMessage, showSuccessMessage } from "@/core/lib/toast";
import { useMutation } from "@tanstack/react-query";
import { Card, Form } from "antd";
import { useRouter } from "next/navigation";
import { AntButton } from "../components/AntButton";

export default function Home() {
  const [form] = Form.useForm();
  const router = useRouter();

  const loginMutation = useMutation({
    mutationFn: userLoginAction,
    onSuccess: (data) => {
      if (data.error) return showErrorMessage(data.error);
      showSuccessMessage("Login successful!");
      console.log(data.data, "data");
      if (!data.data?.password_changed) {
        router.push("/change-password");
        return;
      }
      if (data.data.role == "admin") router.push("/admin/dashboard");
      else router.push("/user/dashboard");
    },
  });

  const handleSubmit = async (values: { email: string; password: string }) => {
    await loginMutation.mutateAsync(values);
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
