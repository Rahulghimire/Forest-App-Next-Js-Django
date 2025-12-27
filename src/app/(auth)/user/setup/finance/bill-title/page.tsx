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

export default function BillTitle() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [viewingItem, setViewingItem] = useState(false);
  const [form] = Form.useForm();

  /* =======================
        GET BILL TITLES
     ======================= */
  const { data, isLoading } = useQuery({
    queryKey: ["bill-titles"],
    queryFn: () => fetchApi("transaction/bill-titles/"),
  });

  /* =======================
        TABLE COLUMNS
     ======================= */
  const columns = [
    {
      title: "बिल प्रकार",
      dataIndex: "bill_type",
      key: "bill_type",
    },
    {
      title: "शीर्षक",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "विवरण",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "रोयल्टी दर",
      dataIndex: "royalty_rate",
      key: "royalty_rate",
    },
    {
      title: "कर लागु",
      dataIndex: "tax_applicable",
      key: "tax_applicable",
      render: (v: boolean) => (v ? "हो" : "होइन"),
    },
    {
      title: "कर (%)",
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
            onClick={() => deleteMutation.mutate(record.bill_id)}
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
      createApi("transaction/bill-titles/", payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bill-titles"] });
      toast.success("Bill title created");
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  const updateMutation = useMutation({
    mutationFn: (payload: any) =>
      updateApi("transaction/bill-titles/", payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bill-titles"] });
      toast.success("Bill title updated");
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteApi(`transaction/bill-titles/${id}/`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bill-titles"] });
      toast.success("Bill title deleted");
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
        id: editingItem.bill_id,
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
        Add Bill Title
      </AntButton>

      <Table
        rowKey="bill_id"
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
            ? "बिल शीर्षक हेर्नुहोस्"
            : editingItem
            ? "बिल शीर्षक सम्पादन"
            : "नयाँ बिल शीर्षक"
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
            <AntSelect
              array={[
                { id: "काठ", name: "काठ" },
                { id: "दाउरा", name: "दाउरा" },
                { id: "जडीबुटी", name: "जडीबुटी" },
              ]}
              renderKey="name"
              valueKey="id"
              formProps={{
                name: "bill_type",
                label: "बिल प्रकार",
                rules: [{ required: true }],
              }}
            />

            <AntInput
              placeholder="काठ बिक्री बिल"
              formProps={{
                name: "title",
                label: "शीर्षक",
                rules: [{ required: true }],
              }}
            />

            <AntInput
              placeholder="साल र सिसौ काठ बिक्रीको लागि"
              formProps={{
                name: "description",
                label: "विवरण",
                rules: [{ required: true }],
              }}
            />

            <AntInputNumber
              formProps={{
                name: "royalty_rate",
                label: "रोयल्टी दर (प्रति एकाइ)",
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
              formProps={{
                name: "tax_rate",
                label: "कर प्रति शत (%)",
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
