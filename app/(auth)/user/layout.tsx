"use client";

import {
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  AppstoreOutlined,
  FileTextOutlined,
  AuditOutlined,
  ClusterOutlined,
  FileDoneOutlined,
  FileSearchOutlined,
  FolderOpenOutlined,
  MoneyCollectOutlined,
  SettingOutlined,
  ShopOutlined,
  SnippetsOutlined,
  SolutionOutlined,
  TeamOutlined,
  TransactionOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Button,
  Card,
  Dropdown,
  Layout,
  Menu,
  theme,
  Tooltip,
} from "antd";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AntButton } from "@/app/components/AntButton";
import { useUserLogout } from "@/app/hooks/useAuthUser";

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
  const logoutMutation = useUserLogout();

  const [data, setData] = useState<any>(null);
  useEffect(() => {
    try {
      const stored = localStorage.getItem("user_data");
      if (stored) setData(JSON.parse(stored));
    } catch {
      setData(null);
    }
  }, []);

  return (
    <Layout>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        width={300}
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
            if (key === "11-1") router.push("/user/setup/office/employee");
            if (key === "11-2") router.push("/user/setup/office/position");
            if (key === "11-3") router.push("/user/setup/office/member");
            if (key === "11-4")
              router.push("/user/setup/office/roles-permissions");
            if (key === "11-5") router.push("/user/setup/office/fiscal-year");
            if (key === "12-1") router.push("/user/setup/forest/plot");
            if (key === "12-2") router.push("/user/setup/forest/species");
            if (key === "12-3") router.push("/user/setup/forest/stock-types");
            if (key === "12-4")
              router.push("/user/setup/forest/classification");
            if (key === "12-5") router.push("/user/setup/forest/class");
            if (key === "12-6") router.push("/user/setup/forest/grade-rules");
            if (key === "12-7") router.push("/user/setup/forest/unit");
          }}
          items={items}
        />
      </Sider>

      <Layout>
        <Header
          style={{
            background: "#10a96ff1",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            paddingInlineEnd: "17px",
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
                <Card className="w-64 shadow-md">
                  <div className="flex items-center gap-3">
                    <Avatar size="large">U</Avatar>
                    <div>
                      <p className="font-medium">{data?.name}</p>
                      <p className="text-xs text-gray-500">
                        john.doe@email.com
                      </p>
                    </div>
                  </div>
                </Card>
              )}
            >
              <Tooltip title="User">
                <Avatar>U</Avatar>
              </Tooltip>
            </Dropdown>
            <AntButton
              color="lightGreen"
              icon={<LogoutOutlined />}
              onClick={() => logoutMutation.mutate()}
              loading={logoutMutation.isPending}
            />
          </div>
        </Header>

        <Content
          style={{
            margin: "10px",
            // margin: "10px 10px 0px 16px",
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
  );
}

const items = [
  { key: "1", icon: <AppstoreOutlined />, label: "Dashboard" },
  {
    key: "2",
    icon: <FileSearchOutlined />,
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
    icon: <ShopOutlined />,
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
    icon: <FolderOpenOutlined />,
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
    icon: <TransactionOutlined />,
    label: "दुवानी/चलानी",
    children: [
      { key: "5-1", label: "चलानी पुर्जा" },
      { key: "5-2", label: "टाँचा/नसल (सील) व्यवस्थापन" },
      { key: "5-3", label: "मार्ग–सूचना/गन्तव्य पुष्टि" },
    ],
  },
  {
    key: "6",
    icon: <SolutionOutlined />,
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
    icon: <SnippetsOutlined />,
    label: "भौचर",
    children: [
      { key: "8-1", label: "भौचर प्रविष्टि" },
      { key: "8-2", label: "भौचर स्वीकृति/प्रिन्ट" },
    ],
  },
  {
    key: "9",
    icon: <MoneyCollectOutlined />,
    label: "Payroll",
    children: [
      { key: "9-1", label: "कर्मचारी तलब" },
      { key: "9-2", label: "भत्ता/कटौती" },
      { key: "9-3", label: "पेरोल रिपोर्ट" },
    ],
  },
  {
    key: "10",
    icon: <FileDoneOutlined />,
    label: "Reports",
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
  {
    key: "11",
    icon: <TeamOutlined />,
    label: "कार्यालय सेटअप",
    children: [
      { key: "11-1", label: "कर्मचारी सेटअप" },
      { key: "11-2", label: "पद सेटअप" },
      { key: "11-3", label: "सदस्य/उपभोक्ता सेटअप" },
      { key: "11-4", label: "भूमिका/अनुमति (Roles & Permissions)" },
      { key: "11-5", label: "आर्थिक वर्ष सेटअप" },
    ],
  },
  {
    key: "12",
    icon: <ClusterOutlined />,
    label: "बन सेटअप",
    children: [
      { key: "12-1", label: "प्लट सेटअप" },
      { key: "12-2", label: "प्रजाति सेटअप" },
      { key: "12-3", label: "स्टक प्रकार" },
      { key: "12-4", label: "वर्गीकरण शीर्षक" },
      { key: "12-5", label: "वर्ग सेटअप" },
      { key: "12-6", label: "ग्रेड/कट्टी नियम" },
      { key: "12-7", label: "एकाई" },
    ],
  },
  {
    key: "13",
    icon: <AuditOutlined />,
    label: "कारोबार सेटअप",
    children: [
      { key: "13-1", label: "आम्दानी शीर्षक" },
      { key: "13-2", label: "बिल शीर्षक" },
      { key: "13-3", label: "बजेट शीर्षक" },
      { key: "13-4", label: "खर्च शीर्षक" },
      { key: "13-5", label: "खर्च उप–शीर्षक" },
    ],
  },
  {
    key: "14",
    icon: <SettingOutlined />,
    label: "अन्य सेटअप",
    children: [
      { key: "14-1", label: "ठेगाना शीर्षक" },
      { key: "14-2", label: "प्रिन्ट/अनुसूची टेम्प्लेट" },
      { key: "14-3", label: "क्यालेन्डर/अङ्क ढाँचा (वि.सं./नेपाली)" },
    ],
  },
];
