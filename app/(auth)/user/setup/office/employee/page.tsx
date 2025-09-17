"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Button,
  DatePicker,
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

  const columns = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Department", dataIndex: "department", key: "department" },
    { title: "Email", dataIndex: "user_email", key: "user_email" },
    { title: "Phone No.", dataIndex: "phone_number", key: "phone_number" },
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
    mutationFn: (data: Omit<User, "id">) =>
      createApi(`${process.env.NEXT_PUBLIC_API_URL}user/employee/`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      toast.success("Employee created");
    },
  });

  const updateMutation = useMutation({
    mutationFn: (user: User) => updateApi(`user/employee/`, user),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      toast.success("Employee updated");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteApi(`user/employee/${id}/`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      toast.success("Employee deleted");
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
        Add Employee
      </AntButton>

      <Table
        rowKey="id"
        columns={columns || []}
        bordered
        dataSource={users?.data || []}
        loading={isLoading}
        style={{ marginTop: 16 }}
        scroll={{ y: 300, x: "800px" }}
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
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-2">
            <AntInput
              formProps={{
                name: "employee_id",
                label: "Employee Id",
                rules: [{ required: true, message: "Employee Id" }],
              }}
            />
            <AntInput
              formProps={{
                name: "employee_code",
                label: "Employee Code",
                rules: [{ required: true, message: "Employee Code" }],
              }}
            />
            <AntInput
              formProps={{
                name: "name",
                label: "Employee Name",
                rules: [{ required: true, message: "Employee Name" }],
              }}
            />

            <AntInput
              formProps={{
                name: "department",
                label: "Employee Department",
                rules: [{ required: true, message: "Employee Department" }],
              }}
            />

            <AntInput
              min={10}
              max={10}
              formProps={{
                name: "phone_number",
                label: "Phone Number",
                rules: [{ required: true, message: "Phone Number" }],
              }}
            />

            <AntInput
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
            />

            <AntInput
              formProps={{
                name: "local_level_type",
                label: "Local Level Type",
                rules: [{ required: true, message: "Local Level Type" }],
              }}
            />

            <AntInput
              formProps={{
                name: "local_level_name",
                label: "Local Level Name",
                rules: [{ required: true, message: "Local Level Name" }],
              }}
            />

            <AntInputNumber
              formProps={{
                name: "ward_no",
                label: "Ward No.",
                rules: [{ required: true, message: "Ward No." }],
              }}
            />

            <AntInputNumber
              formProps={{
                name: "tole",
                label: "Tole",
                rules: [{ required: true, message: "Tole" }],
              }}
            />

            <Form.Item
              name={"date_of_birth"}
              label="Date of Birth"
              rules={[{ required: true, message: "Date of Birth" }]}
            >
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>

            <Form.Item
              name={"appointment_date"}
              label="Appointment Date"
              rules={[{ required: true, message: "Appointment Date" }]}
            >
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>

            <AntInputNumber
              type="number"
              formProps={{
                name: "service_duration",
                label: "Service Duration",
                rules: [{ required: true, message: "Service Duration" }],
              }}
            />

            <AntSwitch
              formProps={{
                name: "status",
                label: "Status",
              }}
            />

            <AntInput
              formProps={{
                name: "citizenship_no",
                label: "Citizenship No.",
                rules: [{ required: true, message: "Citizenship No" }],
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
                rules: [{ required: true, message: "Gender" }],
                label: "Gender",
                name: "gender",
              }}
            />
            <AntInput
              formProps={{
                name: "emergency_contact",
                label: "Emergency Contact",
              }}
            />

            <AntInput
              formProps={{
                name: "bank_account_no",
                label: "Bank Account No.",
              }}
            />

            <AntInput
              formProps={{
                name: "bank_name",
                label: "Bank Name",
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
                label: "Employee Type",
                name: "employment_type",
              }}
            />

            <AntInput
              formProps={{
                name: "appointed_by",
                label: "Appointed By",
              }}
            />

            <Form.Item
              name={"contract_end_date"}
              label="Contract End Date"
              rules={[{ required: true, message: "Contract End Date" }]}
            >
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
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
