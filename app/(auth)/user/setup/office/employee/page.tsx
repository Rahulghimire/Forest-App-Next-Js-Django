"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, DatePicker, Form, Modal, Space, Table } from "antd";
import { useState } from "react";
import dayjs from "dayjs";

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
import { AntSwitch } from "@/app/components/AntSwitch";
import { AntSelect } from "@/app/components/AntSelect";

export default function Employee() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [form] = Form.useForm();

  const { data: users, isLoading } = useQuery({
    queryKey: ["employees"],
    queryFn: () => fetchApi(`user/employee/`),
  });

  const { data: positionData } = useQuery({
    queryKey: ["position"],
    queryFn: () => fetchApi(`user/position/`),
  });

  const columns = [
    {
      title: "कर्मचारी कोड",
      dataIndex: "employee_code",
      key: "employee_code",
    },
    { title: "नाम", dataIndex: "name", key: "name" },
    {
      title: "विभाग",
      dataIndex: "department",
      key: "department",
    },

    {
      title: "पदनाम",
      dataIndex: "designation",
      key: "designation",
    },
    { title: "फोन नम्बर", dataIndex: "phone_number", key: "phone_number" },
    // { title: "प्रदेश", dataIndex: "province", key: "province" },
    // { title: "जिला", dataIndex: "district", key: "district" },
    // { title: "ठेगाना", dataIndex: "address", key: "address" },

    // {
    //   title: "स्थान क्रम प्रकार",
    //   dataIndex: "local_level_type",
    //   key: "local_level_type",
    // },
    // {
    //   title: "Local Level Name",
    //   dataIndex: "local_level_name",
    //   key: "local_level_name",
    // },
    // { title: "Ward No.", dataIndex: "ward_no", key: "ward_no" },
    // { title: "Tole", dataIndex: "tole", key: "tole" },
    {
      title: "जन्म मिति",
      dataIndex: "date_of_birth",
      key: "date_of_birth",
    },

    {
      title: "ठेगाना",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "नियुक्ति मिति",
      dataIndex: "appointment_date",
      key: "appointment_date",
    },
    {
      title: "सेवा अवधि",
      dataIndex: "service_duration",
      key: "service_duration",
    },
    { title: "स्थिति", dataIndex: "status", key: "status" },
    {
      title: "नागरिकता नम्बर",
      dataIndex: "citizenship_no",
      key: "citizenship_no",
    },
    { title: "लिंग", dataIndex: "gender", key: "gender" },
    {
      title: "आपतकालीन सम्पर्क",
      dataIndex: "emergency_contact",
      key: "emergency_contact",
    },
    {
      title: "बैंक खाता नम्बर",
      dataIndex: "bank_account_no",
      key: "bank_account_no",
    },
    { title: "बैंक नाम", dataIndex: "bank_name", key: "bank_name" },
    {
      title: "कर्मचारी प्रकार",
      dataIndex: "employment_type",
      key: "employment_type",
    },
    {
      title: "नियुक्त गर्ने निकाय",
      dataIndex: "appointed_by",
      key: "appointed_by",
    },
    {
      title: "करार समाप्ति मिति",
      dataIndex: "contract_end_date",
      key: "contract_end_date",
    },
    {
      title: "Actions",
      key: "actions",
      fixed: "right" as const,
      render: (_: any, record: any) => (
        <Space>
          <Button
            onClick={() => {
              setEditingUser({
                ...record,
                date_of_birth: record?.date_of_birth
                  ? dayjs(record?.date_of_birth)
                  : null,
                appointment_date: record?.appointment_date
                  ? dayjs(record?.appointment_date)
                  : null,
                contract_end_date: record?.contract_end_date
                  ? dayjs(record?.contract_end_date)
                  : null,
              });
              form.setFieldsValue({
                ...record,
                date_of_birth: record?.date_of_birth
                  ? dayjs(record?.date_of_birth)
                  : null,
                appointment_date: record?.appointment_date
                  ? dayjs(record?.appointment_date)
                  : null,
                contract_end_date: record?.contract_end_date
                  ? dayjs(record?.contract_end_date)
                  : null,
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
    mutationFn: (data: Omit<User, "id">) =>
      createApi(`${process.env.NEXT_PUBLIC_API_URL}user/employee/`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      toast.success("Employee created");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const updateMutation = useMutation({
    mutationFn: (user: User) => updateApi(`user/employee/`, user),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      toast.success("Employee updated");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteApi(`user/employee/${id}/`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      toast.success("Employee deleted");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleFinish = async (values: any) => {
    if (editingUser) {
      await updateMutation.mutateAsync({
        ...editingUser,
        ...values,
        date_of_birth: dayjs(values.date_of_birth).format("YYYY-MM-DD"),
        appointment_date: dayjs(values.appointment_date).format("YYYY-MM-DD"),
        contract_end_date: dayjs(values.contract_end_date).format("YYYY-MM-DD"),
      });
    } else {
      await createMutation.mutateAsync({
        ...values,
        date_of_birth: dayjs(values.date_of_birth).format("YYYY-MM-DD"),
        appointment_date: dayjs(values.appointment_date).format("YYYY-MM-DD"),
        contract_end_date: dayjs(values.contract_end_date).format("YYYY-MM-DD"),
      });
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
        Add Employee
      </AntButton>

      <Table
        rowKey="id"
        columns={columns || []}
        bordered
        dataSource={users?.data || []}
        loading={isLoading}
        style={{ marginTop: 16 }}
        scroll={{ y: 300, x: "3000px" }}
      />

      <Modal
        width={"90vw"}
        title={editingUser ? "Edit Employee" : "Add Employee"}
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
          <div className="font-semibold mb-2">Personal Details</div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-x-2">
            <AntInput
              formProps={{
                name: "employee_code",
                label: "कर्मचारी कोड",
                rules: [{ required: true, message: "कर्मचारी कोड" }],
              }}
            />
            <AntInput
              formProps={{
                name: "name",
                label: "नाम",
                rules: [{ required: true, message: "नाम" }],
              }}
            />

            <AntSelect
              array={[
                { id: "M", name: "Male" },
                { id: "F", name: "Female" },
                { id: "O", name: "Others" },
              ]}
              renderKey={"name"}
              valueKey={"id"}
              formProps={{
                rules: [{ required: true, message: "लिंग" }],
                label: "लिंग",
                name: "gender",
              }}
            />

            <AntInput
              formProps={{
                name: "department",
                label: "विभाग",
                rules: [{ required: true, message: "विभाग" }],
              }}
            />

            <AntSelect
              array={positionData?.data || []}
              renderKey={"position_name"}
              valueKey={"id"}
              formProps={{
                rules: [{ required: true, message: "पदनाम" }],
                label: "पदनाम",
                name: "designation",
              }}
            />
            <AntInput
              min={10}
              max={10}
              formProps={{
                name: "phone_number",
                label: "फोन नम्बर",
                rules: [{ required: true, message: "फोन नम्बर" }],
              }}
            />
            <AntInput
              formProps={{
                name: "address",
                label: "ठेगाना",
                rules: [{ required: true, message: "ठेगाना" }],
              }}
            />
            {/* <AntInput
              formProps={{
                name: "province",
                label: "Province",
                rules: [{ required: true, message: "Province" }],
              }}
            />

            <AntInput
              formProps={{
                name: "district",
                label: "District",
                rules: [{ required: true, message: "District" }],
              }}
            /> */}
            {/* <AntInput
              formProps={{
                name: "local_level_type",
                label: "Local Level Type",
                rules: [{ required: true, message: "Local Level Type" }],
              }}
            /> */}
            {/* <AntInput
              formProps={{
                name: "local_level_name",
                label: "Local Level Name",
                rules: [{ required: true, message: "Local Level Name" }],
              }}
            /> */}
            {/* <AntInputNumber
              formProps={{
                name: "ward_no",
                label: "Ward No.",
                rules: [{ required: true, message: "Ward No." }],
              }}
            /> */}
            {/* <AntInputNumber
              formProps={{
                name: "tole",
                label: "Tole",
                rules: [{ required: true, message: "Tole" }],
              }}
            /> */}
            <Form.Item
              name={"date_of_birth"}
              label="जन्म मिति"
              rules={[{ required: true, message: "जन्म मिति" }]}
            >
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item
              name={"appointment_date"}
              label="नियुक्ति मिति"
              rules={[{ required: true, message: "नियुक्ति मिति" }]}
            >
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
            <AntInputNumber
              type="number"
              formProps={{
                name: "service_duration",
                label: "सेवा अवधि",
                rules: [{ required: true, message: "सेवा अवधि" }],
              }}
            />
            <AntSwitch
              formProps={{
                name: "status",
                label: "स्थिति",
              }}
            />
          </div>
          <div className="font-semibold mb-2">Document Details</div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-x-2">
            <AntInput
              formProps={{
                name: "citizenship_no",
                label: "नागरिकता नम्बर",
                rules: [{ required: true, message: "नागरिकता नम्बर" }],
              }}
            />

            <AntInput
              formProps={{
                name: "bank_account_no",
                label: "बैंक खाता नम्बर",
              }}
            />
            <AntInput
              formProps={{
                name: "bank_name",
                label: "बैंक नाम",
              }}
            />
            <AntSelect
              array={[
                { id: "Contract", name: "Contract" },
                { id: "Full", name: "Full-time" },
                { id: "Part", name: "Part-time" },
              ]}
              renderKey={"name"}
              valueKey={"id"}
              formProps={{
                rules: [{ required: true, message: "Employee Type" }],
                label: "कर्मचारी प्रकार",
                name: "employment_type",
              }}
            />
            <AntInput
              formProps={{
                name: "appointed_by",
                label: "नियुक्त गर्ने निकाय",
              }}
            />
            <Form.Item
              name={"contract_end_date"}
              label="Contract End Date"
              rules={[{ required: true, message: "करार समाप्ति मिति" }]}
            >
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
            <AntInput
              formProps={{
                name: "emergency_contact",
                label: "आपतकालीन सम्पर्क",
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
