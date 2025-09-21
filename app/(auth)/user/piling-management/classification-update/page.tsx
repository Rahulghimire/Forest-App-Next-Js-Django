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
import { fetchApi, createApi, updateApi, deleteApi } from "../../setup/api";
import { AntSelect } from "@/app/components/AntSelect";
import dayjs from "dayjs";

export default function ClassificationUpdate() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any | null>(null);
  const [form] = Form.useForm();

  const { data: plots, isLoading } = useQuery({
    queryKey: ["classification-updates"],
    queryFn: () => fetchApi(`pilling/classification-updates/`),
  });

  const { data: gradeData } = useQuery({
    queryKey: ["grade-rules"],
    queryFn: () => fetchApi(`forest/grade-rules/`),
  });

  const { data: intakeData } = useQuery({
    queryKey: ["intakes"],
    queryFn: () => fetchApi(`pilling/intakes/`),
  });

  const { data: classSetupData } = useQuery({
    queryKey: ["class-setup"],
    queryFn: () => fetchApi(`forest/class-setup/`),
  });

  const columns = [
    {
      title: "पुरानो ग्रेड",
      dataIndex: "previous_grade",
      key: "previous_grade",
    },
    {
      title: "नयाँ ग्रेड",
      dataIndex: "updated_grade",
      key: "updated_grade",
    },
    {
      title: "अपडेटको आधार",
      dataIndex: "basis_of_update",
      key: "basis_of_update",
    },
    {
      title: "कारण",
      dataIndex: "update_reason",
      key: "update_reason",
    },
    {
      title: "मिति",
      dataIndex: "updated_at",
      key: "updated_at",
    },
    {
      title: "कैफियत",
      dataIndex: "remarks",
      key: "remarks",
    },
    {
      title: "Actions",
      key: "actions",
      fixed: "right" as const,
      render: (_: any, record: any) => (
        <Space>
          <Button
            onClick={() => {
              setEditingUser(record);
              form.setFieldsValue({
                ...record,
              });
              setIsModalOpen(true);
            }}
            icon={<EditOutlined />}
          ></Button>
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
      createApi(
        `${process.env.NEXT_PUBLIC_API_URL}pilling/classification-updates/`,
        data
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["classification-updates"] });
      toast.success("Classification update created");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const updateMutation = useMutation({
    mutationFn: (user: any) =>
      updateApi(`pilling/classification-updates/`, {
        ...user,
        id: user.classification_id,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["classification-updates"] });
      toast.success("Classification update updated");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) =>
      deleteApi(`pilling/classification-updates/${id}/`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["classification-updates"] });
      toast.success("Classification update deleted");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleFinish = async (values: any) => {
    const payload = {
      ...editingUser,
      ...values,
    };

    if (editingUser) {
      await updateMutation.mutateAsync({
        ...payload,
        id: editingUser.classification_id,
      });
    } else {
      await createMutation.mutateAsync(payload);
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
        Add Classification Update
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
        scroll={{ y: 300, x: "1600px" }}
      />

      <Modal
        width={"70vw"}
        title={
          editingUser
            ? "Edit Classification Update"
            : "Add Classification Update"
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
        >
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-x-2">
            <AntSelect
              array={gradeData?.data || []}
              renderKey={"name"}
              valueKey={"id"}
              formProps={{
                rules: [{ required: true, message: "पुरानो ग्रेड" }],
                label: "पुरानो ग्रेड",
                name: "previous_grade",
              }}
            />

            <AntSelect
              array={gradeData?.data || []}
              renderKey={"name"}
              valueKey={"id"}
              formProps={{
                rules: [{ required: true, message: "नयाँ ग्रेड" }],
                label: "नयाँ ग्रेड",
                name: "updated_grade",
              }}
            />

            <AntSelect
              array={intakeData?.data || []}
              renderKey={"name"}
              valueKey={"id"}
              formProps={{
                rules: [{ required: true, message: "इन्टेक आईडी" }],
                label: "इन्टेक आईडी",
                name: "intake_id",
              }}
            />

            <AntSelect
              array={classSetupData?.data || []}
              renderKey={"name"}
              valueKey={"id"}
              formProps={{
                rules: [{ required: true, message: "पुरानो वर्ग" }],
                label: "पुरानो वर्ग",
                name: "previous_class_id",
              }}
            />

            <AntSelect
              array={classSetupData?.data || []}
              renderKey={"name"}
              valueKey={"id"}
              formProps={{
                rules: [{ required: true, message: "नयाँ वर्ग" }],
                label: "नयाँ वर्ग",
                name: "updated_class_id",
              }}
            />

            <AntInput
              formProps={{
                rules: [{ required: true, message: "आधार (नियम अनुसार)" }],
                name: "basis_of_update",
                label: "आधार (नियम अनुसार)",
              }}
            />

            <AntInput
              formProps={{
                rules: [{ required: true, message: "अपडेट गर्ने कारण" }],
                name: "update_reason",
                label: "अपडेट गर्ने कारण",
              }}
            />

            <AntInput
              formProps={{
                rules: [
                  {
                    required: true,
                    message: "कैफियत",
                  },
                ],
                name: "remarks",
                label: "कैफियत",
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
