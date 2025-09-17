"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Form, Modal, Space, Table } from "antd";
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
import { AntInput } from "@/app/components/AntInput";
import { AntSelect } from "@/app/components/AntSelect";
import { AntInputNumber } from "@/app/components/AntInputNumber";

export default function Member() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [form] = Form.useForm();

  const { data: plots, isLoading } = useQuery({
    queryKey: ["position"],
    queryFn: () => fetchApi(`user/position/`),
  });

  const columns = [
    { title: "Forest Type", dataIndex: "forest_type", key: "forest_type" },
    { title: "Ownership", dataIndex: "ownership", key: "ownership" },
    {
      title: "Dominant Species",
      dataIndex: "dominant_species",
      key: "dominant_species",
    },
    { title: "Tree Density", dataIndex: "tree_density", key: "tree_density" },
    {
      title: "Avg Age Years",
      dataIndex: "avg_age_years",
      key: "avg_age_years",
    },
    {
      title: "Product Types",
      dataIndex: "produce_types",
      key: "produce_types",
    },
    {
      title: "Protected Area",
      dataIndex: "protected_area",
      key: "protected_area",
    },
    {
      title: "Boundary Description",
      dataIndex: "boundary_description",
      key: "boundary_description",
    },
    {
      title: "Mgmt Plan Ref No",
      dataIndex: "mgmt_plan_ref_no",
      key: "mgmt_plan_ref_no",
    },
    {
      title: "Actions",
      key: "actions",
      fixed: "right" as const,
      render: (_: any, record: User) => (
        <Space>
          <Button
            onClick={() => {
              setEditingUser(record);
              form.setFieldsValue({ ...record });
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
      createApi(`${process.env.NEXT_PUBLIC_API_URL}user/position/`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["position"] });
      toast.success("Position created");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const updateMutation = useMutation({
    mutationFn: (user: any) => updateApi(`user/position/`, user),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["position"] });
      toast.success("Position updated");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteApi(`user/position/${id}/`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["position"] });
      toast.success("Position deleted");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleFinish = async (values: any) => {
    if (editingUser) {
      await updateMutation.mutateAsync({ ...editingUser, ...values });
    } else {
      await createMutation.mutateAsync(values);
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
        Add Member
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
        title={editingUser ? "Edit Plot" : "Add Plot"}
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
            <AntInput
              formProps={{
                name: "forest_type",
                label: "Forest Type",
                rules: [{ required: true, message: "Forest Type" }],
              }}
            />
            <AntInput
              formProps={{
                name: "ownership",
                label: "Ownership",
                rules: [{ required: true, message: "Ownership" }],
              }}
            />
            <AntInput
              formProps={{
                rules: [{ required: true, message: "Dominant Species" }],
                name: "dominant_species",
                label: "Dominant Species",
              }}
            />

            <AntInput
              formProps={{
                name: "tree_density",
                rules: [{ required: true, message: "Tree Density" }],
                label: "Tree Density",
              }}
            />

            <AntInputNumber
              type="number"
              formProps={{
                rules: [{ required: true, message: "Avg Age Years" }],
                name: "avg_age_years",
                label: "Avg Age Years",
              }}
            />

            <AntSelect
              array={[
                { id: "wood", name: "wood" },
                { id: "wood", name: "wood" },
                { id: "wood", name: "wood" },
              ]}
              renderKey={"name"}
              valueKey={"id"}
              formProps={{
                rules: [{ required: true, message: "Product Types" }],
                label: "Product Types",
                name: "produce_types",
              }}
            />

            <AntSelect
              array={[
                { id: "YES", name: "YES" },
                { id: "NO", name: "NO" },
              ]}
              renderKey={"name"}
              valueKey={"id"}
              formProps={{
                rules: [{ required: true, message: "Protected Area" }],
                label: "Protected Area",
                name: "protected_area",
              }}
            />

            <AntInput
              formProps={{
                rules: [{ required: true, message: "Boundary Description" }],
                name: "boundary_description",
                label: "Boundary Description",
              }}
            />

            <AntInput
              formProps={{
                rules: [{ required: true, message: "Boundary Description" }],
                name: "boundary_description",
                label: "Boundary Description",
              }}
            />

            <AntInput
              formProps={{
                rules: [{ required: true, message: "Mgmt Plan Ref No" }],
                name: "mgmt_plan_ref_no",
                label: "प्वृक्ष घनत्व (प्रति हे.)",
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

            <AntButton htmlType="submit" icon={<SaveOutlined />}>
              Save
            </AntButton>
          </div>
        </Form>
      </Modal>
    </div>
  );
}
