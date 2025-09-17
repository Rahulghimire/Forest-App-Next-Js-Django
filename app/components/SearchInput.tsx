import { SearchOutlined } from "@ant-design/icons";
import { InputProps } from "antd";
import { AntInput } from "./AntInput";

interface Props extends Omit<InputProps, "suffix" | "prefix"> {
  width?: number;
  iconPosition?: "left" | "right";
  name?: string;
}
export const SearchInput: React.FC<Props> = (props) => {
  const {
    width = 300,
    placeholder = "Search",
    iconPosition = "left",
    name = "keyword",
    allowClear = true,
    onChange,
  } = props;

  return (
    <AntInput
      className={`rounded-full w-[${width}px]`}
      placeholder={placeholder}
      allowClear={allowClear}
      onChange={onChange}
      data-cy="Search"
      suffix={iconPosition === "right" && <SearchOutlined />}
      prefix={iconPosition === "left" && <SearchOutlined />}
      formProps={{ name }}
    />
  );
};
