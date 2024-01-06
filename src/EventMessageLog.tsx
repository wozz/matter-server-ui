import React from "react";
import { Col, Row, Table, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";
import { EventMessage } from "./Model";
import JSONPretty from "react-json-pretty";
const { Title } = Typography;

interface EventMessageLogProps {
  eventMessages: EventMessage[];
}

interface EventMessageRow {
  key: number;
  event: string;
  receive_time: string;
  data: string;
}

const columns: ColumnsType<EventMessageRow> = [
  {
    title: "Recv Time",
    dataIndex: "receive_time",
    width: "180px",
  },
  {
    title: "Event",
    dataIndex: "event",
    width: "180px",
  },
  {
    title: "Raw Data",
    dataIndex: "data",
    width: "400px",
    ellipsis: true,
  },
];

const EventMessageLog: React.FC<EventMessageLogProps> = ({ eventMessages }) => {
  const eventMessageData = eventMessages.map((e, i) => ({
    key: i,
    event: e.event.event,
    data: JSON.stringify(e.event.data),
    receive_time: e.receive_time.toLocaleString(),
  }));

  return (
    <>
      <Title level={4}>Event Log</Title>
      <Table
        columns={columns}
        dataSource={eventMessageData}
        pagination={false}
        size="small"
        expandable={{
          expandedRowRender: (record) => (
            <Row>
              <Col span={16} offset={4}>
                <JSONPretty id="row-json" data={record.data} />
              </Col>
            </Row>
          ),
          rowExpandable: (record) => record.data.length > 60,
        }}
      />
    </>
  );
};

export default EventMessageLog;
