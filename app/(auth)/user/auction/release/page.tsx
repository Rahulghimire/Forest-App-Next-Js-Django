"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, DatePicker, Form, Modal, Space, Table } from "antd";
import { useState } from "react";
import { AntButton } from "@/app/components/AntButton";
import {
  CheckCircleFilled,
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

export default function Release() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any | null>(null);
  const [viewingUser, setViewingUser] = useState(false);

  const [form] = Form.useForm();

  const { data: plots, isLoading } = useQuery({
    queryKey: ["delivery"],
    queryFn: () => fetchApi(`auction/delivery/`),
  });

  const { data: paidBills, isLoading: isLoadingBid } = useQuery({
    queryKey: ["paid-bills"],
    queryFn: () => fetchApi(`auction/link/`),
  });

  const columns = [
    {
      title: "Customer Name",
      dataIndex: "customer_name",
      key: "customer_name",
    },

    {
      title: "Material Detail",
      dataIndex: "product_detail",
      key: "product_detail",
    },

    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
    },

    {
      title: "Unit",
      dataIndex: "unit",
      key: "unit",
    },

    {
      title: "Issue Date",
      dataIndex: "issue_date",
      key: "issue_date",
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
            onClick={() => {
              setViewingUser(false);
              setEditingUser({
                ...record,
                decision_date: record?.decision_date
                  ? dayjs(record?.decision_date)
                  : null,
              });
              form.setFieldsValue({
                ...record,
                decision_date: record?.decision_date
                  ? dayjs(record?.decision_date)
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
                decision_date: record?.decision_date
                  ? dayjs(record?.decision_date)
                  : null,
              });
              setIsModalOpen(true);
            }}
            icon={<EyeOutlined />}
          />
        </Space>
      ),
    },
  ];

  const createMutation = useMutation({
    mutationFn: (data: Omit<any, "id">) => createApi(`auction/delivery/`, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["delivery"] });
      toast.success(data?.message || "Release created");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const updateMutation = useMutation({
    mutationFn: (user: any) => updateApi(`auction/delivery/`, user),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["delivery"] });
      toast.success(data?.message || "Release updated");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteApi(`auction/delivery/${id}/`),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["delivery"] });
      toast.success(data?.message || "Release deleted");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleFinish = async (values: any) => {
    const payload = {
      ...values,
      decision_date: values?.decision_date
        ? dayjs(values.decision_date).format("YYYY-MM-DD")
        : null,
    };
    if (editingUser) {
      await updateMutation.mutateAsync({
        ...editingUser,
        id: editingUser?.order_id,
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
        Add छोिपुर्जी जारी
      </AntButton>

      <Table
        rowKey="id"
        columns={columns || []}
        bordered
        dataSource={plots || []}
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
            ? "View Delivery Order Issue"
            : editingUser
            ? "Edit Delivery Order Issue"
            : "Add Delivery Order Issue"
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
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-2">
            <AntSelect
              array={
                paidBills?.data?.map((item: any) => {
                  return {
                    ...item,
                  };
                }) || []
              }
              onSelect={(_, option) => {
                form.setFieldsValue({
                  ...option,
                });
              }}
              renderKey={"bidder_name"}
              loading={isLoadingBid}
              valueKey={"bid_id"}
              formProps={{
                rules: [{ required: true, message: "Bid" }],
                label: "Bid",
                name: "bid_id",
              }}
            />

            <AntInput
              formProps={{
                rules: [{ required: true, message: "Customer Name" }],
                name: "customer_name",
                label: "Customer Name",
              }}
              readOnly
            />

            <AntInput
              formProps={{
                rules: [{ required: true, message: "Material Detail" }],
                name: "product_detail",
                label: "Material Detail",
              }}
              readOnly
            />

            <AntInput
              formProps={{
                rules: [{ required: true, message: "Quantity" }],
                name: "quantity",
                label: "Quantity",
              }}
              readOnly
            />

            <AntInput
              formProps={{
                rules: [{ required: true, message: "Unit" }],
                name: "unit",
                label: "Unit",
              }}
              readOnly
            />

            <Form.Item
              name={"issue_date"}
              label="Issue Date"
              rules={[{ required: true, message: "Issue Date" }]}
            >
              <DatePicker style={{ width: "100%" }} readOnly />
            </Form.Item>

            <AntInput
              readOnly
              formProps={{
                rules: [{ required: true, message: "Status" }],
                name: "status",
                label: "Status",
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
