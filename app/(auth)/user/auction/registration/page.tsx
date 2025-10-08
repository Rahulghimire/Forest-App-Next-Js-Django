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
import {
  createApi,
  deleteApi,
  fetchApi,
  updateApi,
  User,
} from "../../setup/api";
import { AntSelect } from "@/app/components/AntSelect";
import { AntInputNumber } from "@/app/components/AntInputNumber";
import dayjs from "dayjs";

export default function Registration() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [viewingUser, setViewingUser] = useState(false);

  const [form] = Form.useForm();

  const { data: plots, isLoading } = useQuery({
    queryKey: ["auctions"],
    queryFn: () => fetchApi(`sales/auctions`),
  });

  const { data: auctionData } = useQuery({
    queryKey: ["auctions"],
    queryFn: () => fetchApi(`sales/auctions`),
  });

  const columns = [
    { title: "सूचना", dataIndex: "notice_id", key: "notice_id" },
    { title: "Bidder Name", dataIndex: "bidder_name", key: "bidder_name" },
    { title: "ठेगाना", dataIndex: "address", key: "address" },
    { title: "फोन", dataIndex: "phone", key: "phone" },
    { title: "बोलपत्र रकम", dataIndex: "bid_amount", key: "bid_amount" },
    { title: "दर्ता मिति", dataIndex: "bid_date", key: "bid_date" },
    {
      title: "स्थिति",
      dataIndex: "status",
      key: "status",
      render: (v: boolean) => (v ? "सक्रिय" : "निष्क्रिय"),
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
                bid_date: record?.bid_date ? dayjs(record?.bid_date) : null,
              });
              form.setFieldsValue({
                ...record,
                bid_date: record?.bid_date ? dayjs(record?.bid_date) : null,
              });
              setIsModalOpen(true);
            }}
            icon={<EditOutlined />}
          />
          <Button
            onClick={() => {
              setViewingUser(true);
              form.setFieldsValue({ ...record });
              setIsModalOpen(true);
            }}
            icon={<EyeOutlined />}
          />
          <Button
            danger
            onClick={() => closeMutation.mutate(record.id)}
            icon={<CheckCircleFilled />}
          >
            Approve
          </Button>
          {/* <Button
            danger
            onClick={() => closeMutation.mutate(record.id)}
            icon={<CloseCircleOutlined />}
          /> */}
        </Space>
      ),
    },
  ];

  const createMutation = useMutation({
    mutationFn: (data: Omit<any, "id">) => createApi(`sales/auctions/`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auctions"] });
      toast.success("Auction created");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const approveMutation = useMutation({
    mutationFn: (data: Omit<any, "id">) => createApi(`sales/approve/`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auctions"] });
      toast.success("Auction created");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const rejectMutation = useMutation({
    mutationFn: (data: Omit<any, "id">) => createApi(`sales/reject/`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auctions"] });
      toast.success("Auction created");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const updateMutation = useMutation({
    mutationFn: (user: any) => updateApi(`sales/auctions/`, user),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auctions"] });
      toast.success("Auction updated");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const closeMutation = useMutation({
    mutationFn: (id: number) => deleteApi(`sales/auctions/${id}/`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auctions"] });
      toast.success("Auction closed");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleFinish = async (values: any) => {
    const payload = {
      ...values,
      bid_date: values?.bid_date
        ? dayjs(values.bid_date).format("YYYY-MM-DD")
        : null,
    };
    if (editingUser) {
      await updateMutation.mutateAsync({ ...editingUser, ...payload });
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
        Add Bid Registration
      </AntButton>

      <Table
        rowKey="id"
        columns={columns || []}
        bordered
        dataSource={plots?.data || []}
        loading={
          isLoading ||
          closeMutation?.isPending ||
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
            ? "View Bid Registration"
            : editingUser
            ? "Edit Bid Registration"
            : "Add Bid Registration"
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
            <AntSelect
              array={auctionData?.data || []}
              renderKey={"stock_type"}
              valueKey={"id"}
              formProps={{
                rules: [{ required: true, message: "सूचना" }],
                label: "सूचना ",
                name: "notice_id",
              }}
            />

            <AntInput
              formProps={{
                rules: [{ required: true, message: "Bidder Name" }],
                name: "bidder_name",
                label: "Bidder Name",
              }}
            />

            <AntInput
              formProps={{
                rules: [{ required: true, message: "ठेगाना" }],
                name: "address",
                label: "ठेगाना",
              }}
            />

            <AntInputNumber
              type="number"
              formProps={{
                rules: [{ required: true, message: "फोन" }],
                name: "phone",
                label: "फोन",
              }}
            />

            <AntInputNumber
              type="number"
              formProps={{
                rules: [{ required: true, message: "बोलपत्र रकम" }],
                name: "bid_amount",
                label: "बोलपत्र रकम",
              }}
            />

            <Form.Item
              name={"bid_date"}
              label="दर्ता मिति"
              rules={[{ required: true, message: "दर्ता मिति" }]}
            >
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>

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
                closeMutation.isPending
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
