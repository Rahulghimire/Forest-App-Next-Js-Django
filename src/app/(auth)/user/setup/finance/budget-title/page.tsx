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

export default function BudgetTitle() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [viewingItem, setViewingItem] = useState(false);
  const [form] = Form.useForm();

  /* =======================
        GET BUDGET TITLES
     ======================= */
  const { data, isLoading } = useQuery({
    queryKey: ["budget-titles"],
    queryFn: () => fetchApi("transaction/budgets/"),
  });

  /* =======================
        TABLE COLUMNS
     ======================= */
  const columns = [
    {
      title: "बजेट शीर्षक",
      dataIndex: "budget_title",
      key: "budget_title",
    },
    {
      title: "रकम सीमा (रु)",
      dataIndex: "amount_limit",
      key: "amount_limit",
    },
    {
      title: "विवरण",
      dataIndex: "description",
      key: "description",
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
            onClick={() => deleteMutation.mutate(record.budget_id)}
          />
        </Space>
      ),
    },
  ];

  /* =======================
        MUTATIONS
     ======================= */
  const createMutation = useMutation({
    mutationFn: (payload: any) => createApi("transaction/budgets/", payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["budget-titles"] });
      toast.success("Budget created");
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  const updateMutation = useMutation({
    mutationFn: (payload: any) => updateApi("transaction/budgets/", payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["budget-titles"] });
      toast.success("Budget updated");
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteApi(`transaction/budgets/${id}/`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["budget-titles"] });
      toast.success("Budget deleted");
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
        id: editingItem.budget_id,
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
        Add Budget
      </AntButton>

      <Table
        rowKey="budget_id"
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
            ? "बजेट विवरण हेर्नुहोस्"
            : editingItem
            ? "बजेट सम्पादन"
            : "नयाँ बजेट"
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
              placeholder="वन संरक्षण बजेट"
              formProps={{
                name: "budget_title",
                label: "बजेट शीर्षक",
                rules: [{ required: true }],
              }}
            />

            <AntInputNumber
              formProps={{
                name: "amount_limit",
                label: "रकम सीमा (रु)",
                rules: [{ required: true }],
              }}
            />

            <AntInput
              placeholder="2082/83"
              formProps={{
                name: "fiscal_year_id",
                label: "आर्थिक वर्ष",
                rules: [{ required: true }],
              }}
            />
            {/* 
            <AntSelect
              array={[
                { id: "2082/83", name: "2082/83" },
                { id: "2081/82", name: "2081/82" },
              ]}
              renderKey="name"
              valueKey="id"
              formProps={{
                name: "fiscal_year_id",
                label: "आर्थिक वर्ष",
                rules: [{ required: true }],
              }}
            /> */}

            <AntInput
              placeholder="वन संरक्षणका लागि वार्षिक बजेट"
              formProps={{
                name: "description",
                label: "विवरण",
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
