"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Button,
  DatePicker,
  Form,
  GetProp,
  Input,
  Modal,
  Space,
  Table,
  Upload,
  UploadProps,
} from "antd";
import dayjs from "dayjs";
import React, { useState } from "react";

import { AntButton } from "@/app/components/AntButton";
import {
  CloseCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusCircleOutlined,
  PlusOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import { toast } from "react-toastify";
import { createApi, deleteApi, fetchApi, updateApi, User } from "../../api";
import { AntInput } from "@/app/components/AntInput";
import { AntSelect } from "@/app/components/AntSelect";
import { AntSwitch } from "@/app/components/AntSwitch";
import { AntInputNumber } from "@/app/components/AntInputNumber";

export default function Member() {
  const [form] = Form.useForm();

  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const [fileList, setFileList] = useState<any[]>([]);

  const [fileList2, setFileList2] = useState<any[]>([]);

  console.log("dfsasfddsa", fileList);

  const { data: plots, isLoading } = useQuery({
    queryKey: ["member"],
    queryFn: () => fetchApi(`member/`),
  });

  const columns = [
    { title: "नाम", dataIndex: "position_name", key: "position_name" },
    {
      title: "लिंग",
      dataIndex: "gender",
      key: "gender",
      render: (val: string) =>
        val === "M" ? "Male" : val === "F" ? "Female" : "Others",
    },
    {
      title: "जन्म मिति",
      dataIndex: "date_of_birth",
      key: "date_of_birth",
      render: (val: string) => (val ? new Date(val).toLocaleDateString() : ""),
    },
    {
      title: "नागरिकता नम्बर",
      dataIndex: "citizenship_no",
      key: "citizenship_no",
    },
    {
      title: "जाति/समुदाय",
      dataIndex: "caste_ethnicity",
      key: "caste_ethnicity",
    },
    {
      title: "उपभोक्ता समूह",
      dataIndex: "consumer_group",
      key: "consumer_group",
    },
    {
      title: "परिवार सदस्य संख्या",
      dataIndex: "family_size",
      key: "family_size",
    },
    { title: "पेशा", dataIndex: "occupation", key: "occupation" },
    {
      title: "शिक्षा स्तर",
      dataIndex: "education_level",
      key: "education_level",
    },
    { title: "ठेगाना", dataIndex: "address", key: "address" },
    { title: "फोन", dataIndex: "phone", key: "phone" },
    { title: "इमेल", dataIndex: "email", key: "email" },
    {
      title: "सदस्यता मिति",
      dataIndex: "membership_date",
      key: "membership_date",
      render: (val: string) => (val ? new Date(val).toLocaleDateString() : ""),
    },
    { title: "भूमिका", dataIndex: "role", key: "role" },
    {
      title: "सदस्यता स्थिति",
      dataIndex: "status",
      key: "status",
      render: (val: boolean) => (val ? "Active" : "Inactive"),
    },
    {
      title: "दर्ता प्रमाणपत्र/कागजात",
      dataIndex: "registration_doc_url",
      key: "registration_doc_url",
      render: (file: any) =>
        file ? (
          <img
            src={file.url || file.thumbUrl}
            style={{
              width: 50,
              height: 50,
              objectFit: "cover",
              cursor: "pointer",
            }}
            onClick={() => handlePreview(file)}
          />
        ) : null,
    },
    {
      title: "तस्वीर",
      dataIndex: "photo_url",
      key: "photo_url",
      render: (file: any) =>
        file ? (
          <img
            src={file.url || file.thumbUrl}
            style={{
              width: 50,
              height: 50,
              objectFit: "cover",
              cursor: "pointer",
            }}
            onClick={() => handlePreview(file)}
          />
        ) : null,
    },
    {
      title: "आपतकालीन सम्पर्क",
      dataIndex: "emergency_contact",
      key: "emergency_contact",
    },
    {
      title: "वार्षिक योगदान",
      dataIndex: "annual_contribution",
      key: "annual_contribution",
    },
    {
      title: "सदस्यता समाप्ति मिति",
      dataIndex: "membership_expiry_date",
      key: "membership_expiry_date",
      render: (val: string) => (val ? new Date(val).toLocaleDateString() : ""),
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
                status: record?.status ? true : false,
                membership_date: record?.membership_date
                  ? dayjs(record?.membership_date)
                  : null,
                membership_expiry_date: record?.membership_expiry_date
                  ? record?.membership_expiry_date
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
    mutationFn: (data: Omit<any, "id">) =>
      createApi(`${process.env.NEXT_PUBLIC_API_URL}member/`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["member"] });
      toast.success("Member created");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const updateMutation = useMutation({
    mutationFn: (user: any) => updateApi(`member/`, user),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["member"] });
      toast.success("Member updated");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteApi(`member/${id}/`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["member"] });
      toast.success("Member deleted");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleFinish = async (values: any) => {
    const formData = new FormData();

    const payload = {
      ...values,
      membership_date: dayjs(values.membership_date).format("YYYY-MM-DD"),
      membership_expiry_date: dayjs(values.membership_expiry_date).format(
        "YYYY-MM-DD"
      ),
    };

    Object.entries(payload).forEach(([key, val]) => {
      if (val !== undefined && val !== null) {
        formData.append(
          key,
          typeof val === "string" || val instanceof Blob ? val : String(val)
        );
      }
    });

    if (fileList[0]?.originFileObj) {
      formData.append("registration_doc_url", fileList[0].originFileObj);
    }
    if (fileList2[0]?.originFileObj) {
      formData.append("photo_url", fileList2[0].originFileObj);
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

  const uploadButton = (
    <button style={{ border: 0, background: "none" }} type="button">
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );

  type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

  const getBase64 = (img: FileType, callback: (url: string) => void) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => callback(reader.result as string));
    reader.readAsDataURL(img);
  };

  // const handleChange: UploadProps["onChange"] = (info) => {
  //   if (info.file.status === "uploading") {
  //     setLoading(true);
  //     return;
  //   }
  //   if (info.file.status === "done") {
  //     getBase64(info.file.originFileObj as FileType, (url) => {
  //       setLoading(false);
  //       setImageUrl(url);
  //     });
  //   }
  // };

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

  const handleChange = ({ fileList }: { fileList: any[] }) => {
    setFileList(fileList);
  };

  const handleChange2 = ({ fileList }: { fileList: any[] }) => {
    setFileList2(fileList);
  };

  // const handlePreview = async (file: any) => {
  //   const src = file.url || file.thumbUrl;
  //   if (src) {
  //     window.open(src, "_blank");
  //   }
  // };

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

  return (
    <div>
      <AntButton
        type="primary"
        onClick={() => setIsModalOpen(true)}
        icon={<PlusCircleOutlined />}
      >
        Add Member
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
        scroll={{ y: 300, x: "3000px" }}
      />

      <Modal
        width={"90vw"}
        title={editingUser ? "Edit Member" : "Add Member"}
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
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-2">
            <AntInput
              formProps={{
                name: "position_name",
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

            <Form.Item
              name={"date_of_birth"}
              label="जन्म मिति"
              rules={[{ required: true, message: "जन्म मिति" }]}
            >
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>

            <AntInput
              formProps={{
                name: "citizenship_no",
                label: "नागरिकता नम्बर",
                rules: [{ required: true, message: "नागरिकता नम्बर" }],
              }}
            />

            <AntInput
              formProps={{
                name: "caste_ethnicity",
                label: "जाति/समुदाय",
                rules: [{ required: true, message: "जाति/समुदाय" }],
              }}
            />

            <AntInput
              formProps={{
                name: "consumer_group",
                label: "उपभोक्ता समूह",
                rules: [{ required: true, message: "उपभोक्ता समूह" }],
              }}
            />

            <AntInput
              type="number"
              formProps={{
                name: "family_size",
                label: "परिवार सदस्य संख्या",
                rules: [{ required: true, message: "परिवार सदस्य संख्या" }],
              }}
            />

            <AntInput
              formProps={{
                name: "occupation",
                label: "पेशा",
                rules: [{ required: true, message: "पेशा" }],
              }}
            />

            <AntInput
              formProps={{
                name: "education_level",
                label: "शिक्षा स्तर",
                rules: [{ required: true, message: "शिक्षा स्तर" }],
              }}
            />

            <AntInput
              formProps={{
                name: "address",
                label: "ठेगाना",
                rules: [{ required: true, message: "ठेगाना" }],
              }}
            />

            <AntInput
              formProps={{
                name: "phone",
                label: "फोन",
                rules: [{ required: true, message: "फोन" }],
              }}
            />

            <Form.Item
              name="email"
              label="इमेल"
              rules={[{ type: "email", message: "इमेल" }]}
            >
              <Input placeholder="इमेल" autoComplete="off" />
            </Form.Item>

            <Form.Item
              name={"membership_date"}
              label="सदस्यता मिति"
              rules={[{ required: true, message: "सदस्यता मिति" }]}
            >
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>

            <AntInput
              formProps={{
                name: "role",
                label: "भूमिका",
                rules: [{ required: true, message: "भूमिका" }],
              }}
            />
            <AntSwitch
              formProps={{
                name: "status",
                label: "सदस्यता स्थिति",
                initialValue: false,
              }}
            />
            <Form.Item
              name={"registration_doc_url"}
              label="दर्ता प्रमाणपत्र/कागजात"
            >
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

            <Form.Item name={"photo_url"} label="तस्वीर">
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
            <AntInput
              type="number"
              formProps={{
                name: "emergency_contact",
                label: "आपतकालीन सम्पर्क",
              }}
            />

            <AntInputNumber
              type="number"
              formProps={{
                name: "annual_contribution",
                label: "वार्षिक योगदान",
              }}
            />

            <Form.Item
              name={"membership_expiry_date"}
              label="सदस्यता समाप्ति मिति"
              rules={[{ required: true, message: "सदस्यता समाप्ति मिति" }]}
            >
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
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
