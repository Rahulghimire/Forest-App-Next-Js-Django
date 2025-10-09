"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, DatePicker, Form, Modal, Space, Table } from "antd";
import { useState } from "react";
import { AntButton } from "@/app/components/AntButton";
import {
  CloseCircleOutlined,
  EditOutlined,
  EyeOutlined,
  PlusCircleOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import { toast } from "react-toastify";
import { AntInput } from "@/app/components/AntInput";
import { AntSwitch } from "@/app/components/AntSwitch";
import dayjs from "dayjs";
import {
  createApi,
  deleteApi,
  fetchApi,
  updateApi,
  User,
} from "../../setup/api";
import { AntSelect } from "@/app/components/AntSelect";

export default function Evaluation() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any | null>(null);
  const [viewingUser, setViewingUser] = useState(false);

  const [form] = Form.useForm();

  const { data: plots, isLoading } = useQuery({
    queryKey: ["evaluation"],
    queryFn: () => fetchApi(`auction/evaluation/`),
  });

  const { data: stockData } = useQuery({
    queryKey: ["forest-stock-types"],
    queryFn: () => fetchApi(`forest/stocks/`),
  });

  const columns = [
    { title: "शीर्षक", dataIndex: "title", key: "title" },
    {
      title: "विवरण",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "प्रकाशित मिति",
      dataIndex: "publish_date",
      key: "publish_date",
    },
    {
      title: "अन्तिम मिति",
      dataIndex: "deadline_date",
      key: "deadline_date",
    },
    {
      title: "स्थान",
      dataIndex: "location",
      key: "location",
    },

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
              setEditingUser({
                ...record,
                stock_id: record?.stock?.stock_id,
                publish_date: record?.publish_date
                  ? dayjs(record?.publish_date)
                  : null,
                deadline_date: record?.deadline_date
                  ? dayjs(record?.deadline_date)
                  : null,
              });
              form.setFieldsValue({
                ...record,
                stock_id: record?.stock?.stock_id,
                publish_date: record?.publish_date
                  ? dayjs(record?.publish_date)
                  : null,
                deadline_date: record?.deadline_date
                  ? dayjs(record?.deadline_date)
                  : null,
              });
              setIsModalOpen(true);
            }}
            icon={<EditOutlined />}
          />
          <Button
            onClick={() => {
              setViewingUser(true);
              form.setFieldsValue({
                ...record,
                stock_id: record?.stock?.stock_id,
                publish_date: record?.publish_date
                  ? dayjs(record?.publish_date)
                  : null,
                deadline_date: record?.deadline_date
                  ? dayjs(record?.deadline_date)
                  : null,
              });
              setIsModalOpen(true);
            }}
            icon={<EyeOutlined />}
          />
          <Button
            danger
            onClick={() => deleteMutation.mutate(record.notice_id)}
            icon={<CloseCircleOutlined />}
          ></Button>
        </Space>
      ),
    },
  ];

  const createMutation = useMutation({
    mutationFn: (data: Omit<any, "id">) =>
      createApi(`auction/evaluation/`, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["evaluation"] });
      toast.success(data?.message || "Evaluation created");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const updateMutation = useMutation({
    mutationFn: (user: any) => updateApi(`auction/evaluation/`, user),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["evaluation"] });
      toast.success(data?.message || "Evaluation updated");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteApi(`auction/evaluation/${id}/`),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["evaluation"] });
      toast.success(data?.message || "Evaluation deleted");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleFinish = async (values: any) => {
    const payload = {
      ...values,
      publish_date: values?.publish_date
        ? dayjs(values.publish_date).format("YYYY-MM-DD")
        : null,
      deadline_date: values?.deadline_date
        ? dayjs(values.deadline_date).format("YYYY-MM-DD")
        : null,
    };
    if (editingUser) {
      await updateMutation.mutateAsync({
        ...editingUser,
        id: editingUser?.notice_id,
        ...payload,
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
        onClick={() => {
          setViewingUser(false);
          setIsModalOpen(true);
        }}
        icon={<PlusCircleOutlined />}
      >
        Add Bid Evaluation/Approval
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
            ? "View Notice"
            : editingUser
            ? "Edit Notice"
            : "Add Notice"
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
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-2">
            <AntInput
              formProps={{
                rules: [{ required: true, message: "शीर्षक" }],
                name: "title",
                label: "शीर्षक",
              }}
            />

            <AntInput
              formProps={{
                rules: [{ required: true, message: "विवरण" }],
                name: "description",
                label: "विवरण",
              }}
            />

            <AntInput
              formProps={{
                rules: [{ required: true, message: "वर्ग नाम" }],
                name: "description",
                label: "वर्ग नाम",
              }}
            />

            <Form.Item
              name={"publish_date"}
              label="प्रकाशित मिति"
              rules={[{ required: true, message: "प्रकाशित मिति" }]}
            >
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>

            <Form.Item
              name={"deadline_date"}
              label="अन्तिम मिति"
              rules={[{ required: true, message: "अन्तिम मिति" }]}
            >
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>

            <AntInput
              formProps={{
                rules: [{ required: true, message: "स्थान" }],
                name: "location",
                label: "स्थान",
              }}
            />

            <AntSelect
              array={stockData?.data || []}
              renderKey={"stock_type"}
              valueKey={"stock_id"}
              formProps={{
                rules: [{ required: true, message: "स्टक" }],
                label: "स्टक",
                name: "stock_id",
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
