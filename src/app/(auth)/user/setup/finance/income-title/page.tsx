"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Form, Modal, Space, Table } from "antd";
import { useState } from "react";

import { AntButton } from "@/components/AntButton";
import { AntInput } from "@/components/AntInput";
import { AntInputNumber } from "@/components/AntInputNumber";
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

import { toast } from "react-toastify";
import { createApi, deleteApi, fetchApi, updateApi } from "../../api";

export default function IncomeTitle() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [viewingItem, setViewingItem] = useState(false);
  const [form] = Form.useForm();

  /* =======================
        GET INCOMES
     ======================= */
  const { data, isLoading } = useQuery({
    queryKey: ["income-titles"],
    queryFn: () => fetchApi("transaction/incomes/"),
  });

  /* =======================
        TABLE COLUMNS
     ======================= */
  const columns = [
    {
      title: "Income Title",
      dataIndex: "income_title",
      key: "income_title",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Rate",
      dataIndex: "rate",
      key: "rate",
    },
    {
      title: "Tax Applicable",
      dataIndex: "tax_applicable",
      key: "tax_applicable",
      render: (v: boolean) => (v ? "Yes" : "No"),
    },
    {
      title: "Tax Rate (%)",
      dataIndex: "tax_rate",
      key: "tax_rate",
    },
    {
      title: "Account Type",
      dataIndex: "account_type",
      key: "account_type",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Actions",
      key: "actions",
      fixed: "right" as const,
      render: (_: any, record: any) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            onClick={() => {
              setViewingItem(false);
              setEditingItem(record);
              form.setFieldsValue(record);
              setIsModalOpen(true);
            }}
          />

          <Button
            icon={<EyeOutlined />}
            onClick={() => {
              setViewingItem(true);
              setEditingItem(null);
              form.setFieldsValue(record);
              setIsModalOpen(true);
            }}
          />

          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={() => deleteMutation.mutate(record.income_id)}
          />
        </Space>
      ),
    },
  ];

  /* =======================
        MUTATIONS
     ======================= */
  const createMutation = useMutation({
    mutationFn: (payload: any) => createApi("transaction/incomes/", payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["income-titles"] });
      toast.success("Income title created");
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  const updateMutation = useMutation({
    mutationFn: (payload: any) => updateApi("transaction/incomes/", payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["income-titles"] });
      toast.success("Income title updated");
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteApi(`transaction/incomes/${id}/`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["income-titles"] });
      toast.success("Income title deleted");
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  /* =======================
        FORM SUBMIT
     ======================= */
  const handleFinish = async (values: any) => {
    if (editingItem) {
      await updateMutation.mutateAsync({
        ...editingItem,
        ...values,
        id: editingItem.income_id,
      });
    } else {
      await createMutation.mutateAsync(values);
    }

    setIsModalOpen(false);
    setEditingItem(null);
    form.resetFields();
  };

  return (
    <div>
      <AntButton
        type="primary"
        icon={<PlusCircleOutlined />}
        onClick={() => {
          setViewingItem(false);
          setEditingItem(null);
          setIsModalOpen(true);
        }}
      >
        Add Income Title
      </AntButton>

      <Table
        rowKey="income_id"
        bordered
        style={{ marginTop: 16 }}
        loading={
          isLoading ||
          createMutation.isPending ||
          updateMutation.isPending ||
          deleteMutation.isPending
        }
        dataSource={data?.data || []}
        columns={columns}
        scroll={{ x: "1200px", y: 400 }}
      />

      {/* =======================
            MODAL
         ======================= */}
      <Modal
        open={isModalOpen}
        width="70vw"
        footer={null}
        title={
          viewingItem
            ? "View Income Title"
            : editingItem
            ? "Edit Income Title"
            : "Add Income Title"
        }
        onCancel={() => {
          setIsModalOpen(false);
          setEditingItem(null);
          form.resetFields();
        }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFinish}
          disabled={viewingItem}
        >
          <div className="gap-x-3 grid md:grid-cols-2 lg:grid-cols-3">
            <AntInput
              placeholder="काठ बिक्री"
              formProps={{
                name: "income_title",
                label: "आम्दानी शीर्षक",
                rules: [{ required: true }],
              }}
            />

            <AntInput
              placeholder="साल र सि सौ काठ बि क्रीबाट प्राप्त आम्दानी"
              formProps={{
                name: "description",
                label: "विवरण",
                rules: [{ required: true }],
              }}
            />

            <AntInputNumber
              formProps={{
                name: "rate",
                label: "दर (Rate)",
                rules: [{ required: true }],
              }}
            />

            <AntSwitch
              formProps={{
                name: "tax_applicable",
                label: "कर लागूहुने/नहुने",
                initialValue: false,
              }}
            />

            <AntInputNumber
              type="number"
              formProps={{
                name: "tax_rate",
                label: "कर प्रति शत (VAT, excise आदि )",
              }}
            />

            <AntSelect
              array={[
                { id: "royalty", name: "Royalty" },
                { id: "कोष", name: "कोष" },
                { id: "कटान", name: "कटान" },
              ]}
              renderKey="name"
              valueKey="id"
              formProps={{
                name: "account_type",
                label: "खाताको प्रकार",
                rules: [{ required: true }],
              }}
            />

            <AntSwitch
              formProps={{
                name: "status",
                label: "स्थिति",
                initialValue: "Active",
                getValueProps: (value: string) => ({
                  checked: value === "Active",
                }),
                getValueFromEvent: (checked: boolean) =>
                  checked ? "Active" : "Inactive",
              }}
            />
          </div>

          {!viewingItem && (
            <div className="flex justify-end gap-x-3 mt-4">
              <AntButton
                color="red"
                icon={<CloseCircleOutlined />}
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingItem(null);
                  form.resetFields();
                }}
              >
                Cancel
              </AntButton>

              <AntButton
                htmlType="submit"
                icon={<SaveOutlined />}
                loading={createMutation.isPending || updateMutation.isPending}
              >
                Save
              </AntButton>
            </div>
          )}
        </Form>
      </Modal>
    </div>
  );
}
