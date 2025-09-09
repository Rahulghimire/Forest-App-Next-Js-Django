"use client";

import { AntButton } from "@/app/components/AntButton";
import { EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";
import { Form, Input, Space, Button } from "antd";
import { useRouter } from "next/navigation";

export default function ChangePassword() {
  const router = useRouter();

  const onFinish = (values: any) => {
    console.log(values);
  };

  const [form] = Form.useForm();
  return (
    <Form layout="vertical" form={form} onFinish={onFinish} autoComplete="off">
      <Form.Item
        style={{ marginBottom: "30px" }}
        className="username"
        label="Enter old password"
        name="oldPassword"
        rules={[
          {
            required: true,
            message: "Please enter the old password.",
          },
          {
            min: 6,
            message: "Password must be at least 6 characters.",
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
        name="newPassword"
        dependencies={["oldPassword"]}
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
                return Promise.reject("Password can't exceed 20 characters.");
              } else if (value === form.getFieldValue("oldPassword")) {
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
        name="confirmNewPassword"
        dependencies={["newPassword"]}
        rules={[
          {
            required: true,
            validator: (_, value) => {
              if (!value) {
                return Promise.reject("Please re-enter the new password.");
              } else if (value.length < 6) {
                return Promise.reject(
                  "Password must be at least 6 characters."
                );
              } else if (value.length > 20) {
                return Promise.reject("Password can't exceed 20 characters.");
              } else if (value !== form.getFieldValue("newPassword")) {
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
          <AntButton htmlType="submit" loading={false}>
            Save
          </AntButton>

          <AntButton
            color="red"
            onClick={() => {
              router.push("/admin/login");
            }}
          >
            Cancel
          </AntButton>
        </Space>
      </div>
    </Form>
  );
}
