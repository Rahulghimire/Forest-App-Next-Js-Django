"use client";

import {
  UserOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UploadOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import { Avatar, Button, Layout, Menu, theme, Tooltip } from "antd";
import { useLogout } from "../../../hooks/useAuth";
import { useState } from "react";

const { Header, Sider, Content } = Layout;

export default function Dashboard() {
  // const { data: user } = useCurrentUser();

  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const siderStyle = {
    overflow: "auto",
    height: "100vh",
    position: "sticky",
    left: 0,
    top: 0,
    bottom: 0,
  };

  const user = {
    name: "admin",
    email: "admin@gmail.com",
  };
  const logoutMutation = useLogout();

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <Layout>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        style={{
          backgroundColor: "rgb(237, 242, 248)",
          ...siderStyle,
        }}
      >
        <div className="demo-logo-vertical" />
        <Menu
          mode="inline"
          style={{ background: "rgb(237, 242, 248)", color: "#343c46" }}
          defaultSelectedKeys={["1"]}
          items={[
            {
              key: "1",
              icon: <UserOutlined />,
              label: "User",
            },
            // {
            //   key: "2",
            //   icon: <VideoCameraOutlined />,
            //   label: "Admin",
            // },
            // {
            //   key: "3",
            //   icon: <UploadOutlined />,
            //   label: "nav 3",
            // },
          ]}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            padding: 0,
            background: "#10a96ff1",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            boxShadow: "1px",
            paddingInlineEnd: "10px",
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: "16px",
              width: 64,
              height: 64,
            }}
          />

          <div className="flex items-center gap-x-4">
            <Tooltip title="Admin">
              <Avatar>A</Avatar>
            </Tooltip>
            <Button
              type="primary"
              danger
              icon={<LogoutOutlined />}
              onClick={handleLogout}
              loading={logoutMutation.isPending}
            >
              Logout
            </Button>
          </div>
        </Header>
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          Content
        </Content>
      </Layout>
    </Layout>
  );
}
