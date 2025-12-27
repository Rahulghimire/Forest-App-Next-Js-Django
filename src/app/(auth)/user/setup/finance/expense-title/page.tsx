"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Form, Modal, Space, Table } from "antd";
import { useState } from "react";

import { AntButton } from "@/components/AntButton";
import { AntInput } from "@/components/AntInput";
import { AntInputNumber } from "@/components/AntInputNumber";
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

export default function ExpenseTitle() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [viewingItem, setViewingItem] = useState(false);
  const [form] = Form.useForm();

  /* =======================
        GET EXPENSE TITLES
     ======================= */
  const { data, isLoading } = useQuery({
    queryKey: ["expense-titles"],
    queryFn: () => fetchApi("transaction/expense-titles/"),
  });

  /* =======================
        TABLE COLUMNS
     ======================= */
  const columns = [
    {
      title: "खर्च शीर्षक",
      dataIndex: "expense_title",
      key: "expense_title",
    },
    {
      title: "विवरण",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "बजेट सीमा (रु)",
      dataIndex: "budget_limit",
      key: "budget_limit",
    },
    {
      title: "कर दर (%)",
      dataIndex: "tax_rate",
      key: "tax_rate",
    },
    {
      title: "स्थिति",
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
            onClick={() => deleteMutation.mutate(record.expense_id)}
          />
        </Space>
      ),
    },
  ];

  /* =======================
        MUTATIONS
     ======================= */
  const createMutation = useMutation({
    mutationFn: (payload: any) =>
      createApi("transaction/expense-titles/", payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expense-titles"] });
      toast.success("Expense title created");
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  const updateMutation = useMutation({
    mutationFn: (payload: any) =>
      updateApi("transaction/expense-titles/", payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expense-titles"] });
      toast.success("Expense title updated");
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteApi(`transaction/expense-titles/${id}/`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expense-titles"] });
      toast.success("Expense title deleted");
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
        id: editingItem.expense_id,
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
        Add Expense Title
      </AntButton>

      <Table
        rowKey="expense_id"
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
        scroll={{ x: "1000px", y: 400 }}
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
            ? "खर्च विवरण हेर्नुहोस्"
            : editingItem
            ? "खर्च शीर्षक सम्पादन"
            : "नयाँ खर्च शीर्षक"
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
              placeholder="प्रशासनिक खर्च"
              formProps={{
                name: "expense_title",
                label: "खर्च शीर्षक",
                rules: [{ required: true }],
              }}
            />

            <AntInput
              placeholder="कर्मचारी तलब, कार्यालय सञ्चालन खर्च"
              formProps={{
                name: "description",
                label: "विवरण",
              }}
            />

            <AntInputNumber
              formProps={{
                name: "budget_limit",
                label: "बजेट सीमा (रु)",
                rules: [{ required: true }],
              }}
            />

            <AntInputNumber
              formProps={{
                name: "tax_rate",
                label: "कर दर (%)",
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
