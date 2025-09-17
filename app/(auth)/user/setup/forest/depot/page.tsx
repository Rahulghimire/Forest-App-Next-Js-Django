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

export default function Depot() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [form] = Form.useForm();

  const { data: users, isLoading } = useQuery({
    queryKey: ["depot"],
    queryFn: () => fetchApi(`forest/depot/`),
  });

  const columns = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "कोड", dataIndex: "code", key: "code" },
    { title: "स्थान", dataIndex: "location", key: "location" },
    { title: "Latitude", dataIndex: "latitude", key: "latitude" },
    { title: "Longitude", dataIndex: "longitude", key: "longitude" },
    { title: "Manager", dataIndex: "manager", key: "manager" },
    {
      title: "Contact Number",
      dataIndex: "contact_number",
      key: "contact_number",
    },
    {
      title: "Actions",
      key: "actions",
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
    mutationFn: (data: Omit<User, "id">) =>
      createApi(`${process.env.NEXT_PUBLIC_API_URL}forest/depot/`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["depot"] });
      toast.success("Depot created");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const updateMutation = useMutation({
    mutationFn: (user: User) => updateApi(`forest/depot/`, user),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["depot"] });
      toast.success("Depot updated");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteApi(`forest/depot/${id}/`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["depot"] });
      toast.success("Depot deleted");
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
        Add Depot
      </AntButton>

      <Table
        rowKey="id"
        columns={columns || []}
        bordered
        dataSource={users?.data || []}
        loading={isLoading}
        style={{ marginTop: 16 }}
        scroll={{ y: 300, x: "800px" }}
      />

      <Modal
        width={"90vw"}
        title={editingUser ? "Edit Depot" : "Add Depot"}
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
                name: "name",
                label: "Name",
                rules: [{ required: true, message: "नाम" }],
              }}
            />
            <AntInput
              formProps={{
                name: "code",
                label: "कोड",
                rules: [{ required: true, message: "कोड" }],
              }}
            />
            <AntInput
              formProps={{
                name: "location",
                label: "स्थान",
                rules: [{ required: true, message: "स्थान" }],
              }}
            />
            <AntInput
              formProps={{
                name: "latitude",
                label: "Latitude",
                rules: [{ required: true, message: "Latitude" }],
              }}
            />
            <AntInput
              formProps={{
                name: "longitude",
                label: "Longitude",
                rules: [{ required: true, message: "Longitude" }],
              }}
            />
            <AntInput
              formProps={{
                name: "manager",
                label: "Manager",
                rules: [{ required: true, message: "Manager" }],
              }}
            />
            <AntInput
              formProps={{
                name: "longitude",
                label: "Longitude",
                rules: [{ required: true, message: "Longitude" }],
              }}
            />
            <AntInput
              max={10}
              min={10}
              formProps={{
                name: "contact_number",
                label: "Contact Number",
                rules: [{ required: true, message: "Contact Number" }],
              }}
            />
          </div>

          <div className="flex justify-end gap-x-3">
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
