import React from "react";
import { Card, Descriptions, Spin } from "antd";
import type { DescriptionsProps } from "antd";
import { ServerInfoMessage } from "./Model";

interface ServerInfoCellProps {
  serverInfo: ServerInfoMessage | null;
}

const ServerInfoCell: React.FC<ServerInfoCellProps> = ({ serverInfo }) => {
  const serverInfoItems = (
    serverInfo: ServerInfoMessage,
  ): DescriptionsProps["items"] => {
    return [
      {
        key: "1",
        label: "Fabric ID",
        children: serverInfo.fabric_id,
      },
      {
        key: "2",
        label: "Compressed Fabric ID",
        children: serverInfo.compressed_fabric_id,
      },
      {
        key: "3",
        label: "Schema Version",
        children: serverInfo.schema_version,
      },
      {
        key: "4",
        label: "Min Supported Schema",
        children: serverInfo.min_supported_schema_version,
      },
      {
        key: "5",
        label: "SDK Version",
        children: serverInfo.sdk_version,
      },
    ]; // TODO add wifi/thread credentials set
  };

  return (
    <Card>
      {serverInfo && (
        <Descriptions
          title="Server Information"
          layout="vertical"
          items={serverInfoItems(serverInfo)}
          size="small"
          bordered
        />
      )}
      {!serverInfo && <Spin />}
    </Card>
  );
};

export default ServerInfoCell;
