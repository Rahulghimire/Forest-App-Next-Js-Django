"use client";

import { AntButton } from "@/components/AntButton";
import { AntInput } from "@/components/AntInput";
import { AntSelect } from "@/components/AntSelect";
import { AntSwitch } from "@/components/AntSwitch";
import {
  CloseCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  PlusCircleOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Form, Modal, Space, Table } from "antd";
import { useState } from "react";
import { toast } from "react-toastify";
import { createApi, deleteApi, fetchApi, updateApi } from "../../api";

export default function StockType() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewingUser, setViewingUser] = useState(false);
  const [editingUser, setEditingUser] = useState<any | null>(null);
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
      render: (_: any, record: any) => (
        <Space>
          <Button
            onClick={() => {
              setViewingUser(false);
              setEditingUser(record);
              form.setFieldsValue({ ...record, email: record.user_email });
              setIsModalOpen(true);
            }}
            icon={<EditOutlined />}
          />

          <Button
            onClick={() => {
              setViewingUser(true);
              form.setFieldsValue({
                ...record,
                email: record.user_email,
              });
              setIsModalOpen(true);
            }}
            icon={<EyeOutlined />}
          />

          <Button
            danger
            onClick={() => deleteMutation.mutate(record.stock_id)}
            icon={<DeleteOutlined />}
          ></Button>
        </Space>
      ),
    },
  ];

  const createMutation = useMutation({
    mutationFn: (data: Omit<any, "id">) => createApi(`forest/stocks/`, data),
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
      await updateMutation.mutateAsync({
        ...editingUser,
        id: editingUser.stock_id,
        ...values,
      });
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
        onClick={() => {
          setViewingUser(false);
          setIsModalOpen(true);
        }}
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
        title={
          viewingUser
            ? "View Stock Type"
            : editingUser
            ? "Edit Stock Type"
            : "Add Stock Type"
        }
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
          disabled={viewingUser}
        >
          <div className="gap-x-2 grid md:grid-cols-2 lg:grid-cols-4">
            <AntSelect
              array={[
                { id: "काठ", name: "काठ" },
                { id: "दाउरा", name: "दाउरा" },
                { id: "अन्य", name: "अन्य" },
              ]}
              renderKey={"name"}
              valueKey={"id"}
              formProps={{
                rules: [{ required: true, message: "स्टक प्रकार" }],
                label: "स्टक प्रकार",
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
                initialValue: "Inactive",
                getValueProps: (value: string) => ({
                  checked: value === "Active",
                }),
                getValueFromEvent: (checked: boolean) =>
                  checked ? "Active" : "Inactive",
              }}
            />
          </div>

          <div
            style={{
              display: viewingUser ? "none" : "flex",
            }}
            className="flex justify-end gap-x-3 mt-3"
          >
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

            <AntButton
              htmlType="submit"
              icon={<SaveOutlined />}
              loading={
                updateMutation.isPending ||
                createMutation.isPending ||
                deleteMutation.isPending
              }
            >
              Save
            </AntButton>
          </div>
        </Form>
      </Modal>
    </div>
  );
}
