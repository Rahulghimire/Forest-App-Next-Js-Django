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
import { AntInput } from "@/app/components/AntInput";
import { AntSwitch } from "@/app/components/AntSwitch";
import { AntInputNumber } from "@/app/components/AntInputNumber";
import {
  User,
  fetchApi,
  createApi,
  updateApi,
  deleteApi,
} from "../../setup/api";

export default function AdjustLog() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [form] = Form.useForm();

  const { data: plots, isLoading } = useQuery({
    queryKey: ["class"],
    queryFn: () => fetchApi(`forest/class-setup/`),
  });

  const columns = [
    { title: "वर्ग नाम", dataIndex: "class_name", key: "class_name" },
    {
      title: "न्यूनतम व्यास (इन्चमा)",
      dataIndex: "min_diameter",
      key: "min_diameter",
    },
    {
      title: "अधिकतम व्यास (इन्चमा)",
      dataIndex: "max_diameter",
      key: "max_diameter",
    },
    {
      title: "न्यूनतम लम्बाई (फिटमा)",
      dataIndex: "min_length",
      key: "min_length",
    },
    {
      title: "अधिकतम लम्बाई (फिटमा)",
      dataIndex: "max_length",
      key: "max_length",
    },
    {
      title: "मूल्य दर (प्रति घनफुट वा युनिट)",
      dataIndex: "price_rate",
      key: "price_rate",
    },
    { title: "वर्ग नाम", dataIndex: "description", key: "description" },
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
      createApi(`${process.env.NEXT_PUBLIC_API_URL}forest/class-setups/`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["class"] });
      toast.success("Class created");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const updateMutation = useMutation({
    mutationFn: (user: any) => updateApi(`forest/class-setups/`, user),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["class"] });
      toast.success("Class updated");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteApi(`forest/class-setups/${id}/`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["class"] });
      toast.success("Class deleted");
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
        Add Class
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
        title={editingUser ? "Edit Class" : "Add Class"}
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
                rules: [{ required: true, message: "वर्ग नाम" }],
                name: "class_name",
                label: "वर्ग नाम",
              }}
            />

            <AntInputNumber
              type="number"
              formProps={{
                rules: [{ required: true, message: "न्यूनतम व्यास (इन्चमा)" }],
                name: "min_diameter",
                label: "न्यूनतम व्यास (इन्चमा)",
              }}
            />

            <AntInputNumber
              type="number"
              formProps={{
                name: "max_diameter",
                label: "अधिकतम व्यास (इन्चमा)",
              }}
            />

            <AntInputNumber
              type="number"
              formProps={{
                rules: [{ required: true, message: "न्यूनतम लम्बाई (फिटमा)" }],
                name: "min_length",
                label: "न्यूनतम लम्बाई (फिटमा)",
              }}
            />

            <AntInputNumber
              type="number"
              formProps={{
                name: "max_length",
                label: "अधिकतम लम्बाई (फिटमा)",
              }}
            />

            <AntInputNumber
              type="number"
              formProps={{
                rules: [
                  {
                    required: true,
                    message: "मूल्य दर (प्रति घनफुट वा युनिट)",
                  },
                ],
                name: "price_rate",
                label: "मूल्य दर (प्रति घनफुट वा युनिट)",
              }}
            />

            <AntInput
              formProps={{
                rules: [{ required: true, message: "वर्ग नाम" }],
                name: "description",
                label: "वर्ग नाम",
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
