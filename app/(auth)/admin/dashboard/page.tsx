"use client";

import { Card, Col, Row, Statistic } from "antd";

export default function Dashboard() {
  return (
    <Row gutter={16}>
      <Col span={6}>
        <Card>
          <Statistic title="Total Forest Area" value={4523} suffix="m" />
        </Card>
      </Col>
      <Col span={6}>
        <Card>
          <Statistic title="Tree Species" value={128} />
        </Card>
      </Col>
      <Col span={6}>
        <Card>
          <Statistic title="Active Rangers" value={54} />
        </Card>
      </Col>
      <Col span={6}>
        <Card>
          <Statistic title="Reports Filed" value={312} />
        </Card>
      </Col>
    </Row>
  );
}
