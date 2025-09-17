import { FormItemProps, Input, InputProps } from "antd";
import { Rule } from "rc-field-form/lib/interface";
import { AntFormItem } from "./AntFormItem";

interface Props extends Omit<InputProps, "name"> {
  formProps?: FormItemProps;
}

export const AntInput: React.FC<Props> = (props) => {
  const { formProps = {}, allowClear = true, ...rest } = props;

  const isRuleRequired = (rule: Rule): boolean => {
    return "required" in rule && !!rule.required;
  };

  const isRequired = formProps?.rules?.some(isRuleRequired);

  const addonBefore =
    isRequired && props.addonBefore ? (
      <div className="tw-flex">
        <div className="tw-font-['SimSun'] tw-text-[12px] tw-text-[#ff4d4f] tw-mr-1">
          *
        </div>
        <div>{props.addonBefore}</div>
      </div>
    ) : (
      props.addonBefore
    );

  return (
    <AntFormItem<InputProps> {...formProps}>
      <Input
        {...rest}
        allowClear={allowClear}
        data-cy={formProps?.name}
        addonBefore={addonBefore}
      />
    </AntFormItem>
  );
};
