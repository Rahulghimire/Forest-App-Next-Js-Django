"use client";

import {
  UserOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DashboardOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Button,
  Card,
  Dropdown,
  Layout,
  Menu,
  Modal,
  theme,
  Tooltip,
} from "antd";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useLogout } from "@/app/hooks/useAuth";
import { AntButton } from "@/app/components/AntButton";

const { Header, Sider, Content } = Layout;

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(true);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const logoutMutation = useLogout();

  const [data, setData] = useState<any>(null);
  useEffect(() => {
    try {
      const stored = localStorage.getItem("admin_data");
      if (stored) {
        setData(JSON.parse(stored));
      }
    } catch {
      setData(null);
    }
  }, []);

  return (
    <>
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
          <div className="p-2 text-center">
            {collapsed ? <Avatar>F</Avatar> : "Forest Management System"}
          </div>
          <Menu
            mode="inline"
            // selectedKeys={[pathname]}
            style={{ background: "rgb(237, 242, 248)", color: "#343c46" }}
            defaultSelectedKeys={["1"]}
            onClick={({ key }) => {
              if (key === "1") router.push("/admin/dashboard");
              if (key === "2") router.push("/admin/setup/users");
            }}
            items={[
              { key: "1", icon: <DashboardOutlined />, label: "Dashboard" },
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
              <Dropdown
                trigger={["click"]}
                popupRender={() => (
                  <Card className="shadow-md">
                    <div className="flex items-center gap-3">
                      <Avatar size={64}>A</Avatar>
                      <div>
                        <p className="text-lg font-medium">{data?.name}</p>
                        <p className="text-lg text-gray-500">
                          {data?.email || "john.doe@email.com"}
                        </p>
                      </div>
                    </div>

                    <div className="mt-5">
                      <Tooltip title="Logout">
                        <AntButton
                          color="lightGreen"
                          block
                          icon={<LogoutOutlined />}
                          onClick={() => {
                            setIsModalOpen(true);
                          }}
                          loading={logoutMutation.isPending}
                        >
                          Logout
                        </AntButton>
                      </Tooltip>
                    </div>
                  </Card>
                )}
              >
                <Tooltip title="Admin">
                  <Avatar>A</Avatar>
                </Tooltip>
              </Dropdown>
            </div>
          </Header>

          <Content
            style={{
              // margin: "24px 16px",
              margin: "10px",
              padding: 10,
              minHeight: 280,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            {children}
          </Content>
        </Layout>
      </Layout>

      <Modal
        title="Are you sure you want to logout?"
        open={isModalOpen}
        loading={logoutMutation.isPending}
        onOk={() => logoutMutation.mutate()}
        onCancel={() => setIsModalOpen(false)}
      />
    </>
  );
}
