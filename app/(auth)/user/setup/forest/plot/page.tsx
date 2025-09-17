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
import { AntSelect } from "@/app/components/AntSelect";
import { AntInputNumber } from "@/app/components/AntInputNumber";

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
    { title: "Status", dataIndex: "status", key: "status" },
    { title: "Plot Name", dataIndex: "plot_name", key: "plot_name" },
    {
      title: "Area (Hectares)",
      dataIndex: "area_hectares",
      key: "area_hectares",
    },
    { title: "Location", dataIndex: "location", key: "location" },
    {
      title: "GIS Coordinates",
      dataIndex: "gis_coordinates",
      key: "gis_coordinates",
    },
    { title: "Forest Type", dataIndex: "forest_type", key: "forest_type" },
    { title: "Ownership", dataIndex: "ownership", key: "ownership" },
    {
      title: "Dominant Species",
      dataIndex: "dominant_species",
      key: "dominant_species",
    },
    { title: "Tree Density", dataIndex: "tree_density", key: "tree_density" },
    {
      title: "Avg Age (Years)",
      dataIndex: "avg_age_years",
      key: "avg_age_years",
    },
    {
      title: "Produce Types",
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
      createApi(`${process.env.NEXT_PUBLIC_API_URL}user/create/`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["plots"] });
      toast.success("Plot created");
    },
  });

  const updateMutation = useMutation({
    mutationFn: (user: any) => updateApi(`user/`, user),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["plots"] });
      toast.success("Plot updated");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteApi(`user/${id}/`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["plots"] });
      toast.success("Plot deleted");
    },
  });

  const handleFinish = (values: any) => {
    if (editingUser) {
      updateMutation.mutate({ ...editingUser, ...values });
    } else {
      createMutation.mutate(values);
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
        loading={isLoading}
        style={{ marginTop: 16 }}
        scroll={{ y: 300, x: "800px" }}
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
                name: "area_hectares",
                label: "क्षेत्रफल (हेक्टरमा)",
              }}
            />

            <AntInput
              formProps={{
                name: "location",
                label: "स्थान (जिल्ला, वडा)",
              }}
            />

            <AntInput
              formProps={{
                name: "location",
                label: "स्थान (जिल्ला, वडा)",
              }}
            />

            <AntInput
              formProps={{
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
                label: "स्वामित्व",
                name: "ownership",
              }}
            />

            <AntInput
              formProps={{
                name: "dominant_species",
                label: "प्रमुख प्रजाति",
              }}
            />

            <AntInputNumber
              formProps={{
                name: "tree_density",
                label: "प्वृक्ष घनत्व (प्रति हे.)",
              }}
            />

            <AntInputNumber
              formProps={{
                name: "avg_age_years",
                label: "औसत उमेर (वर्षमा)",
              }}
            />
          </div>

          <Divider />
        </Form>
      </Modal>
    </div>
  );
}
