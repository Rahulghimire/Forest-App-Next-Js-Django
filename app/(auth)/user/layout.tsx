"use client";

import {
  UserOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  AppstoreOutlined,
  FileTextOutlined,
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
            if (key === "1") router.push("/user/dashboard");
            if (key === "2") router.push("/user");
          }}
          items={[
            { key: "1", icon: <AppstoreOutlined />, label: "Dashboard" },
            {
              key: "2",
              icon: <UserOutlined />,
              label: "निलामी/निक्कली",
              children: [
                { key: "2-1", label: "सूचना/आह्वान" },
                { key: "2-2", label: "बोलपत्र दर्ता" },
                { key: "2-3", label: "मूल्याङ्कन/स्वीकृति" },
                { key: "2-4", label: "(बिलिङमा पठाउनुपर्ने) भुक्तानी" },
                { key: "2-5", label: "छूटपूर्जा जारी" },
              ],
            },
            {
              key: "3",
              icon: <AppstoreOutlined />,
              label: "बिलिङ",
              children: [
                { key: "3-1", label: "काठ बिलिङ" },
                { key: "3-2", label: "दाउरा बिलिङ" },
                { key: "3-3", label: "अन्य बिलिङ" },
                { key: "3-4", label: "भुक्तानी रसीद" },
              ],
            },
            {
              key: "4",
              icon: <AppstoreOutlined />,
              label: "घाटघारी/पाइलिङ (वन पैदावार भण्डार)",
              children: [
                { key: "4-1", label: "इकट्ठ (नाप–तौल/ग्रेडिङ)" },
                { key: "4-2", label: "वर्गीकरण/ग्रेडिङ अपडेट" },
                { key: "4-3", label: "पाइलिङ खाता" },
                { key: "4-4", label: "आन्तरिक ट्रान्सफर (प्लट/वर्ग/डिपो)" },
                { key: "4-5", label: "हास/समायोजन" },
                { key: "4-6", label: "वन पैदावार भण्डार ट्रान्सफर" },
              ],
            },
            {
              key: "5",
              icon: <AppstoreOutlined />,
              label: "दुवानी/चलानी",
              children: [
                { key: "5-1", label: "चलानी पुर्जा" },
                { key: "5-2", label: "टाँचा/नसल (सील) व्यवस्थापन" },
                { key: "5-3", label: "मार्ग–सूचना/गन्तव्य पुष्टि" },
              ],
            },

            {
              key: "6",
              icon: <AppstoreOutlined />,
              label: "दर्ता/पत्राचार",
              children: [
                { key: "6-1", label: "दर्ता" },
                { key: "6-2", label: "निर्गत पत्र/चलानी रेकर्ड" },
                { key: "6-3", label: "दर्ता–चलानी संयुक्त रजिस्टर" },
              ],
            },

            {
              key: "7",
              icon: <FileTextOutlined />,
              label: "खाता (Chart of Accounts)",
              children: [
                { key: "7-1", label: "आम्दानी खाता" },
                { key: "7-2", label: "खर्च खाता" },
                { key: "7-3", label: "सम्पत्ति खाता" },
                { key: "7-4", label: "दायित्व खाता" },
                { key: "7-5", label: "पुँजी/Equity" },
                {
                  key: "7-6",
                  label: "लेजर सेटअप",

                  children: [
                    { key: "7-6-1", label: "Ledger Groups" },
                    { key: "7-6-2", label: "Voucher Types" },
                  ],
                },
              ],
            },

            {
              key: "8",
              icon: <AppstoreOutlined />,
              label: "भौचर",
              children: [
                { key: "8-1", label: "भौचर प्रविष्टि" },
                { key: "8-2", label: "भौचर स्वीकृति/प्रिन्ट" },
              ],
            },

            {
              key: "9",
              icon: <AppstoreOutlined />,
              label: "Payroll",
              children: [
                { key: "9-1", label: "कर्मचारी तलब" },
                { key: "9-2", label: "भत्ता/कटौती" },
                { key: "9-3", label: "पेरोल रिपोर्ट" },
              ],
            },

            {
              key: "10",
              icon: <AppstoreOutlined />,
              label: "REPORTS",
              children: [
                { key: "10-1", label: "जम्मा भण्डारण रिपोर्ट" },
                { key: "10-2", label: "बाँकी भण्डारण रिपोर्ट" },
                { key: "10-3", label: "कटान रजिस्टर रिपोर्ट" },
                { key: "10-4", label: "घाटगड्डी रजिस्टर रिपोर्ट" },
                { key: "10-5", label: "पाइलिङ खाता रिपोर्ट" },
                { key: "10-6", label: "प्लट रिपोर्ट" },
                { key: "10-7", label: "ग्रेडिङ रिपोर्ट" },
                { key: "10-8", label: "काठ बिलिङ रिपोर्ट" },
                { key: "10-9", label: "दाउरा बिलिङ रिपोर्ट" },
                { key: "10-10", label: "निलामी/बोलपत्र रिपोर्ट" },
                { key: "10-11", label: "चलानी/छोिपुर्जी रिपोर्ट" },
                { key: "10-12", label: "नसल/सील ट्र्याकिङ रिपोर्ट" },
                { key: "10-13", label: "जम्मा पाइलिङ रिपोर्ट" },
              ],
            },
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
