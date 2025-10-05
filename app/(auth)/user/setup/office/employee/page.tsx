"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, DatePicker, Form, Modal, Space, Table, Upload } from "antd";
import { useState } from "react";
import dayjs from "dayjs";

import { AntButton } from "@/app/components/AntButton";
import {
  CloseCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  FundViewOutlined,
  PlusCircleOutlined,
  PlusOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import { toast } from "react-toastify";
import {
  createApi,
  createApiFormData,
  deleteApi,
  fetchApi,
  updateApiFormData,
  User,
} from "../../api";
import { AntInput } from "@/app/components/AntInput";
import { AntInputNumber } from "@/app/components/AntInputNumber";
import { AntSwitch } from "@/app/components/AntSwitch";
import { AntSelect } from "@/app/components/AntSelect";

//pan optional in employee
//document upload-id proof
//image-personal image
//view option for all the setups
//Chuttaune wala kaam
//billing-tourism billing
//nilami bikri-point no. 2
//Payroll point no. 9

export default function Employee() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewingUser, setViewingUser] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [fileList, setFileList] = useState<any[]>([]);
  const [fileList2, setFileList2] = useState<any[]>([]);
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
              setViewingUser(false);
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
          />

          <Button
            onClick={() => {
              setViewingUser(true);
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
            icon={<EyeOutlined />}
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

  const handleChange = ({ fileList }: { fileList: any[] }) => {
    setFileList(fileList);
  };

  const handleChange2 = ({ fileList }: { fileList: any[] }) => {
    setFileList2(fileList);
  };

  const handlePreview = async (file: any) => {
    let src = file.url;
    if (!src) {
      src = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (err) => reject(err);
      });
    }
    const imgWindow = window.open(src);
    if (imgWindow) imgWindow.document.write(`<img src="${src}" />`);
  };

  const uploadButton = (
    <button style={{ border: 0, background: "none" }} type="button">
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );

  const beforeUpload = (file: File) => {
    const isImage =
      file.type === "image/jpeg" ||
      file.type === "image/png" ||
      file.type === "image/jpg";
    if (!isImage) {
      toast.error("Please upload an image file!");
      return Upload.LIST_IGNORE;
    }

    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      toast.error("Image must smaller than 2MB!");
      return Upload.LIST_IGNORE;
    }

    return false;
  };

  const createMutation = useMutation({
    mutationFn: (data: Omit<any, "id">) =>
      createApiFormData(`user/employee/`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      toast.success("Employee created");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const updateMutation = useMutation({
    // mutationFn: (user: any) => updateApi(`user/employee/${user.id}/`, user),
    mutationFn: (user: any) =>
      updateApiFormData(`user/employee/${user.get("id")}`, user),
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
    const formData = new FormData();

    const payload = {
      ...editingUser,
      ...values,
      date_of_birth: dayjs(values.date_of_birth).format("YYYY-MM-DD"),
      appointment_date: dayjs(values.appointment_date).format("YYYY-MM-DD"),
      contract_end_date: dayjs(values.contract_end_date).format("YYYY-MM-DD"),
    };

    Object.entries(payload).forEach(([key, val]) => {
      if (val !== undefined && val !== null) {
        formData.append(
          key,
          typeof val === "string" || val instanceof Blob ? val : String(val)
        );
      }
    });

    if (fileList2[0]?.originFileObj) {
      formData.append("document_url", fileList2[0].originFileObj);
    }
    if (fileList[0]?.originFileObj) {
      formData.append("profile_photo_url", fileList[0].originFileObj);
    }

    if (editingUser) {
      await updateMutation.mutateAsync(formData);
    } else {
      await createMutation.mutateAsync(formData);
    }
    setIsModalOpen(false);
    form.resetFields();
    setEditingUser(null);
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
          disabled={viewingUser}
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
            <AntInput
              formProps={{
                name: "pan_no",
                label: "पान नम्बर",
              }}
              max={10}
              min={7}
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
            <Form.Item name={"contract_end_date"} label="Contract End Date">
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
            <AntInput
              formProps={{
                name: "emergency_contact",
                label: "आपतकालीन सम्पर्क",
              }}
            />

            <Form.Item name={"profile_photo_url"} label="प्रोफ़ाइल फोटो">
              <Upload
                name="avatar"
                listType="picture-card"
                maxCount={1}
                showUploadList={{
                  showPreviewIcon: true,
                  showRemoveIcon: true,
                }}
                beforeUpload={beforeUpload}
                onChange={handleChange}
                onPreview={handlePreview}
                accept=".jpg, .jpeg, .png"
              >
                {fileList.length >= 1 ? null : uploadButton}
              </Upload>
            </Form.Item>

            <Form.Item name={"document_url"} label="प्रमाणपत्र/कागजात">
              <Upload
                name="avatar"
                listType="picture-card"
                maxCount={1}
                showUploadList={{
                  showPreviewIcon: true,
                  showRemoveIcon: true,
                }}
                beforeUpload={beforeUpload}
                onChange={handleChange2}
                onPreview={handlePreview}
                accept=".jpg, .jpeg, .png"
              >
                {fileList2.length >= 1 ? null : uploadButton}
              </Upload>
            </Form.Item>
          </div>

          <div
            style={{
              display: viewingUser ? "none" : "flex",
            }}
            className="flex justify-end gap-x-3"
          >
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
