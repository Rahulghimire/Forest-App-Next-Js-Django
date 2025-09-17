import { FormItemProps, InputNumber, InputNumberProps } from "antd";
import { AntFormItem } from "./AntFormItem";

interface Props extends Omit<InputNumberProps, "name"> {
  formProps?: FormItemProps;
}

export const AntInputNumber: React.FC<Props> = (props) => {
  const { formProps = {}, controls = false, className, ...rest } = props;

  return (
    <AntFormItem<InputNumberProps> {...formProps}>
      <InputNumber
        {...rest}
        controls={controls}
        data-cy={formProps?.name}
        className={`!w-full ${className}`}
      />
    </AntFormItem>
  );
};
