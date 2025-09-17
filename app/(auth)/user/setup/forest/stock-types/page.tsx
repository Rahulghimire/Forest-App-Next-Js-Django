"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Form, Modal, Space, Table } from "antd";
import { useState } from "react";
import { AntButton } from "@/app/components/AntButton";
import {
  CloseCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusCircleOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import { toast } from "react-toastify";
import { createApi, deleteApi, fetchApi, updateApi, User } from "../../api";
import { AntInput } from "@/app/components/AntInput";
import { AntSelect } from "@/app/components/AntSelect";
import { AntInputNumber } from "@/app/components/AntInputNumber";
import { AntSwitch } from "@/app/components/AntSwitch";

export default function StockType() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [form] = Form.useForm();

  const { data: stock, isLoading } = useQuery({
    queryKey: ["stocks"],
    queryFn: () => fetchApi(`forest/stocks/`),
  });

  const columns = [
    { title: "स्टक प्रकार", dataIndex: "stock_type", key: "stock_type" },
    { title: "उपप्रकार", dataIndex: "sub_type", key: "sub_type" },
    {
      title: "मापन एकाइ",
      dataIndex: "measurement_unit",
      key: "measurement_unit",
    },
    { title: "विवरण", dataIndex: "description", key: "description" },
    { title: "स्थिति", dataIndex: "status", key: "status" },
    {
      title: "Actions",
      key: "actions",
      fixed: "right" as const,
      render: (_: any, record: User) => (
        <Space>
          <Button
            onClick={() => {
              setEditingUser(record);
              form.setFieldsValue({ ...record, email: record.user_email });
              setIsModalOpen(true);
            }}
            icon={<EditOutlined />}
          ></Button>
          <Button
            danger
            onClick={() => deleteMutation.mutate(record.id)}
            icon={<DeleteOutlined />}
          ></Button>
        </Space>
      ),
    },
  ];

  const createMutation = useMutation({
    mutationFn: (data: Omit<any, "id">) =>
      createApi(`${process.env.NEXT_PUBLIC_API_URL}forest/stocks/`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stocks"] });
      toast.success("Stock Type created");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const updateMutation = useMutation({
    mutationFn: (user: any) => updateApi(`forest/stocks/`, user),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stocks"] });
      toast.success("Stock Type updated");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteApi(`forest/stocks/${id}/`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stocks"] });
      toast.success("Stock Type deleted");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleFinish = async (values: any) => {
    if (editingUser) {
      await updateMutation.mutateAsync({ ...editingUser, ...values });
    } else {
      await createMutation.mutateAsync(values);
    }
    setIsModalOpen(false);
    form.resetFields();
    setEditingUser(null);
  };

  return (
    <div>
      <AntButton
        type="primary"
        onClick={() => setIsModalOpen(true)}
        icon={<PlusCircleOutlined />}
      >
        Add Stock Type
      </AntButton>

      <Table
        rowKey="id"
        columns={columns || []}
        bordered
        dataSource={stock?.data || []}
        loading={
          isLoading ||
          deleteMutation?.isPending ||
          createMutation?.isPending ||
          updateMutation?.isPending
        }
        style={{ marginTop: 16 }}
        scroll={{ y: 300, x: "800px" }}
      />

      <Modal
        width={"90vw"}
        title={editingUser ? "Edit Stock Type" : "Add Stock Type"}
        open={isModalOpen}
        footer={null}
        onCancel={() => {
          setIsModalOpen(false);
          setEditingUser(null);
          form.resetFields();
        }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFinish}
          autoComplete="off"
        >
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-x-2">
            <AntSelect
              array={[
                { id: "काठ", name: "काठ" },
                { id: "दाउरा", name: "दाउरा" },
                { id: "अन्य", name: "अन्य" },
              ]}
              renderKey={"name"}
              valueKey={"id"}
              formProps={{
                rules: [{ required: true, message: "स्टक प्रका" }],
                label: "स्टक प्रका",
                name: "stock_type",
              }}
            />

            <AntSelect
              array={[
                { id: "पोल", name: "पोल" },
                { id: "बल्लाबल्ली", name: "बल्लाबल्ली" },
                { id: "जडीबुटी", name: "जडीबुटी" },
              ]}
              renderKey={"name"}
              valueKey={"id"}
              formProps={{
                rules: [{ required: true, message: "उपप्रकार" }],
                label: "उपप्रकार",
                name: "sub_type",
              }}
            />

            <AntSelect
              array={[
                { id: "घनफिट", name: "घनफिट" },
                { id: "किलोग्राम", name: "किलोग्राम" },
              ]}
              renderKey={"name"}
              valueKey={"id"}
              formProps={{
                rules: [{ required: true, message: "मापन एकाइ" }],
                label: "मापन एकाइ",
                name: "measurement_unit",
              }}
            />

            <AntInput
              formProps={{
                rules: [{ required: true, message: "विवरण" }],
                name: "description",
                label: "विवरण",
              }}
            />
            <AntSwitch
              formProps={{
                name: "status",
                label: "स्थिति",
              }}
            />
          </div>

          <div className="flex justify-end gap-x-3 mt-3">
            <AntButton
              color="red"
              icon={<CloseCircleOutlined />}
              onClick={() => {
                setIsModalOpen(false);
                setEditingUser(null);
                form.resetFields();
              }}
            >
              Cancel
            </AntButton>

            <AntButton htmlType="submit" icon={<SaveOutlined />}>
              Save
            </AntButton>
          </div>
        </Form>
      </Modal>
    </div>
  );
}
