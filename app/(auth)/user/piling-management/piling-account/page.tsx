"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, DatePicker, Form, Modal, Space, Table } from "antd";
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
import { AntInput } from "@/app/components/AntInput";
import { fetchApi, createApi, updateApi, deleteApi } from "../../setup/api";
import { AntSelect } from "@/app/components/AntSelect";
import dayjs from "dayjs";

export default function PilingAccount() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any | null>(null);
  const [form] = Form.useForm();

  const { data: plots, isLoading } = useQuery({
    queryKey: ["pilling-accounts"],
    queryFn: () => fetchApi(`pilling/pilling-accounts/`),
  });

  const { data: pilingDepotData } = useQuery({
    queryKey: ["intakes"],
    queryFn: () => fetchApi(`pilling/depot-transfers/`),
  });

  const { data: pilingIntakeData } = useQuery({
    queryKey: ["intakes"],
    queryFn: () => fetchApi(`pilling/intakes/`),
  });

  const { data: classSetupData } = useQuery({
    queryKey: ["class-setup"],
    queryFn: () => fetchApi(`forest/class-setup/`),
  });

  const { data: speciesData } = useQuery({
    queryKey: ["class-setup"],
    queryFn: () => fetchApi(`forest/species/`),
  });

  const columns = [
    {
      title: "इन्टेक",
      dataIndex: "previous_grade",
      key: "previous_grade",
    },
    {
      title: "नयाँ वर्ग",
      dataIndex: "updated_class_id",
      key: "updated_class_id",
    },
    {
      title: "ग्रेड",
      dataIndex: "grade",
      key: "grade",
    },
    {
      title: "लम्बाई (फिट)",
      dataIndex: "length",
      key: "length",
    },
    {
      title: "गोलाई (इन्च)",
      dataIndex: "girth",
      key: "girth",
    },
    {
      title: "परिमाण (घनफिट)",
      dataIndex: "volume_cft",
      key: "volume_cft",
    },
    {
      title: "पाइल नम्बर",
      dataIndex: "pile_number",
      key: "pile_number",
    },
    {
      title: "पाइल स्थान/डेपो",
      dataIndex: "pile_location_id",
      key: "pile_location_id",
    },
    {
      title: "पाइल मिति",
      dataIndex: "pile_date",
      key: "pile_date",
    },
    {
      title: "स्थिति",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "कैफियत",
      dataIndex: "remarks",
      key: "remarks",
    },
    {
      title: "Actions",
      key: "actions",
      fixed: "right" as const,
      render: (_: any, record: any) => (
        <Space>
          <Button
            onClick={() => {
              setEditingUser(record);
              form.setFieldsValue({
                ...record,
                pile_date: record?.pile_date ? dayjs(record?.pile_date) : null,
              });
              setIsModalOpen(true);
            }}
            icon={<EditOutlined />}
          ></Button>
          <Button
            danger
            onClick={() => deleteMutation.mutate(record.pile_id)}
            icon={<DeleteOutlined />}
          ></Button>
        </Space>
      ),
    },
  ];

  const createMutation = useMutation({
    mutationFn: (data: Omit<any, "id">) =>
      createApi(
        `${process.env.NEXT_PUBLIC_API_URL}pilling/pilling-accounts/`,
        data
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pilling-accounts"] });
      toast.success("Piling Account created");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const updateMutation = useMutation({
    mutationFn: (user: any) =>
      updateApi(`pilling/pilling-accounts/`, {
        ...user,
        id: user.pile_id,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pilling-accounts"] });
      toast.success("Piling Account updated");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteApi(`pilling/pilling-accounts/${id}/`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pilling-accounts"] });
      toast.success("Piling Account deleted");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleFinish = async (values: any) => {
    const payload = {
      ...editingUser,
      ...values,
      pile_date: values?.pile_date
        ? dayjs(values.pile_date).format("YYYY-MM-DD")
        : null,
    };

    if (editingUser) {
      await updateMutation.mutateAsync({
        ...payload,
        id: editingUser.pile_id,
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
        onClick={() => setIsModalOpen(true)}
        icon={<PlusCircleOutlined />}
      >
        Add Piling Account
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
        scroll={{ y: 300, x: "1600px" }}
      />

      <Modal
        width={"70vw"}
        title={editingUser ? "Edit Piling Account" : "Add Piling Account"}
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
            <AntSelect
              array={pilingIntakeData?.data || []}
              renderKey={"name"}
              onSelect={(value, option) => {
                form.setFieldsValue({
                  species_id: option.species_id,
                  updated_class_id: option.class_id,
                  grade: option.grade,
                  length: option.length,
                  girth: option.girth,
                  volume_cft: option.volume_cft,
                });
              }}
              valueKey={"id"}
              formProps={{
                rules: [{ required: true, message: "इन्टेक" }],
                label: "इन्टेक",
                name: "previous_grade",
              }}
            />

            <AntSelect
              array={speciesData?.data || []}
              renderKey={"name"}
              valueKey={"id"}
              disabled
              formProps={{
                rules: [{ required: true, message: "प्रजाति" }],
                label: "प्रजाति",
                name: "species_id",
              }}
            />

            <AntSelect
              array={classSetupData?.data || []}
              renderKey={"name"}
              valueKey={"id"}
              disabled
              formProps={{
                rules: [{ required: true, message: "नयाँ वर्ग" }],
                label: "नयाँ वर्ग",
                name: "updated_class_id",
              }}
            />

            <AntInput
              readOnly
              formProps={{
                rules: [{ required: true, message: "ग्रेड" }],
                name: "grade",
                label: "ग्रेड",
              }}
            />

            <AntInput
              readOnly
              formProps={{
                rules: [{ required: true, message: "लम्बाई (फिट)" }],
                name: "length",
                label: "लम्बाई (फिट)",
              }}
            />

            <AntInput
              readOnly
              formProps={{
                rules: [{ required: true, message: "गोलाई (इन्च)" }],
                name: "girth",
                label: "गोलाई (इन्च)",
              }}
            />

            <AntInput
              readOnly
              formProps={{
                rules: [{ required: true, message: "परिमाण (घनफिट)" }],
                name: "volume_cft",
                label: "परिमाण (घनफिट)",
              }}
            />

            <AntInput
              formProps={{
                rules: [{ required: true, message: "पाइल नम्बर" }],
                name: "pile_number",
                label: "पाइल नम्बर",
              }}
            />

            <AntSelect
              array={pilingDepotData?.data || []}
              renderKey={"name"}
              valueKey={"id"}
              formProps={{
                rules: [{ required: true, message: "पाइल स्थान/डेपो" }],
                label: "पाइल स्थान/डेपो",
                name: "pile_location_id",
              }}
            />

            <Form.Item
              name={"pile_date"}
              label="पाइल मिति"
              initialValue={dayjs()}
              rules={[{ required: true, message: "" }]}
            >
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>

            <AntSelect
              array={[
                {
                  id: "In Stock",
                  name: "In Stock",
                },
                {
                  id: "Transferred",
                  name: "Transferred",
                },
                {
                  id: "Sold",
                  name: "Sold",
                },
                {
                  id: "Adjusted",
                  name: "Adjusted",
                },
              ]}
              renderKey={"name"}
              valueKey={"id"}
              disabled
              formProps={{
                rules: [{ required: true, message: "स्थिति" }],
                label: "स्थिति",
                name: "status",
              }}
            />

            <AntInput
              formProps={{
                rules: [
                  {
                    required: true,
                    message: "कैफियत",
                  },
                ],
                name: "remarks",
                label: "कैफियत",
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
