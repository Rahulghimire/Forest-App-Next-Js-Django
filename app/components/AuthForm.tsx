import { EyeTwoTone, EyeInvisibleOutlined } from "@ant-design/icons";
import { Form, Input, Button } from "antd";
import { AntButton } from "./AntButton";

export const AuthForm = () => {
  return (
    <>
      <Form.Item
        name="email"
        label="Email"
        rules={[{ type: "email", message: "Please input your email!" }]}
      >
        <Input placeholder="Enter email" />
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
        {/* <AntButton type="primary" htmlType="submit" block>
          Submit
        </AntButton> */}
    </>
  );
};
