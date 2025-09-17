import { Form, FormItemProps } from "antd";

export const AntFormItem = <T,>(props: FormItemProps<T>) => {
  const {
    colon = false,
    validateFirst = true,
    labelCol = {},
    children,
    ...rest
  } = props;

  return (
    <Form.Item
      {...rest}
      colon={colon}
      validateFirst={validateFirst}
      labelCol={{ style: { fontWeight: 600 }, ...labelCol }}
    >
      {children}
    </Form.Item>
  );
};
