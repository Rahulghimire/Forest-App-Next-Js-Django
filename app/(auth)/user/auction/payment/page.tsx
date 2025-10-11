"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Form, Modal, Space, Table } from "antd";
import { useState } from "react";
import { AntButton } from "@/app/components/AntButton";
import {
  CloseCircleOutlined,
  DollarCircleTwoTone,
  DollarOutlined,
  EyeOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import { toast } from "react-toastify";
import { createApi, deleteApi, fetchApi, updateApi } from "../../setup/api";

export default function Payment() {
  const [form] = Form.useForm();

  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any | null>(null);
  const [creatingUser, setCreatingUser] = useState<any | null>(null);
  const [viewingUser, setViewingUser] = useState(false);

  const { data: paymentData, isLoading } = useQuery({
    queryKey: ["auction-link"],
    queryFn: () => fetchApi(`auction/link/`),
  });

  const columns = [
    {
      title: "Bidder Name",
      dataIndex: ["bid", "bidder_name"],
      key: "bidder_name",
    },

    {
      title: "Notice",
      dataIndex: ["notice", "title"],
      key: "notice_title",
    },

    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
    },

    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (v: boolean) => (v ? "paid" : "unpaid "),
    },

    {
      title: "Actions",
      key: "actions",
      fixed: "right" as const,
      render: (_: any, record: any) => (
        <Space>
          <Button
            onClick={() => {
              setViewingUser(true);
              form.setFieldsValue({
                ...record,
                id: record?.payment_id,
              });
              setIsModalOpen(true);
            }}
            icon={<EyeOutlined />}
          />

          <AntButton
            color="green"
            iconPosition="end"
            loading={createMutation?.isPending}
            onClick={() => {
              setEditingUser(null);
              setCreatingUser({
                ...record,
                id: record?.payment_id,
              });
              setViewingUser(false);
              form.submit();
            }}
            icon={<DollarOutlined className="text-lg" />}
          >
            Send To Billing
          </AntButton>
        </Space>
      ),
    },
  ];

  const createMutation = useMutation({
    mutationFn: (data: Omit<any, "id">) => createApi(`auction/link/`, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["auction-link"] });
      toast.success(data?.message || "Payment created");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const updateMutation = useMutation({
    mutationFn: (user: any) => updateApi(`auction/link/`, user),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["auction-link"] });
      toast.success(data?.message || "Payment updated");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteApi(`auction/link/${id}/`),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["auction-link"] });
      toast.success(data?.message || "Payment deleted");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleFinish = async (values: any) => {
    const payload = {
      ...values,
    };
    if (editingUser) {
      await updateMutation.mutateAsync({
        ...editingUser,
        id: editingUser?.evaluation_id,
        ...payload,
      });
    } else {
      await createMutation.mutateAsync({ ...payload, ...creatingUser });
    }
    setIsModalOpen(false);
    form.resetFields();
    setEditingUser(null);
  };

  return (
    <div>
      {/* <AntButton
        type="primary"
        onClick={() => {
          setViewingUser(false);
          setIsModalOpen(true);
        }}
        icon={<PlusCircleOutlined />}
      >
        Add भुक्तानी
      </AntButton> */}

      <Table
        rowKey="id"
        columns={columns || []}
        bordered
        dataSource={paymentData?.data || []}
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
            ? "View Payment"
            : editingUser
            ? "Edit Payment"
            : "Add Payment"
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
          {/* <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-2">
            <AntSelect
              array={
                bidData?.data?.map((item: any) => {
                  return {
                    ...item,
                    bidder_name: item?.bidder_name + "-" + item?.notice?.title,
                  };
                }) || []
              }
              renderKey={"bidder_name"}
              loading={isLoadingBid}
              valueKey={"bid_id"}
              formProps={{
                rules: [{ required: true, message: "Bid" }],
                label: "Bid",
                name: "bid_id",
              }}
            />
          </div> */}

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
