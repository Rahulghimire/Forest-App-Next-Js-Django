import { Card } from "antd";
import React from "react";

interface Props {
  children: React.ReactNode;
  loading: boolean;
}

export const AntCard: React.FC<Props> = (props) => {
  const { children, loading } = props;

  return <Card loading={loading}>{children}</Card>;
};
