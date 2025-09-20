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
import { AntSwitch } from "@/app/components/AntSwitch";
import { AntInputNumber } from "@/app/components/AntInputNumber";
import { fetchApi, createApi, updateApi, deleteApi } from "../../setup/api";
import { AntSelect } from "@/app/components/AntSelect";
import dayjs from "dayjs";

export default function Intake() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any | null>(null);
  const [form] = Form.useForm();

  const { data: plots, isLoading } = useQuery({
    queryKey: ["intakes"],
    queryFn: () => fetchApi(`pilling/intakes/`),
  });

  const { data: speciesData } = useQuery({
    queryKey: ["species"],
    queryFn: () => fetchApi(`forest/species/`),
  });

  const { data: plotsData } = useQuery({
    queryKey: ["plots"],
    queryFn: () => fetchApi(`forest/plots/`),
  });

  const { data: classData } = useQuery({
    queryKey: ["class"],
    queryFn: () => fetchApi(`forest/class-setups/`),
  });

  const { data: unitData } = useQuery({
    queryKey: ["unit"],
    queryFn: () => fetchApi(`forest/units`),
  });

  const columns = [
    {
      title: "प्रजाति",
      dataIndex: ["species", "species_name"],
      key: "species",
    },
    {
      title: "प्लट",
      dataIndex: ["plot", "plot_name"],
      key: "plot",
    },
    {
      title: "लम्बाई (ft)",
      dataIndex: "measurement_length",
      key: "measurement_length",
    },
    {
      title: "गोलाई (inch)",
      dataIndex: "measurement_girth",
      key: "measurement_girth",
    },
    {
      title: "परिमाण (घनफिट)",
      dataIndex: "volume_cft",
      key: "volume_cft",
    },
    {
      title: "तौल (के.जि.)",
      dataIndex: "weight",
      key: "weight",
    },
    {
      title: "ग्रेड",
      dataIndex: "grade",
      key: "grade",
    },
    {
      title: "वर्ग",
      dataIndex: ["class_name", "class_name"],
      key: "class_name",
    },
    {
      title: "एकाई",
      dataIndex: ["unit", "unit_name"],
      key: "unit",
    },
    {
      title: "इन्टेक मिति",
      dataIndex: "intake_date",
      key: "intake_date",
    },
    {
      title: "ट्याग कोड",
      dataIndex: "unique_tag_code",
      key: "unique_tag_code",
    },
    {
      title: "स्थिति",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "प्रविष्टि गर्ने",
      dataIndex: ["entered_by", "email"],
      key: "entered_by",
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
                intake_date: record?.intake_date
                  ? dayjs(record?.intake_date)
                  : null,
                species_id: record?.species?.id,
                plot_id: record?.plot?.id,
                class_id: record?.class_name?.id,
                unit_id: record?.unit?.id,
                entered_by: record?.entered_by?.email,
              });
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
      createApi(`${process.env.NEXT_PUBLIC_API_URL}pilling/intakes/`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["intakes"] });
      toast.success("Intake created");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const updateMutation = useMutation({
    mutationFn: (user: any) =>
      updateApi(`pilling/intakes/`, { ...user, id: user.intake_id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["intakes"] });
      toast.success("Intake updated");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteApi(`pilling/intakes/${id}/`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["intakes"] });
      toast.success("Intake deleted");
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
        Add Intake
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
        title={editingUser ? "Edit Intake" : "Add Intake"}
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
              array={speciesData?.data || []}
              renderKey={"species_name"}
              valueKey={"id"}
              formProps={{
                rules: [{ required: true, message: "प्रजाति" }],
                label: "प्रजाति",
                name: "species_id",
              }}
            />

            <AntSelect
              array={plotsData?.data || []}
              renderKey={"plot_name"}
              valueKey={"id"}
              formProps={{
                rules: [{ required: true, message: "प्लट" }],
                label: "प्लट",
                name: "plot_id",
              }}
            />

            <AntInputNumber
              type="number"
              formProps={{
                rules: [{ required: true, message: "लम्बाई (ft)" }],
                name: "measurement_length",
                label: "लम्बाई (ft)",
              }}
            />

            <AntInputNumber
              type="number"
              formProps={{
                rules: [{ required: true, message: "गोलाई (inch)" }],
                name: "measurement_girth",
                label: "गोलाई (inch)",
              }}
            />

            <Form.Item shouldUpdate noStyle>
              {({ getFieldValue, setFieldsValue }) => {
                const length = getFieldValue("measurement_length") || 0;
                const girth = getFieldValue("measurement_girth") || 0;

                const volume =
                  length && girth
                    ? parseFloat(
                        (
                          (Math.PI * Math.pow(girth / 2, 2) * length) /
                          144
                        ).toFixed(2)
                      )
                    : 0;

                if (volume && volume !== getFieldValue("volume_cft")) {
                  setFieldsValue({ volume_cft: volume });
                }

                return (
                  <AntInputNumber
                    type="number"
                    formProps={{
                      rules: [{ required: true, message: "परिमाण (घनफिट)" }],
                      name: "volume_cft",
                      label: "परिमाण (घनफिट)",
                    }}
                    precision={2}
                    readOnly
                  />
                );
              }}
            </Form.Item>

            <AntInputNumber
              type="number"
              formProps={{
                rules: [{ required: true, message: "तौल (के.जि.)" }],
                name: "weight",
                label: "तौल (के.जि.)",
              }}
            />

            <AntSelect
              array={[
                { id: "A", name: "A" },
                { id: "B", name: "B" },
                { id: "C", name: "C" },
              ]}
              renderKey={"name"}
              valueKey={"id"}
              formProps={{
                rules: [{ required: true, message: "प्लट" }],
                label: "प्लट",
                name: "plot_id",
              }}
            />

            <AntSelect
              array={classData?.data || []}
              renderKey={"class_name"}
              valueKey={"id"}
              formProps={{
                rules: [{ required: true, message: "वर्ग" }],
                label: "वर्ग",
                name: "class_id ",
              }}
            />

            <AntSelect
              array={unitData?.data || []}
              renderKey={"unit_name"}
              valueKey={"id"}
              formProps={{
                rules: [{ required: true, message: "एकाई" }],
                label: "एकाई",
                name: "unit_id",
              }}
            />

            <Form.Item
              name={"intake_date"}
              label="इन्टेक मिति"
              rules={[{ required: true, message: "इन्टेक मिति" }]}
            >
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>

            <AntInput
              formProps={{
                rules: [
                  {
                    required: true,
                    message: "ट्याग कोड",
                  },
                ],
                name: "unique_tag_code",
                label: "ट्याग कोड",
              }}
            />

            <AntSwitch
              formProps={{
                name: "status",
                label: "स्थिति",
              }}
            />

            <AntInput
              formProps={{
                rules: [
                  {
                    required: true,
                    message: "प्रविष्टि गर्ने",
                  },
                ],
                name: "entered_by",
                label: "प्रविष्टि गर्ने",
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
