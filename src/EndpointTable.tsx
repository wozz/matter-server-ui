import React from "react";
import { Table, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";
import { MatterNodeData } from "./Model";
const { Text } = Typography;

interface EndpointTableProps {
  nodes: MatterNodeData[];
}

interface ColumnData {
  key: string;
  endpoint_id: string;
  vendor: string;
  product: string;
  serial_number: string;
}

const EndpointTable: React.FC<EndpointTableProps> = ({ nodes }) => {
  const columns: ColumnsType<ColumnData> = [
    {
      title: "ID",
      dataIndex: "endpoint_id",
      width: "20px",
    },
    {
      title: "Vendor",
      dataIndex: "vendor",
      width: "100px",
    },
    {
      title: "Product",
      dataIndex: "product",
      width: "150px",
    },
    {
      title: "Serial",
      dataIndex: "serial_number",
      width: "100px",
      render: (text, record) => (
        <>{record.serial_number && <Text code>{record.serial_number}</Text>}</>
      ),
    },
  ];

  const endpointTableData: ColumnData[] = nodes.flatMap((n, i) => {
    if (!n.is_bridge) {
      return [];
    }
    return Object.entries(n.attributes)
      .filter(([k, _]) => {
        return k.match(/^\d+\/57\/1$/);
      })
      .map(([k, v], ii) => {
        const endpointId = parseInt(k.split("/")[0], 10);
        return {
          key: `${i}-${ii}`,
          endpoint_id: `${n.node_id}-${endpointId}`,
          vendor: v,
          product: n.attributes[`${endpointId}/57/3`],
          serial_number: n.attributes[`${endpointId}/57/15`],
        };
      });
  });

  return (
    <>
      <h2>Endpoints</h2>
      <Table
        columns={columns}
        dataSource={endpointTableData}
        pagination={false}
        size="small"
      />
    </>
  );
};

export default EndpointTable;
