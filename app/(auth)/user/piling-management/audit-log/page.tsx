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

export default function AuditLog() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any | null>(null);
  const [form] = Form.useForm();

  const { data: plots, isLoading } = useQuery({
    queryKey: ["piling-audit-logs"],
    queryFn: () => fetchApi(`pilling/audit-logs/`),
  });

  const { data: pilingAccountsData } = useQuery({
    queryKey: ["pilling-accounts"],
    queryFn: () => fetchApi(`pilling/pilling-accounts/`),
  });

  const { data: speciesData } = useQuery({
    queryKey: ["species"],
    queryFn: () => fetchApi(`forest/species/`),
  });

  const { data: classSetupData } = useQuery({
    queryKey: ["class-setup"],
    queryFn: () => fetchApi(`forest/class-setup/`),
  });

  const columns = [
    {
      title: "लग आईडी",
      dataIndex: "log_id",
      key: "log_id",
    },
    {
      title: "प्रयोगकर्ता",
      dataIndex: "user_id",
      key: "user_id",
    },
    {
      title: "भूमिका",
      dataIndex: "role",
      key: "role",
    },
    {
      title: "कार्य",
      dataIndex: "action",
      key: "action",
    },
    {
      title: "Entity प्रकार",
      dataIndex: "entity_type",
      key: "entity_type",
    },
    {
      title: "Entity आईडी",
      dataIndex: "entity_id",
      key: "entity_id",
    },
    {
      title: "अघिल्लो डाटा",
      dataIndex: "previous_data",
      key: "previous_data",
    },
    {
      title: "नयाँ डाटा",
      dataIndex: "new_data",
      key: "new_data",
    },
    {
      title: "IP ठेगाना",
      dataIndex: "ip_address",
      key: "ip_address",
    },
    {
      title: "Device/Browser Info",
      dataIndex: "device_info",
      key: "device_info",
    },
    {
      title: "मिति/समय",
      dataIndex: "timestamp",
      key: "timestamp",
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

    // {
    //   title: "Actions",
    //   key: "actions",
    //   fixed: "right" as const,
    //   render: (_: any, record: any) => (
    //     <Space>
    //       <Button
    //         onClick={() => {
    //           setEditingUser(record);
    //           form.setFieldsValue({
    //             ...record,
    //             adjustment_date: record?.adjustment_date
    //               ? dayjs(record?.adjustment_date)
    //               : null,
    //           });
    //           setIsModalOpen(true);
    //         }}
    //         icon={<EditOutlined />}
    //       ></Button>
    //       <Button
    //         danger
    //         onClick={() => deleteMutation.mutate(record.log_id)}
    //         icon={<DeleteOutlined />}
    //       ></Button>
    //     </Space>
    //   ),
    // },
  ];

  const createMutation = useMutation({
    mutationFn: (data: Omit<any, "id">) =>
      createApi(`pilling/audit-logs/`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["piling-audit-logs"] });
      toast.success("Audit Log created");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const updateMutation = useMutation({
    mutationFn: (user: any) =>
      updateApi(`pilling/audit-logs/`, {
        ...user,
        id: user.log_id,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["piling-audit-logs"] });
      toast.success("Audit Log updated");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteApi(`pilling/audit-logs/${id}/`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["piling-audit-logs"] });
      toast.success("Audit Log deleted");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleFinish = async (values: any) => {
    const payload = {
      ...editingUser,
      ...values,
      adjustment_date: values?.adjustment_date
        ? dayjs(values.adjustment_date).format("YYYY-MM-DD")
        : null,
    };

    if (editingUser) {
      await updateMutation.mutateAsync({
        ...payload,
        id: editingUser.log_id,
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
      {/* <AntButton
        type="primary"
        onClick={() => setIsModalOpen(true)}
        icon={<PlusCircleOutlined />}
      >
        Add Audit Log
      </AntButton> */}

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
        title={editingUser ? "Edit Audit Log" : "Add Audit Log"}
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
              array={[
                { id: "Admin", name: "Admin" },
                { id: "User", name: "User" },
                { id: "SuperAdmin", name: "SuperAdmin" },
              ]}
              renderKey={"name"}
              valueKey={"id"}
              disabled
              formProps={{
                rules: [{ required: true, message: "भूमिका" }],
                label: "भूमिका",
                name: "role",
              }}
            />

            <AntSelect
              array={[
                { id: "Admin", name: "Admin" },
                { id: "User", name: "User" },
                { id: "SuperAdmin", name: "SuperAdmin" },
              ]}
              renderKey={"name"}
              valueKey={"id"}
              disabled
              formProps={{
                rules: [{ required: true, message: "कार्य" }],
                label: "कार्य",
                name: "action",
              }}
            />

            <AntSelect
              array={[
                { id: "Admin", name: "Admin" },
                { id: "User", name: "User" },
                { id: "SuperAdmin", name: "SuperAdmin" },
              ]}
              renderKey={"name"}
              valueKey={"id"}
              disabled
              formProps={{
                rules: [{ required: true, message: "Entity प्रकार" }],
                label: "Entity प्रकार",
                name: "entity_type",
              }}
            />

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
                rules: [{ required: true, message: "अघिल्लो परिमाण (CFT)" }],
                name: "prev_volume_cft",
                label: "अघिल्लो परिमाण (CFT)",
              }}
            />

            <AntInput
              type="number"
              formProps={{
                rules: [{ required: true, message: "समायोजन परिमाण (CFT)" }],
                name: "adjusted_volume_cft",
                label: "समायोजन परिमाण (CFT)",
              }}
            />

            <AntSelect
              array={[
                { id: "Loss", name: "Loss" },
                { id: "Gain", name: "Gain" },
                { id: "Correction", name: "Correction" },
              ]}
              renderKey={"name"}
              valueKey={"id"}
              formProps={{
                rules: [{ required: true, message: "Adjustment प्रकार" }],
                label: "Adjustment प्रकार",
                name: "adjustment_type",
              }}
            />

            <AntInput
              formProps={{
                rules: [{ required: true, message: "कारण" }],
                name: "reason",
                label: "कारण",
              }}
            />

            <Form.Item
              name={"adjustment_date"}
              label="मिति"
              initialValue={dayjs()}
              rules={[{ required: true, message: "" }]}
            >
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>

            <AntInput
              readOnly
              formProps={{
                name: "remarks",
                label: "कैफियत",
              }}
            />

            <AntSelect
              array={[
                {
                  id: "Pending",
                  name: "Pending",
                },
                {
                  id: "Approved",
                  name: "Approved",
                },
                {
                  id: "Rejected",
                  name: "Rejected",
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
