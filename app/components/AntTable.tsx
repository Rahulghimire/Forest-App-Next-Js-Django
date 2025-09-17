import { Form, Input, Table, TableProps } from "antd";

export const AntTable = <T extends object>(props: TableProps<T>) => {
  const { pagination, columns, loading, ...rest } = props;
  const form = Form.useFormInstance();

  const handleTableChange = (pagination: any) => {
    form?.setFieldsValue({
      page: pagination.current,
      per_page: pagination.pageSize,
    });
    form?.submit();
  };

  return (
    <div>
      <Form.Item name="page" style={{ display: "none" }}>
        <Input type="hidden" />
      </Form.Item>
      <Form.Item name="per_page" style={{ display: "none" }}>
        <Input type="hidden" />
      </Form.Item>
      <Table
        {...rest}
        columns={columns}
        loading={loading}
        onChange={handleTableChange}
        pagination={
          pagination
            ? {
                ...pagination,
                current: form?.getFieldValue("page") || 1,
                pageSize: form?.getFieldValue("per_page") || 10,
                showLessItems: true,
                showTotal: (total, range) => (
                  <span className="tw-absolute tw-left-1">{`Showing ${range[0]} to ${range[1]} of ${total} entries`}</span>
                ),
              }
            : false
        }
      />
    </div>
  );
};
