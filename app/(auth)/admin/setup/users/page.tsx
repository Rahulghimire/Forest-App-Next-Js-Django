"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Button,
  Checkbox,
  Divider,
  Form,
  Input,
  Modal,
  Select,
  Space,
  Table,
} from "antd";
import { useState } from "react";
import {
  createUser,
  deleteUser,
  fetchPermission,
  fetchUsers,
  Permission,
  updateUser,
  User,
  UserList,
} from "../api";
import { AntButton } from "@/app/components/AntButton";
import {
  CloseCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusCircleOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import { toast } from "react-toastify";

export default function Users() {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const [selected, setSelected] = useState<string[]>([]);

  const { data: permissionData, isLoading: loadingPermission } = useQuery<
    Permission[]
  >({
    queryKey: ["permissions"],
    queryFn: fetchPermission,
  });

  const { data: users, isLoading } = useQuery<UserList>({
    queryKey: ["users"],
    queryFn: fetchUsers,
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
              const codes = record?.permission?.map((p) => p.code);
              setSelected(codes);
              form.setFieldsValue({ ...record, email: record.user_email });
              setIsModalOpen(true);
            }}
            icon={<EditOutlined />}
          />
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
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User created");
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User updated");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User deleted");
    },
  });

  const handleFinish = async (values: any) => {
    if (editingUser) {
      await updateMutation.mutateAsync({
        ...editingUser,
        permission_list: selected,
        ...values,
      });
    } else {
      await createMutation.mutateAsync({
        ...values,
        permission_list: selected,
      });
    }
    setIsModalOpen(false);
    form.resetFields();
    setEditingUser(null);
    setSelected([]);
  };

  return (
    <div>
      <AntButton
        type="primary"
        onClick={() => {
          setIsModalOpen(true);
          setSelected([]);
        }}
        icon={<PlusCircleOutlined />}
      >
        Add User
      </AntButton>

      <Table
        rowKey="id"
        columns={columns || []}
        bordered
        dataSource={users?.data || []}
        loading={
          isLoading ||
          deleteMutation?.isPending ||
          createMutation?.isPending ||
          updateMutation?.isPending
        }
        style={{ marginTop: 16 }}
        scroll={{ y: 300, x: "800px" }}
      />

      <Modal
        loading={loadingPermission}
        width={"90vw"}
        title={editingUser ? "Edit User" : "Add User"}
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
            <Form.Item name="name" label="Name" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item
              name="email"
              label="Email"
              rules={[{ required: true, type: "email" }]}
            >
              <Input autoComplete="off" />
            </Form.Item>

            {!editingUser && (
              <Form.Item
                name="password"
                label="Password"
                rules={[
                  { required: true, message: "Please enter your password" },
                ]}
              >
                <Input.Password />
              </Form.Item>
            )}

            <Form.Item
              name={"department"}
              label="Department"
              rules={[
                { required: true, message: "Please enter your phone number" },
              ]}
            >
              <Input placeholder="Enter department" />
            </Form.Item>

            <Form.Item
              name={"phone_number"}
              label="Phone Number"
              rules={[
                { required: true, message: "Please enter your phone number" },
              ]}
            >
              <Input placeholder="Enter phone no." />
            </Form.Item>
          </div>

          <Divider
            style={{
              margin: "6px 0",
            }}
          />

          <div className="font-semibold mb-2">Position Details</div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-2">
            <div>
              <Form.Item
                name={["position_data", "position_name"]}
                label="Position Name"
              >
                <Input placeholder="Enter position name" />
              </Form.Item>
            </div>

            <div>
              <Form.Item name={["position_data", "level"]} label="Level">
                <Select
                  options={[
                    { value: "Senior-level", label: "Senior-level" },
                    { value: "Mid-level", label: "Mid-level" },
                    { value: "Junior-level", label: "Junior-level" },
                  ]}
                />
              </Form.Item>
            </div>

            <div>
              <Form.Item
                name={["position_data", "responsibilities"]}
                label="Responsibilities"
                // rules={[
                //   {
                //     required: true,
                //     message: "Please enter your responsibilities",
                //   },
                // ]}
              >
                <Input placeholder="Enter responsibilities" />
              </Form.Item>
            </div>

            <div>
              <Form.Item
                name={["position_data", "qualification"]}
                label="Qualification"
                // rules={[
                //   {
                //     required: true,
                //     message: "Please enter your qualification",
                //   },
                // ]}
              >
                <Input placeholder="Enter qualification" />
              </Form.Item>
            </div>

            <div>
              <Form.Item
                name={["position_data", "salary_scale"]}
                label="Salary Scale"
                // rules={[
                //   { required: true, message: "Please enter your salary scale" },
                // ]}
              >
                <Select
                  options={[
                    { value: "10000-20000", label: "10000-20000" },
                    { value: "20000-30000", label: "20000-30000" },
                  ]}
                />
              </Form.Item>
            </div>

            <div>
              <Form.Item
                name={["position_data", "department"]}
                label="Department"
                // rules={[
                //   {
                //     required: true,
                //     message: "Please enter your department",
                //   },
                // ]}
              >
                <Input placeholder="Enter department" />
              </Form.Item>
            </div>
          </div>

          <Divider
            style={{
              margin: "6px 0",
            }}
          />

          <div className="font-semibold text-gray-700 mb-3">Permissions</div>
          <Checkbox
            indeterminate={
              selected.length > 0 &&
              selected.length < (permissionData?.length ?? 0)
            }
            checked={
              selected.length > 0 &&
              selected.length === (permissionData?.length ?? 0)
            }
            onChange={(e) =>
              setSelected(
                e.target.checked ? permissionData?.map((p) => p.code) ?? [] : []
              )
            }
          >
            Check all
          </Checkbox>

          <div className="p-4 mt-2 rounded-lg shadow-sm bg-white">
            <Checkbox.Group
              className="grid grid-cols-2 gap-2"
              options={permissionData?.map((p) => ({
                label: p.code,
                value: p.code,
              }))}
              value={selected}
              onChange={(vals) => setSelected(vals as string[])}
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
