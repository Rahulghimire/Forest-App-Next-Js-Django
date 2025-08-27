import { EyeTwoTone, EyeInvisibleOutlined } from "@ant-design/icons";
import { Form, Input, Button } from "antd";

export const AuthForm = () => {
  return (
    <>
      <Form.Item
        name="username"
        label="Username"
        rules={[{ required: true, message: "Please input your username!" }]}
      >
        <Input placeholder="Enter username" />
      </Form.Item>
      <Form.Item
        name="password"
        label="Password"
        rules={[{ required: true, message: "Please input your password!" }]}
      >
        <Input.Password
          placeholder="input password"
          iconRender={(visible) =>
            visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
          }
        />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" block>
          Submit
        </Button>
      </Form.Item>
    </>
  );
};
