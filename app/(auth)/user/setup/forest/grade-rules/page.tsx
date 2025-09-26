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
import { AntSwitch } from "@/app/components/AntSwitch";

export default function Classification() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [form] = Form.useForm();

  const { data: plots, isLoading } = useQuery({
    queryKey: ["grade-rules"],
    queryFn: () => fetchApi(`forest/grade-rules/`),
  });

  const columns = [
    { title: "ग्रेड नाम", dataIndex: "grade_name", key: "grade_name" },
    { title: "कटान सीमा", dataIndex: "cutting_limit", key: "cutting_limit" },
    {
      title: "नियम विवरण",
      dataIndex: "rules_description",
      key: "rules_description",
    },
    {
      title: "दण्ड प्रावधान",
      dataIndex: "penalty_provisions",
      key: "penalty_provisions",
    },
    { title: "आधार", dataIndex: "basis", key: "basis" },
    {
      title: "स्वीकृत निकाय",
      dataIndex: "approving_authority",
      key: "approving_authority",
    },
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
      createApi(`forest/grade-rules/`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["grade-rules"] });
      toast.success("Grade Rule created");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const updateMutation = useMutation({
    mutationFn: (user: any) => updateApi(`forest/grade-rules/`, user),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["grade-rules"] });
      toast.success("Grade Rule updated");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteApi(`forest/grade-rules/${id}/`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["grade-rules"] });
      toast.success("Grade Rule deleted");
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
        Add Grade Rules
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
        title={editingUser ? "Edit Grade Rules" : "Add Grade Rules"}
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
                rules: [{ required: true, message: "ग्रेड नाम" }],
                name: "grade_name",
                label: "ग्रेड नाम",
              }}
            />
            <AntInput
              formProps={{ name: "cutting_limit", label: "कटान सीमा" }}
            />
            <AntInput
              formProps={{
                rules: [{ required: true, message: "नियम विवरण" }],
                name: "rules_description",
                label: "नियम विवरण",
              }}
            />

            <AntInput
              formProps={{
                rules: [{ required: true, message: "दण्ड प्रावधान" }],
                name: "penalty_provisions",
                label: "दण्ड प्रावधान",
              }}
            />

            <AntInput
              formProps={{
                rules: [{ required: true, message: "आधार" }],
                name: "basis",
                label: "आधार",
              }}
            />

            <AntInput
              formProps={{
                rules: [{ required: true, message: "स्वीकृत निकाय" }],
                name: "approving_authority",
                label: "स्वीकृत निकाय",
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
