"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Checkbox, Divider, Form, Modal, Space, Table } from "antd";
import { useState } from "react";

import { fetchPermission, Permission } from "@/app/(auth)/admin/setup/api";
import { AntButton } from "@/components/AntButton";
import { AntInput } from "@/components/AntInput";
import { AntSelect } from "@/components/AntSelect";
import { AntSwitch } from "@/components/AntSwitch";
import {
  CloseCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  PlusCircleOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import { toast } from "react-toastify";
import { createApi, deleteApi, fetchApi, updateApi, User } from "../../api";

export default function Member() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [viewingUser, setViewingUser] = useState(false);

  const [form] = Form.useForm();

  const [selected, setSelected] = useState<string[]>([]);

  const { data: permissionData } = useQuery<Permission[]>({
    queryKey: ["permissions"],
    queryFn: fetchPermission,
  });

  const { data: plots, isLoading } = useQuery({
    queryKey: ["roles"],
    queryFn: () => fetchApi(`roles/`),
  });

  const columns = [
    {
      title: "भूमिका कोड",
      dataIndex: "role_code",
      key: "role_code",
    },
    {
      title: "भूमिका नाम",
      dataIndex: "role_name",
      key: "role_name",
    },
    {
      title: "विवरण",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "पहुँच स्तर",
      dataIndex: "access_level",
      key: "access_level",
    },
    {
      title: "स्थिति",
      dataIndex: "active",
      key: "active",
      render: (value: boolean) => (value ? "Yes" : "No"),
    },
    {
      title: "Actions",
      key: "actions",
      fixed: "right" as const,
      render: (_: any, record: any) => (
        <Space>
          <Button
            onClick={() => {
              setViewingUser(false);
              setEditingUser(record);
              form.setFieldsValue({ ...record });
              setSelected(record.permission_list ?? []);
              setIsModalOpen(true);
            }}
            icon={<EditOutlined />}
          />

          <Button
            onClick={() => {
              setViewingUser(true);
              form.setFieldsValue({
                ...record,
              });
              setSelected(record.permission_list ?? []);
              setIsModalOpen(true);
            }}
            icon={<EyeOutlined />}
          />
          <Button
            danger
            onClick={() => deleteMutation.mutate(record.id)}
            icon={<DeleteOutlined />}
          />
        </Space>
      ),
    },
  ];

  const createMutation = useMutation({
    mutationFn: (data: Omit<any, "id">) => createApi(`roles/`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
      toast.success("Role created");
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  const updateMutation = useMutation({
    mutationFn: (user: any) => updateApi(`roles/`, user),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
      toast.success("Role updated");
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteApi(`roles/${id}/`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
      toast.success("Roles deleted");
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  const handleFinish = async (values: any) => {
    const payload = { ...values, permission: selected };
    if (editingUser) {
      await updateMutation.mutateAsync({ ...editingUser, ...payload });
    } else {
      await createMutation.mutateAsync(payload);
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
          setViewingUser(false);
          setIsModalOpen(true);
        }}
        icon={<PlusCircleOutlined />}
      >
        Add Role
      </AntButton>

      <Table
        rowKey="id"
        columns={columns}
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
        title={
          viewingUser ? "View Role" : editingUser ? "Edit Role" : "Add Role"
        }
        open={isModalOpen}
        footer={null}
        onCancel={() => {
          setIsModalOpen(false);
          setEditingUser(null);
          form.resetFields();
          setSelected([]);
        }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFinish}
          autoComplete="off"
          disabled={viewingUser}
        >
          <div className="gap-x-2 grid md:grid-cols-2 lg:grid-cols-4">
            <AntInput
              formProps={{
                name: "role_name",
                label: "भूमिका नाम",
                rules: [{ required: true, message: "भूमिका नाम" }],
              }}
            />

            <AntInput
              formProps={{
                name: "description",
                label: "विवरण",
                rules: [{ required: true, message: "विवरण" }],
              }}
            />

            <AntSelect
              array={[{ id: "staff", name: "Staff" }]}
              renderKey={"name"}
              valueKey={"id"}
              formProps={{
                rules: [{ required: true, message: "पहुँच स्तर" }],
                label: "पहुँच स्तर",
                name: "access_level",
              }}
            />

            <AntSwitch
              formProps={{
                initialValue: false,
                label: "स्थिति",
                name: "active",
              }}
            />

            <div
              className="col-span-full"
              style={{
                display: (permissionData?.length ?? 0) > 0 ? "block" : "none",
              }}
            >
              <Divider style={{ margin: "6px 0" }} />

              <div className="mb-3 font-semibold text-gray-700">
                अनुमति सूची
              </div>
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
                    e.target.checked
                      ? permissionData?.map((p) => p.code) ?? []
                      : []
                  )
                }
              >
                Check all
              </Checkbox>

              <div className="bg-white shadow-sm mt-2 p-4 rounded-lg">
                <Checkbox.Group
                  className="gap-2 grid grid-cols-2"
                  options={permissionData?.map((p) => ({
                    label: p.code,
                    value: p.code,
                  }))}
                  value={selected}
                  onChange={(vals) => setSelected(vals as string[])}
                />
              </div>
            </div>
          </div>

          <div
            className="flex justify-end gap-x-3 mt-3"
            style={{
              display: viewingUser ? "none" : "flex",
            }}
          >
            <AntButton
              color="red"
              icon={<CloseCircleOutlined />}
              onClick={() => {
                setIsModalOpen(false);
                setEditingUser(null);
                form.resetFields();
                setSelected([]);
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
