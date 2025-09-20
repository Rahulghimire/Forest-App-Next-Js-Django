"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, DatePicker, Form, Modal, Space, Table } from "antd";
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
import { AntSelect } from "@/app/components/AntSelect";
import { AntInputNumber } from "@/app/components/AntInputNumber";
import { AntSwitch } from "@/app/components/AntSwitch";
import dayjs from "dayjs";

export default function FiscalYear() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [form] = Form.useForm();

  const { data: plots, isLoading } = useQuery({
    queryKey: ["fiscal_year"],
    queryFn: () => fetchApi(`finance/`),
  });

  const columns = [
    {
      title: "आर्थिक वर्ष",
      dataIndex: "fiscal_year",
      key: "fiscal_year",
    },
    {
      title: "सुरु मिति",
      dataIndex: "start_date",
      key: "start_date",
    },
    {
      title: "अन्त्य मिति",
      dataIndex: "end_date",
      key: "end_date",
    },
    {
      title: "बजेट सीमा",
      dataIndex: "budget_limit",
      key: "budget_limit",
    },
    {
      title: "स्थिति",
      dataIndex: "active",
      key: "active",
      render: (value: boolean) => (value ? "सक्रिय" : "निष्क्रिय"),
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
                start_date: record?.start_date
                  ? dayjs(record?.start_date)
                  : null,
                end_date: record?.end_date ? dayjs(record?.end_date) : null,
              });
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
      createApi(`${process.env.NEXT_PUBLIC_API_URL}finance/`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fiscal_year"] });
      toast.success("Fiscal Year created");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const updateMutation = useMutation({
    mutationFn: (user: any) => updateApi(`finance/`, user),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fiscal_year"] });
      toast.success("Fiscal Year updated");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteApi(`finance/${id}/`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fiscal_year"] });
      toast.success("Fiscal Year deleted");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleFinish = async (values: any) => {
    if (editingUser) {
      await updateMutation.mutateAsync({ ...editingUser, ...values });
    } else {
      await createMutation.mutateAsync({
        ...values,
        start_date: values.start_date ? dayjs(values.start_date) : null,
        end_date: values.end_date ? dayjs(values.end_date) : null,
      });
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
        Add Fiscal Year
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
        title={editingUser ? "Edit Fiscal Year" : "Add Fiscal Year"}
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
                { id: "2082/83", name: "2082/83" },
                { id: "2081/82", name: "2081/82" },
              ]}
              renderKey={"name"}
              valueKey={"id"}
              formProps={{
                rules: [{ required: true, message: "आर्थिक वर्ष" }],
                label: "आर्थिक वर्ष",
                name: "fiscal_year",
              }}
            />

            <Form.Item
              name={"start_date"}
              label="सुरु मिति"
              rules={[{ required: true, message: "सुरु मिति" }]}
            >
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>

            <Form.Item
              name={"end_date"}
              label="अन्त्य मिति"
              rules={[{ required: true, message: "अन्त्य मिति" }]}
            >
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>

            <AntInputNumber
              type="number"
              formProps={{
                name: "budget_limit",
                label: "बजेट सीमा",
                rules: [{ required: true, message: "बजेट सीमा" }],
              }}
            />

            <AntSwitch
              formProps={{
                initialValue: false,
                label: "स्थिति",
                name: "active",
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
