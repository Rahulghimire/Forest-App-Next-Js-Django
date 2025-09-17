"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Button,
  Divider,
  Form,
  Input,
  Modal,
  Select,
  Space,
  Table,
} from "antd";
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
import { AntInputNumber } from "@/app/components/AntInputNumber";
import { AntSelect } from "@/app/components/AntSelect";
import { AntSwitch } from "@/app/components/AntSwitch";

export default function Species() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [form] = Form.useForm();

  const { data: species, isLoading } = useQuery({
    queryKey: ["species"],
    queryFn: () => fetchApi(`forest/species/`),
  });

  const columns = [
    { title: "प्लट नाम", dataIndex: "species_name", key: "species_name" },
    {
      title: "प्रजाति नाम",
      dataIndex: "species_name",
      key: "species_name_local",
    },
    {
      title: "वैज्ञानिक नाम",
      dataIndex: "scientific_name",
      key: "scientific_name",
    },
    { title: "प्रकार", dataIndex: "type", key: "type" },
    {
      title: "उत्पादन क्षमता",
      dataIndex: "production_capacity",
      key: "production_capacity",
    },
    {
      title: "संरक्षण स्थिति",
      dataIndex: "conservation_status",
      key: "conservation_status",
    },
    {
      title: "औसत वृक्ष आयु",
      dataIndex: "avg_lifespan_years",
      key: "avg_lifespan_years",
    },
    { title: "औसत उचाइ", dataIndex: "avg_height_m", key: "avg_height_m" },
    { title: "विज्ञानमूर्ति", dataIndex: "usage", key: "usage" },
    { title: "नोट्स/कैफियत", dataIndex: "notes", key: "notes" },
    { title: "स्थिति", dataIndex: "status", key: "status" },
    {
      title: "Actions",
      key: "actions",
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
      createApi(`${process.env.NEXT_PUBLIC_API_URL}forest/species/`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["species"] });
      toast.success("Species created");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const updateMutation = useMutation({
    mutationFn: (user: any) => updateApi(`forest/species/`, user),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["species"] });
      toast.success("Species updated");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteApi(`forest/species/${id}/`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["species"] });
      toast.success("Species deleted");
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
        Add Species
      </AntButton>

      <Table
        rowKey="id"
        columns={columns || []}
        bordered
        dataSource={species?.data || []}
        loading={isLoading}
        style={{ marginTop: 16 }}
        scroll={{ y: 300, x: "800px" }}
      />

      <Modal
        width={"90vw"}
        title={editingUser ? "Edit Species" : "Add Species"}
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
            <AntInput formProps={{ name: "species_name", label: "प्लट नाम" }} />
            <AntInput
              formProps={{
                name: "species_name",
                label: "प्रजाति नाम",
                rules: [{ required: true, message: "प्रजाति नाम" }],
              }}
            />

            <AntInput
              formProps={{
                name: "scientific_name",
                label: "वैज्ञानिक नाम",
                rules: [{ required: true, message: "वैज्ञानिक नाम" }],
              }}
            />

            <AntSelect
              array={[
                { id: "काठ", name: "काठ" },
                { id: "दाउरा", name: "दाउरा" },
                { id: "जडीबुटी", name: "जडीबुटी" },
                { id: "अन्य", name: "अन्य" },
              ]}
              renderKey={"name"}
              valueKey={"id"}
              formProps={{
                label: "प्रकार",
                name: "type",
                rules: [{ required: true, message: "प्रकार" }],
              }}
            />

            <AntInput
              formProps={{
                name: "production_capacity",
                label: "उत्पादन क्षमता",
                rules: [{ required: true, message: "उत्पादन क्षमता" }],
              }}
            />

            <AntInput
              formProps={{
                name: "conservation_status",
                label: "संरक्षण स्थिति",
                rules: [{ required: true, message: "संरक्षण स्थिति" }],
              }}
            />

            <AntInputNumber
              formProps={{
                name: "avg_lifespan_years",
                label: "औसत वृक्ष आयु",
                rules: [{ required: true, message: "औसत वृक्ष आयु" }],
              }}
            />

            <AntInputNumber
              formProps={{
                name: "avg_height_m",
                label: "औसत उचाइ",
                rules: [{ required: true, message: "औसत उचाइ" }],
              }}
            />

            <AntInput
              formProps={{
                name: "usage",
                label: "विज्ञानमूर्ति",
                rules: [{ required: true, message: "विज्ञानमूर्ति" }],
              }}
            />

            <AntInput
              formProps={{
                name: "notes",
                label: "नोट्स/कैफियत",
                rules: [{ required: true, message: "नोट्स/कैफियत" }],
              }}
            />

            <AntSwitch
              formProps={{
                name: "status",
                label: "स्थिति",
              }}
            />
          </div>

          <div className="flex justify-end gap-x-3">
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
