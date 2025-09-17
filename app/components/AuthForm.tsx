import { EyeTwoTone, EyeInvisibleOutlined } from "@ant-design/icons";
import { Form, Input } from "antd";

export const AuthForm = () => {
  return (
    <>
      <Form.Item
        name="email"
        label="Email"
        rules={[{ type: "email", message: "Please input your email!" }]}
      >
        <Input placeholder="Enter email" autoComplete="off" />
      </Form.Item>
      <Form.Item
        name="password"
        label="Password"
        rules={[{ required: true, message: "Please input your password!" }]}
      >
        <Input.Password
          placeholder="Enter password"
          autoComplete="off"
          iconRender={(visible) =>
            visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
          }
        />
      </Form.Item>
    </>
  );
};
