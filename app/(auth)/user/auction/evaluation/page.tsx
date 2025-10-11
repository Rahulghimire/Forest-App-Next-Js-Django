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

export default function BidEvaluation() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any | null>(null);
  const [viewingUser, setViewingUser] = useState(false);

  const [form] = Form.useForm();

  const { data: plots, isLoading } = useQuery({
    queryKey: ["evaluation"],
    queryFn: () => fetchApi(`auction/evaluation/`),
  });

  const { data: bidData, isLoading: isLoadingBid } = useQuery({
    queryKey: ["bid-registration"],
    queryFn: () => fetchApi(`auction/registration/`),
  });

  const approveMutation = useMutation({
    mutationFn: (data: Omit<any, "id">) =>
      createApi(`auction/evaluation/`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["evaluation"] });
      toast.success("Bid / Evaluation approved");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const rejectMutation = useMutation({
    mutationFn: (data: Omit<any, "id">) =>
      createApi(`auction/evaluation/`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["evaluation"] });
      toast.success("Bid / Evaluation rejected");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const columns = [
    {
      title: "Bidder Name",
      dataIndex: ["bid", "bidder_name"],
      key: "bidder_name",
    },

    {
      title: "User",
      dataIndex: ["user", "email"],
      key: "email",
    },

    {
      title: "Remark",
      dataIndex: "remark",
      key: "remark",
    },

    {
      title: "Decision मिति",
      dataIndex: "decision_date",
      key: "decision_date",
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
                bid_id: record?.stock?.bid_id,
                decision_date: record?.decision_date
                  ? dayjs(record?.decision_date)
                  : null,
              });
              form.setFieldsValue({
                ...record,
                bid_id: record?.bid?.bid_id,
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
                bid_id: record?.bid?.bid_id,
                decision_date: record?.decision_date
                  ? dayjs(record?.decision_date)
                  : null,
              });
              setIsModalOpen(true);
            }}
            icon={<EyeOutlined />}
          />

          <Button
            onClick={() => approveMutation.mutate(record.evaluation_id)}
            icon={
              <CheckCircleFilled
                style={{
                  color: "green",
                }}
              />
            }
          >
            Approve
          </Button>

          <Button
            danger
            onClick={() => deleteMutation.mutate(record.evaluation_id)}
            icon={<CloseCircleOutlined />}
          >
            Reject
          </Button>

          {/* <Button
            danger
            onClick={() => deleteMutation.mutate(record.evaluation_id)}
            icon={<CloseCircleOutlined />}
          /> */}
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
      decision_date: values?.decision_date
        ? dayjs(values.decision_date).format("YYYY-MM-DD")
        : null,
    };
    if (editingUser) {
      await updateMutation.mutateAsync({
        ...editingUser,
        id: editingUser?.evaluation_id,
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
            ? "View Evaluation / Approval"
            : editingUser
            ? "Edit Evaluation / Approval"
            : "Add Evaluation / Approval"
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

            <Form.Item
              name={"decision_date"}
              label="Decision Date"
              rules={[{ required: true, message: "Decision Date" }]}
            >
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>

            <AntInput
              formProps={{
                rules: [{ required: true, message: "Remark" }],
                name: "remark",
                label: "Remark",
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
