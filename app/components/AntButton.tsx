import { Button, ConfigProvider } from "antd";
import React, { ReactNode } from "react";

const Colors: Record<string, string> = {
  green: "#10a96ff1",
  red: "#ff4d4f",
  white: "#ffffff",
  lightGreen: "#ecaa29",
  darkRed: "#b00020",
  yellow: "#ffc107",
  skyBlue: "#87CEEB",
  blue: "#00008B",
  lightGoldenYellow: "#FAFAD2",
};

interface Props {
  color?: keyof typeof Colors;
  iconPosition?: "start" | "end";
  children?: ReactNode;
  onClick?: any;
  type?: "primary" | "link" | "text" | "default" | "dashed";
  ref?: any;
  icon?: ReactNode;
  loading?: boolean;
  htmlType?: "button" | "submit" | "reset";
  block?: boolean;
}
export const AntButton = React.forwardRef<any, Props>(
  (
    {
      type = "primary",
      color = "green",
      children,
      iconPosition = "start",
      onClick,
      icon,
      ...rest
    },
    ref
  ) => {
    const colorPrimary = Colors?.[color];

    return (
      <ConfigProvider theme={{ token: { colorPrimary } }}>
        <Button
          type={type}
          {...rest}
          ref={ref}
          onClick={onClick}
          icon={icon}
          loading={rest.loading || false}
          iconPosition={iconPosition}
          htmlType={rest.htmlType}
        >
          {children}
        </Button>
      </ConfigProvider>
    );
  }
);

AntButton.displayName = "AntButton";
