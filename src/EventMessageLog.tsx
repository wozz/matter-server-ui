import React from "react";
import { Col, Row, Table, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";
import { EventMessage } from "./Model";
import JSONPretty from "react-json-pretty";
import DisplayDate from "./DisplayDate";
const { Title } = Typography;

interface EventMessageLogProps {
  eventMessages: EventMessage[];
}

interface EventMessageRow {
  key: number;
  event: string;
  receive_time: React.ReactNode;
  data: Object;
  parsed?: React.ReactNode;
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
    width: "160px",
  },
  {
    title: "Details",
    dataIndex: "parsed",
    width: "400px",
    ellipsis: true,
    render: (text, record) => (
      <>{record.parsed ? record.parsed : JSON.stringify(record.data)}</>
    ),
  },
];

const parseEvent = (eventType: string, data: Object): React.ReactNode => {
  switch (eventType) {
    case "attribute_updated":
      const attributeUpdate = data as Array<any>;
      return (
        <>
          Node: {attributeUpdate[0]} Attribute: {attributeUpdate[1]} Value:{" "}
          {String(attributeUpdate[2])}
        </>
      );
    default:
      return JSON.stringify(data);
  }
};

const EventMessageLog: React.FC<EventMessageLogProps> = ({ eventMessages }) => {
  const eventMessageData: EventMessageRow[] = eventMessages.map((e, i) => ({
    key: i,
    event: e.event.event,
    data: e.event.data,
    receive_time: <DisplayDate reverse date={e.receive_time.toUTCString()} />,
    parsed: parseEvent(e.event.event, e.event.data),
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
          rowExpandable: (record) =>
            record.event === "attribute_updated" ||
            JSON.stringify(record.data).length > 60,
          expandRowByClick: true,
        }}
      />
    </>
  );
};

export default EventMessageLog;
