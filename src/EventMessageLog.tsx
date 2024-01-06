import React from "react";
import { Col, Row, Table, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";
import { EventMessage, MatterNodeData } from "./Model";
import { nodeProductName, nodeSerialNumber } from "./Attributes";
import JSONPretty from "react-json-pretty";
import DisplayDate from "./DisplayDate";
import AttributeInfoDisplay from "./AttributeInfoDisplay";
const { Text, Title } = Typography;

interface EventMessageLogProps {
  nodeById: (nodeId: number) => MatterNodeData | undefined;
  eventMessages: EventMessage[];
}

interface EventMessageRow {
  key: number;
  event: string;
  receive_time: React.ReactNode;
  data: Object;
  parsed?: React.ReactNode;
  updateInfo?: React.ReactNode;
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
    render: (text, record) => (
      <>
        {record.event === "attribute_updated" && record.updateInfo
          ? record.updateInfo
          : record.event}
      </>
    ),
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
        <AttributeInfoDisplay
          path={attributeUpdate[1]}
          value={attributeUpdate[2]}
        />
      );
    default:
      return JSON.stringify(data);
  }
};

const createUpdateInfo = (
  eventType: string,
  data: Object,
  nodeById: (nodeId: number) => MatterNodeData | undefined,
): React.ReactNode => {
  switch (eventType) {
    case "attribute_updated":
      const attributeUpdate = data as Array<any>;
      const node = nodeById(attributeUpdate[0]);
      if (!node) {
        return <>Node {attributeUpdate[0]} updated</>;
      }
      return (
        <>
          <Text strong>[{attributeUpdate[0]}]</Text>{" "}
          <Text>{nodeProductName(node)}</Text>{" "}
          <Text type="secondary">{nodeSerialNumber(node)}</Text>
        </>
      );
    default:
      return <></>;
  }
};

const EventMessageLog: React.FC<EventMessageLogProps> = ({
  nodeById,
  eventMessages,
}) => {
  const totalMessages = eventMessages.length;
  const eventMessageData: EventMessageRow[] = eventMessages.map((e, i) => ({
    key: totalMessages - i,
    event: e.event.event,
    data: e.event.data,
    receive_time: <DisplayDate reverse date={e.receive_time.toUTCString()} />,
    parsed: parseEvent(e.event.event, e.event.data),
    updateInfo: createUpdateInfo(e.event.event, e.event.data, nodeById),
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
