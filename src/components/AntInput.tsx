"use client";

import { FormItemProps, Input, InputProps } from "antd";
import { getNepaliFromEnglish } from "nepali-input-react";
import { Rule } from "rc-field-form/lib/interface";
import { AntFormItem } from "./AntFormItem";

interface Props extends Omit<InputProps, "name"> {
  formProps?: FormItemProps;
  useEnglish?: boolean;
}

export const AntInput: React.FC<Props> = (props) => {
  const {
    formProps = {},
    placeholder = "Please enter",
    allowClear = true,
    useEnglish = false,
    ...rest
  } = props;

  const isRuleRequired = (rule: Rule): boolean => {
    return "required" in rule && !!rule.required;
  };

  const isRequired = formProps?.rules?.some(isRuleRequired);

  const addonBefore =
    isRequired && props.addonBefore ? (
      <div className="tw-flex">
        <div className="tw-mr-1 tw-font-['SimSun'] tw-text-[#ff4d4f] tw-text-[12px]">
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
        placeholder={placeholder}
        data-cy={formProps?.name}
        onInput={(e) => {
          const target = e.target as HTMLInputElement;
          target.value = useEnglish
            ? target.value
            : getNepaliFromEnglish(target.value);
        }}
        addonBefore={addonBefore}
      />
    </AntFormItem>
  );
};
