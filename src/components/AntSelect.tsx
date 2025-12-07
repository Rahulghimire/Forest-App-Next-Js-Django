import { FormItemProps, Select, SelectProps, Tooltip } from "antd";
import { AntFormItem } from "./AntFormItem";
import {
  DownOutlined,
  PlayCircleTwoTone,
  PlusCircleFilled,
} from "@ant-design/icons";
import { AntButton } from "./AntButton";

interface Props<T> extends Omit<SelectProps<T>, "options"> {
  isWYSIWYGMode?: boolean;
  prefixName?: string;
  formProps?: FormItemProps;
  array: T[];
  renderKey: keyof T;
  valueKey: keyof T;
  children?: React.ReactNode;
  AddButton?: React.ReactNode;
  showAddButton?: boolean;
  handleClick?: () => void;
}

/**
 * AntSelect component for rendering a customized Ant Design select component.
 * @template T Type of items in the `array` prop.
 * @param props Props for configuring the AntSelect component.
 */
export const AntSelect = <T,>(props: Props<T>) => {
  const {
    prefixName,
    formProps,
    className,
    mode,
    children,
    renderKey,
    placeholder = "Please select",
    valueKey,
    array = [],
    handleClick = null,
    showAddButton = false,
    isWYSIWYGMode = false,
    onChange,
    ...rest
  } = props;

  const parser = new DOMParser();

  return (
    <div className="tw-flex tw-items-start">
      <AntFormItem<SelectProps>
        className="tw-w-full tw-min-w-12"
        {...formProps}
      >
        <Select
          suffixIcon={<DownOutlined className=" !text-[#000000]" />}
          // allowClear={true}
          showSearch={true}
          placeholder={placeholder}
          prefix={prefixName || null}
          className={`!tw-w-full  ${className}`}
          optionFilterProp="children"
          filterOption={(input: any, option: any) => {
            return option[renderKey]
              ?.toLowerCase()
              ?.startsWith(input.toLowerCase());
          }}
          mode={mode}
          popupRender={(menu) => (
            <>
              {menu}
              {/* {showAddButton && ( */}
              <div className="pt-2">
                <AntButton
                  block
                  onClick={() => {
                    handleClick?.();
                  }}
                >
                  Add New <PlayCircleTwoTone />
                </AntButton>
              </div>
              {/* )} */}
            </>
          )}
          {...(mode === "multiple" && {
            maxTagCount: "responsive",
            maxTagPlaceholder: (omittedValues: any) => {
              const tooltipData = omittedValues
                ?.map((item: any) => item?.label?.props?.children)
                ?.join(", ");
              return (
                <Tooltip zIndex={99999} title={tooltipData}>
                  <>{`+${omittedValues?.length}...`}</>
                </Tooltip>
              );
            },
          })}
          onChange={onChange}
          {...rest}
        >
          {array.map((item, index) => (
            <Select.Option key={index} value={item[valueKey]} {...item}>
              {isWYSIWYGMode ? (
                <div
                  dangerouslySetInnerHTML={{
                    __html: parser.parseFromString(
                      item[renderKey] as string,
                      "text/html"
                    ).body?.innerHTML,
                  }}
                />
              ) : (
                <>{String(item[renderKey])}</>
              )}
            </Select.Option>
          ))}
          {children}
        </Select>
      </AntFormItem>
    </div>
  );
};
