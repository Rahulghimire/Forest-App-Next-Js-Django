"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Form, Modal, Space, Table } from "antd";
import { useState } from "react";
import { AntButton } from "@/app/components/AntButton";
import {
  CloseCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  PlusCircleOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import { toast } from "react-toastify";
import { createApi, deleteApi, fetchApi, updateApi, User } from "../../api";
import { AntInput } from "@/app/components/AntInput";
import { AntSwitch } from "@/app/components/AntSwitch";
import { AntSelect } from "@/app/components/AntSelect";

export default function Classification() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewingUser, setViewingUser] = useState(false);
  const [editingUser, setEditingUser] = useState<any | null>(null);
  const [form] = Form.useForm();

  const { data: classData } = useQuery({
    queryKey: ["class-setup"],
    queryFn: () => fetchApi(`forest/class-setup/`),
  });

  const { data: plots, isLoading } = useQuery({
    queryKey: ["classifications"],
    queryFn: () => fetchApi(`forest/classifications/`),
  });

  const columns = [
    {
      title: "वर्गीकरण नाम",
      dataIndex: "classification_title",
      key: "classification_title",
    },
    { title: "विवरण", dataIndex: "description", key: "description" },
    { title: "क्षेत्रफल (हेक्टरमा)", dataIndex: "आधार", key: "आधार" },
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
            onClick={() => deleteMutation.mutate(record.classification_id)}
            icon={<DeleteOutlined />}
          ></Button>
        </Space>
      ),
    },
  ];

  const createMutation = useMutation({
    mutationFn: (data: Omit<any, "id">) =>
      createApi(`forest/classifications/`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["classifications"] });
      toast.success("Classification Title created");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const updateMutation = useMutation({
    mutationFn: (user: any) => updateApi(`forest/classifications/`, user),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["classifications"] });
      toast.success("Classification Title updated");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteApi(`forest/classifications/${id}/`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["classifications"] });
      toast.success("Classification Title deleted");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleFinish = async (values: any) => {
    if (editingUser) {
      await updateMutation.mutateAsync({
        ...editingUser,
        id: editingUser.classification_id,
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
        Add Classification Title
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
        scroll={{ y: 300, x: "1000px" }}
      />

      <Modal
        width={"70vw"}
        title={
          viewingUser
            ? "View Classification Title"
            : editingUser
            ? "Edit Classification Title"
            : "Add Classification Title"
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
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-x-2">
            {/* <AntInput
              formProps={{
                rules: [{ required: true, message: "वर्गीकरण नाम" }],
                name: "classification_title",
                label: "वर्गीकरण नाम",
              }}
            /> */}

            <AntSelect
              array={classData?.data || []}
              renderKey={"class_name"}
              valueKey={"id"}
              formProps={{
                rules: [{ required: true, message: "वर्गीकरण नाम" }],
                label: "वर्गीकरण नाम",
                name: "classification_title",
              }}
            />
            <AntInput formProps={{ name: "description", label: "विवरण" }} />
            <AntInput
              formProps={{
                rules: [{ required: true, message: "आधार" }],
                name: "basis",
                label: "आधार ",
              }}
            />

            <AntSwitch
              formProps={{
                name: "status",
                label: "स्थिति",
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
