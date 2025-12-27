import { FormItemProps, Space, Switch, SwitchProps } from "antd";
import { AntFormItem } from "./AntFormItem";

interface Props extends SwitchProps {
  formProps?: FormItemProps;
  label?: string;
}

export const AntSwitch: React.FC<Props> = (props) => {
  const { formProps = {}, label, ...rest } = props;
  const {
    label: formLabel,
    valuePropName = "checked",
    ...restFormProps
  } = formProps;

  return (
    <AntFormItem label={formLabel}>
      <Space size="small">
        <AntFormItem {...restFormProps} valuePropName={valuePropName} noStyle>
          <Switch {...rest} data-cy={formProps?.name} />
        </AntFormItem>
        {label && (
          <span
            className={`tw-whitespace-nowrap tw-font-semibold tw-text-[var(--Dark-Dark-90)] `}
          >
            {label}
          </span>
        )}
      </Space>
    </AntFormItem>
  );
};
