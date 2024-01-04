import React from "react";
import { Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { EventMessage } from "./Model";

interface EventMessageLogProps {
  eventMessages: EventMessage[];
}

const columns: ColumnsType<EventMessage> = [
  {
    title: "Event",
    dataIndex: "event",
    width: "180px",
  },
  {
    title: "Raw Data",
    dataIndex: "data",
    width: "600px",
  },
];

const EventMessageLog: React.FC<EventMessageLogProps> = ({ eventMessages }) => {
  const eventMessageData = eventMessages.map((e, i) => ({
    key: i,
    event: e.event,
    data: JSON.stringify(e.data),
  }));

  return (
    <>
      <h2>Event Log</h2>
      <Table
        columns={columns}
        dataSource={eventMessageData}
        pagination={false}
        size="small"
      />
    </>
  );
};

export default EventMessageLog;
