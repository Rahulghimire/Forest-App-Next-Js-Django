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

export default function Position() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [form] = Form.useForm();

  const { data: plots, isLoading } = useQuery({
    queryKey: ["position"],
    queryFn: () => fetchApi(`user/position/`),
  });

  const columns = [
    {
      title: "पदनाम",
      dataIndex: "position_name",
      key: "position_name",
    },
    {
      title: "पदको स्तर",
      dataIndex: "level",
      key: "level",
    },
    {
      title: "जिम्मेवारी विवरण",
      dataIndex: "responsibilities",
      key: "responsibilities",
    },
    {
      title: "आवश्यक योग्यता",
      dataIndex: "qualification",
      key: "qualification",
    },
    {
      title: "तलब स्केल",
      dataIndex: "salary_scale",
      key: "salary_scale",
    },
    {
      title: "विभाग",
      dataIndex: "department",
      key: "department",
    },
    {
      title: "Actions",
      key: "actions",
      fixed: "right" as const,
      render: (_: any, record: User) => (
        <Space>
          <Button
            onClick={() => {
              setEditingUser(record);
              form.setFieldsValue({ ...record });
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
    mutationFn: (data: Omit<any, "id">) => createApi(`user/position/`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["position"] });
      toast.success("Position created");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const updateMutation = useMutation({
    mutationFn: (user: any) => updateApi(`user/position/`, user),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["position"] });
      toast.success("Position updated");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteApi(`user/position/${id}/`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["position"] });
      toast.success("Position deleted");
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
        Add Position
      </AntButton>

      <Table
        rowKey="id"
        columns={columns || []}
        bordered
        dataSource={plots?.data || []}
        loading={
          isLoading ||
          deleteMutation?.isPending ||
          createMutation?.isPending ||
          updateMutation?.isPending
        }
        style={{ marginTop: 16 }}
        scroll={{ y: 300, x: "1500px" }}
      />

      <Modal
        width={"90vw"}
        title={editingUser ? "Edit Position" : "Add Position"}
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
            <AntInput
              formProps={{
                name: "position_name",
                label: "पदनाम",
                rules: [{ required: true, message: "पदनाम" }],
              }}
            />

            <AntSelect
              array={[
                { id: "Senior-level", name: "Senior-level" },
                { id: "Mid-level", name: "Mid-level" },
                { id: "Junior-level", name: "Junior-level" },
              ]}
              renderKey={"name"}
              valueKey={"id"}
              formProps={{
                rules: [{ required: true, message: "पदको स्तर" }],
                label: "पदको स्तर",
                name: "level",
              }}
            />

            <AntInput
              formProps={{
                rules: [{ required: true, message: "जिम्मेवारी विवरण" }],
                name: "responsibilities",
                label: "जिम्मेवारी विवरण",
              }}
            />

            <AntInput
              formProps={{
                rules: [{ required: true, message: "आवश्यक योग्यता" }],
                name: "qualification",
                label: "आवश्यक योग्यता",
              }}
            />

            <AntSelect
              array={[
                { id: "10000-20000", name: "10000-20000" },
                { id: "20000-30000", name: "20000-30000" },
              ]}
              renderKey={"name"}
              valueKey={"id"}
              formProps={{
                rules: [{ required: true, message: "तलब स्केल" }],
                label: "तलब स्केल",
                name: "salary_scale",
              }}
            />

            <AntInput
              formProps={{
                rules: [{ required: true, message: "विभाग" }],
                name: "department",
                label: "विभाग",
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
