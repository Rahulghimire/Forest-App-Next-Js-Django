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

export default function Adjustment() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any | null>(null);
  const [form] = Form.useForm();

  const { data: plots, isLoading } = useQuery({
    queryKey: ["piling-adjustments"],
    queryFn: () => fetchApi(`pilling/adjustments/`),
  });

  const { data: pilingAccountsData } = useQuery({
    queryKey: ["pilling-adjustments"],
    queryFn: () => fetchApi(`pilling/adjustments/`),
  });

  const { data: pilingDepotData } = useQuery({
    queryKey: ["intakes"],
    queryFn: () => fetchApi(`pilling/depot-transfers/`),
  });

  const { data: speciesData } = useQuery({
    queryKey: ["species"],
    queryFn: () => fetchApi(`forest/species/`),
  });

  const { data: pilingIntakeData } = useQuery({
    queryKey: ["intakes"],
    queryFn: () => fetchApi(`pilling/intakes/`),
  });

  const { data: classSetupData } = useQuery({
    queryKey: ["class-setup"],
    queryFn: () => fetchApi(`forest/class-setup/`),
  });

  const { data: depotData } = useQuery({
    queryKey: ["depot"],
    queryFn: () => fetchApi(`forest/depot/`),
  });

  const columns = [
    {
      title: "पाइल आईडी",
      dataIndex: "pile_id",
      key: "pile_id",
    },
    {
      title: "प्रजाति",
      dataIndex: "species_id",
      key: "species_id",
    },
    {
      title: "वर्ग",
      dataIndex: "class_id",
      key: "class_id",
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
      title: "पुरानो स्थान/डेपो",
      dataIndex: "from_location_id",
      key: "from_location_id",
    },
    {
      title: "नयाँ स्थान/डेपो",
      dataIndex: "to_location_id",
      key: "to_location_id",
    },
    {
      title: "पाइल मिति",
      dataIndex: "transfer_date",
      key: "transfer_date",
    },
    {
      title: "कारण",
      dataIndex: "reason",
      key: "reason",
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
                transfer_date: record?.transfer_date
                  ? dayjs(record?.transfer_date)
                  : null,
              });
              setIsModalOpen(true);
            }}
            icon={<EditOutlined />}
          ></Button>
          <Button
            danger
            onClick={() => deleteMutation.mutate(record.adjustment_id)}
            icon={<DeleteOutlined />}
          ></Button>
        </Space>
      ),
    },
  ];

  const createMutation = useMutation({
    mutationFn: (data: Omit<any, "id">) =>
      createApi(`${process.env.NEXT_PUBLIC_API_URL}pilling/adjustments/`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["piling-adjustments"] });
      toast.success("Adjustment created");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const updateMutation = useMutation({
    mutationFn: (user: any) =>
      updateApi(`pilling/adjustments/`, {
        ...user,
        id: user.adjustment_id,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["piling-adjustments"] });
      toast.success("Adjustment updated");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteApi(`pilling/adjustments/${id}/`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["piling-adjustments"] });
      toast.success("Adjustment deleted");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleFinish = async (values: any) => {
    const payload = {
      ...editingUser,
      ...values,
      transfer_date: values?.transfer_date
        ? dayjs(values.transfer_date).format("YYYY-MM-DD")
        : null,
    };

    if (editingUser) {
      await updateMutation.mutateAsync({
        ...payload,
        id: editingUser.adjustment_id,
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
        Add Internal Transfer
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
        title={editingUser ? "Edit Internal Transfer" : "Add Internal Transfer"}
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
              array={pilingAccountsData?.data || []}
              renderKey={"name"}
              onSelect={(_, option) => {
                form.setFieldsValue({
                  intake_id: option.intake_id,
                  species_id: option.species_id,
                  class_id: option.class_id,
                  grade: option.grade,
                  length: option.length,
                  girth: option.girth,
                  prev_volume_cft: option.volume_cft,
                });
              }}
              valueKey={"id"}
              formProps={{
                rules: [{ required: true, message: "पाइल आईडी" }],
                label: "पाइल आईडी",
                name: "pile_id",
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
                name: "species_id ",
              }}
            />
            <AntSelect
              array={classSetupData?.data || []}
              renderKey={"name"}
              valueKey={"id"}
              disabled
              formProps={{
                rules: [{ required: true, message: "वर्ग" }],
                label: "वर्ग",
                name: "class_id",
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
              type="number"
              formProps={{
                rules: [{ required: true, message: "लम्बाई (फिट)" }],
                name: "length",
                label: "लम्बाई (फिट)",
              }}
            />
            <AntInput
              readOnly
              type="number"
              formProps={{
                rules: [{ required: true, message: "गोलाई (इन्च)" }],
                name: "girth",
                label: "गोलाई (इन्च)",
              }}
            />
            <AntInput
              readOnly
              type="number"
              formProps={{
                rules: [{ required: true, message: "परिमाण (घनफिट)" }],
                name: "prev_volume_cft",
                label: "परिमाण (घनफिट)",
              }}
            />

            <AntSelect
              array={depotData?.data || []}
              renderKey={"name"}
              valueKey={"id"}
              disabled
              formProps={{
                rules: [{ required: true, message: "पुरानो स्थान/डेपो" }],
                label: "पुरानो स्थान/डेपो",
                name: "from_location_id",
              }}
            />

            <AntSelect
              array={depotData?.data || []}
              renderKey={"name"}
              valueKey={"id"}
              disabled
              formProps={{
                rules: [{ required: true, message: "नयाँ स्थान/डेपो" }],
                label: "नयाँ स्थान/डेपो",
                name: "to_location_id",
              }}
            />

            <Form.Item
              name={"transfer_date"}
              label="पाइल मिति"
              initialValue={dayjs()}
              rules={[{ required: true, message: "" }]}
            >
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>

            <AntInput
              readOnly
              formProps={{
                rules: [{ required: true, message: "कारण" }],
                name: "reason",
                label: "कारण",
              }}
            />

            <AntSelect
              array={[
                {
                  id: "Completed",
                  name: "Completed",
                },
                {
                  id: "Pending",
                  name: "Pending",
                },
                {
                  id: "Cancelled",
                  name: "Cancelled",
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
