import { Spin } from "antd";
import React from "react";

export default function Loading() {
  const contentStyle: React.CSSProperties = {
    padding: 50,
    background: "rgba(0, 0, 0, 0.05)",
    borderRadius: 4,
    width: "200px",
  };

  const content = <div style={contentStyle} />;

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <Spin tip="Forest Management System" size="large">
        {content}
      </Spin>
    </div>
  );
}
