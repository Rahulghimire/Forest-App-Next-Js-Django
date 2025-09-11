"use client";

import {
  UserOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  AppstoreOutlined,
} from "@ant-design/icons";
import { Avatar, Button, Layout, Menu, theme, Tooltip } from "antd";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLogout } from "@/app/hooks/useAuth";

const { Header, Sider, Content } = Layout;

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const logoutMutation = useLogout();

  return (
    <Layout>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        style={{
          backgroundColor: "rgb(237, 242, 248)",
          overflow: "auto",
          height: "100vh",
          position: "sticky",
          left: 0,
          top: 0,
          bottom: 0,
        }}
      >
        <Menu
          mode="inline"
          style={{ background: "rgb(237, 242, 248)", color: "#343c46" }}
          defaultSelectedKeys={["1"]}
          onClick={({ key }) => {
            if (key === "1") router.push("/admin/dashboard");
            if (key === "2") router.push("/admin/setup/users");
          }}
          items={[
            { key: "1", icon: <AppstoreOutlined />, label: "Dashboard" },
            { key: "2", icon: <UserOutlined />, label: "Users" },
          ]}
        />
      </Sider>

      <Layout>
        <Header
          style={{
            background: "#10a96ff1",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            paddingInlineEnd: "10px",
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
          />
          <div className="flex items-center gap-x-4">
            <Tooltip title="Admin">
              <Avatar>A</Avatar>
            </Tooltip>
            <Button
              type="primary"
              danger
              icon={<LogoutOutlined />}
              onClick={() => logoutMutation.mutate()}
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
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}
