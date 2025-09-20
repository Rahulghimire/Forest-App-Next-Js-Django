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
import { AntSwitch } from "@/app/components/AntSwitch";

export default function Plot() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [form] = Form.useForm();

  const { data: plots, isLoading } = useQuery({
    queryKey: ["plots"],
    queryFn: () => fetchApi(`forest/plots/`),
  });

  const columns = [
    { title: "प्लट आईडी", dataIndex: "plot_id", key: "plot_id" },
    { title: "प्लट नाम", dataIndex: "plot_name", key: "plot_name" },
    {
      title: "क्षेत्रफल (हेक्टरमा)",
      dataIndex: "area_hectares",
      key: "area_hectares",
    },
    { title: "स्थान (जिल्ला, वडा)", dataIndex: "location", key: "location" },
    {
      title: "जीआईएस निर्देशाङ्क",
      dataIndex: "gis_coordinates",
      key: "gis_coordinates",
    },
    { title: "वन प्रकार", dataIndex: "forest_type", key: "forest_type" },
    { title: "स्वामित्व", dataIndex: "ownership", key: "ownership" },
    {
      title: "प्रमुख प्रजाति",
      dataIndex: "dominant_species",
      key: "dominant_species",
    },
    {
      title: "प्वृक्ष घनत्व (प्रति हे.)",
      dataIndex: "tree_density",
      key: "tree_density",
    },
    {
      title: "औसत उमेर (वर्षमा)",
      dataIndex: "avg_age_years",
      key: "avg_age_years",
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
              form.setFieldsValue({ ...record, email: record.user_email });
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
      createApi(`${process.env.NEXT_PUBLIC_API_URL}forest/plots/`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["plots"] });
      toast.success("Plot created");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const updateMutation = useMutation({
    mutationFn: (user: any) => updateApi(`forest/plots/`, user),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["plots"] });
      toast.success("Plot updated");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteApi(`forest/plots/${id}/`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["plots"] });
      toast.success("Plot deleted");
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
        Add Plot
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
            <AntInput formProps={{ name: "plot_id", label: "प्लट आईडी" }} />
            <AntInput formProps={{ name: "plot_name", label: "प्लट नाम" }} />
            <AntInput
              formProps={{
                rules: [{ required: true, message: "क्षेत्रफल (हेक्टरमा)" }],
                name: "area_hectares",
                label: "क्षेत्रफल (हेक्टरमा)",
              }}
            />

            <AntInput
              formProps={{
                name: "location",
                rules: [{ required: true, message: "स्थान (जिल्ला, वडा)" }],
                label: "स्थान (जिल्ला, वडा)",
              }}
            />

            <AntInput
              formProps={{
                rules: [{ required: true, message: "जीआईएस निर्देशाङ्क" }],
                name: "gis_coordinates",
                label: "जीआईएस निर्देशाङ्क",
              }}
            />

            <AntSelect
              array={[
                { id: "शाल", name: "शाल" },
                { id: "साल", name: "साल" },
                { id: "मिश्रित", name: "मिश्रित" },
              ]}
              renderKey={"name"}
              valueKey={"id"}
              formProps={{
                rules: [{ required: true, message: "वन प्रकार" }],
                label: "वन प्रकार",
                name: "forest_type",
              }}
            />

            <AntSelect
              array={[
                { id: "राष्ट्रिय", name: "राष्ट्रिय" },
                { id: "सामुदायिक", name: "सामुदायिक" },
              ]}
              renderKey={"name"}
              valueKey={"id"}
              formProps={{
                rules: [{ required: true, message: "स्वामित्व" }],
                label: "स्वामित्व",
                name: "ownership",
              }}
            />

            <AntInput
              formProps={{
                rules: [{ required: true, message: "प्रमुख प्रजाति" }],
                name: "dominant_species",
                label: "प्रमुख प्रजाति",
              }}
            />

            <AntInputNumber
              formProps={{
                rules: [
                  { required: true, message: "प्वृक्ष घनत्व (प्रति हे.)" },
                ],
                name: "tree_density",
                label: "प्वृक्ष घनत्व (प्रति हे.)",
              }}
            />

            <AntInputNumber
              formProps={{
                rules: [{ required: true, message: "औसत उमेर (वर्षमा)" }],
                name: "avg_age_years",
                label: "औसत उमेर (वर्षमा)",
              }}
            />

            <AntSwitch
              formProps={{
                name: "status",
                label: "स्थिति",
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
