"use client";

import { AntButton } from "@/app/components/AntButton";
import { useUserChangePassword } from "@/app/hooks/useAuthUser";
import {
  EyeOutlined,
  EyeInvisibleOutlined,
  SaveOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import { Form, Input, Space, Card } from "antd";
import { useRouter } from "next/navigation";

export default function ChangePassword() {
  const router = useRouter();

  const changePasswordMutation = useUserChangePassword();

  const onFinish = (values: any) => {
    const email =
      typeof window !== "undefined" ? localStorage.getItem("user_email") : "";
    changePasswordMutation.mutate({
      ...values,
      email,
    });
  };

  const [form] = Form.useForm();

  return (
    <>
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <Card className="w-[350px] shadow-lg rounded-xl">
          <h2 className="text-xl font-semibold mb-4 text-center">
            Change Password
          </h2>
          <Form
            layout="vertical"
            form={form}
            onFinish={onFinish}
            autoComplete="off"
          >
            <Form.Item
              style={{ marginBottom: "30px" }}
              className="username"
              label="Enter old password"
              name="old_password"
              rules={[
                {
                  required: true,
                  message: "Please enter the old password.",
                },
                {
                  min: 5,
                  message: "Password must be at least 5 characters.",
                },
                {
                  max: 20,
                  message: "Password can't exceed 20 characters.",
                },
              ]}
            >
              <Input.Password type="password" />
            </Form.Item>

            <Form.Item
              className="username"
              label="Enter new password"
              name="new_password"
              dependencies={["old_password"]}
              rules={[
                {
                  required: true,
                  validator: (_, value) => {
                    if (!value) {
                      return Promise.reject("Please enter the new password.");
                    } else if (value.length < 6) {
                      return Promise.reject(
                        "Password must be at least 6 characters."
                      );
                    } else if (value.length > 20) {
                      return Promise.reject(
                        "Password can't exceed 20 characters."
                      );
                    } else if (value === form.getFieldValue("old_password")) {
                      return Promise.reject(
                        "New password must be different from old password."
                      );
                    }
                    return Promise.resolve();
                  },
                },
              ]}
            >
              <Input.Password
                type="password"
                iconRender={(visible) =>
                  visible ? <EyeOutlined /> : <EyeInvisibleOutlined />
                }
              />
            </Form.Item>

            <Form.Item
              className="username"
              label="Re-enter new password"
              name="confirm_password"
              dependencies={["new_password"]}
              rules={[
                {
                  required: true,
                  validator: (_, value) => {
                    if (!value) {
                      return Promise.reject(
                        "Please re-enter the new password."
                      );
                    } else if (value.length < 6) {
                      return Promise.reject(
                        "Password must be at least 6 characters."
                      );
                    } else if (value.length > 20) {
                      return Promise.reject(
                        "Password can't exceed 20 characters."
                      );
                    } else if (value !== form.getFieldValue("new_password")) {
                      return Promise.reject("The passwords do not match.");
                    }
                    return Promise.resolve();
                  },
                },
              ]}
            >
              <Input.Password type="password" />
            </Form.Item>

            <div style={{ textAlign: "right" }}>
              <Space size="large">
                <AntButton
                  color="red"
                  icon={<CloseCircleOutlined />}
                  onClick={() => {
                    router.push("/");
                  }}
                >
                  Cancel
                </AntButton>
                <AntButton
                  htmlType="submit"
                  loading={changePasswordMutation?.isPending}
                  icon={<SaveOutlined />}
                >
                  Save
                </AntButton>
              </Space>
            </div>
          </Form>
        </Card>
      </div>
    </>
  );
}
