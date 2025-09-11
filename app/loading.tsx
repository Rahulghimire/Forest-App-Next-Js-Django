import { Spin } from "antd";

export default function Loading() {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <Spin tip="Forest Management System" size="large">
        Forest Management System
      </Spin>
    </div>
  );
}
