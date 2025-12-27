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

export default function ExpenseSubTitle() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [viewingItem, setViewingItem] = useState(false);
  const [form] = Form.useForm();

  /* =======================
        GET MAIN TITLES
     ======================= */
  const { data: mainTitles } = useQuery({
    queryKey: ["expense-titles"],
    queryFn: () => fetchApi("transaction/expense-titles/"),
  });

  /* =======================
        GET SUB TITLES
     ======================= */
  const { data, isLoading } = useQuery({
    queryKey: ["expense-subtitles"],
    queryFn: () => fetchApi("transaction/expense-subtitles/"),
  });

  /* =======================
        TABLE COLUMNS
     ======================= */
  const columns = [
    {
      title: "उप–शीर्षक",
      dataIndex: "sub_title_name",
      key: "sub_title_name",
    },
    {
      title: "मुख्य शीर्षक",
      dataIndex: ["main_title", "expense_title"],
      key: "main_title",
      render: (_: any, record: any) => record.main_title?.expense_title || "-",
    },
    {
      title: "विवरण",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "सीमा (रु)",
      dataIndex: "limit",
      key: "limit",
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
              form.setFieldsValue({
                ...record,
                main_title_id: record.main_title?.expense_id,
              });
              setIsModalOpen(true);
            }}
          />

          <Button
            icon={<EyeOutlined />}
            onClick={() => {
              setViewingItem(true);
              setEditingItem(null);
              form.setFieldsValue({
                ...record,
                main_title_id: record.main_title?.expense_id,
              });
              setIsModalOpen(true);
            }}
          />

          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={() => deleteMutation.mutate(record.expenseSubtitle_id)}
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
      createApi("transaction/expense-subtitles/", payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expense-subtitles"] });
      toast.success("Expense sub-title created");
    },
  });

  const updateMutation = useMutation({
    mutationFn: (payload: any) =>
      updateApi("transaction/expense-subtitles/", payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expense-subtitles"] });
      toast.success("Expense sub-title updated");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      deleteApi(`transaction/expense-subtitles/${id}/`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expense-subtitles"] });
      toast.success("Expense sub-title deleted");
    },
  });

  /* =======================
        FORM SUBMIT
     ======================= */
  const handleFinish = async (values: any) => {
    const payload = {
      ...values,
      main_title_id: values.main_title_id || null,
    };

    if (editingItem) {
      await updateMutation.mutateAsync({
        ...editingItem,
        ...payload,
        id: editingItem.expenseSubtitle_id,
      });
    } else {
      await createMutation.mutateAsync(payload);
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
        Add Expense Sub-Title
      </AntButton>

      <Table
        rowKey="expenseSubtitle_id"
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
        scroll={{ x: "1100px", y: 400 }}
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
            ? "खर्च उप–शीर्षक विवरण"
            : editingItem
            ? "खर्च उप–शीर्षक सम्पादन"
            : "नयाँ खर्च उप–शीर्षक"
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
              placeholder="कर्मचारी तलब"
              formProps={{
                name: "sub_title_name",
                label: "उप–शीर्षक नाम",
                rules: [{ required: true }],
              }}
            />

            <AntSelect
              array={mainTitles?.data || []}
              renderKey="expense_title"
              valueKey="expense_id"
              formProps={{
                name: "main_title_id",
                label: "मुख्य शीर्षक",
                rules: [{ required: true }],
              }}
            />

            <AntInput
              placeholder="मासिक कर्मचारी तलब खर्च"
              formProps={{
                name: "description",
                label: "विवरण",
              }}
            />

            <AntInputNumber
              formProps={{
                name: "limit",
                label: "सीमा (रु)",
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
