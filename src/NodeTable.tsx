import React, { useState } from "react";
import { Badge, Col, Modal, Row, Space, Table, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";
import { MatterNodeData } from "./Model";
import {
  DeleteOutlined,
  DeploymentUnitOutlined,
  MonitorOutlined,
  PartitionOutlined,
  PlusCircleOutlined,
  ProfileOutlined,
  ReloadOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import {
  nodeVendorName,
  nodeProductName,
  nodeSerialNumber,
} from "./Attributes";
import DisplayDate from "./DisplayDate";
import JSONPretty from "react-json-pretty";
import TooltipButton from "./TooltipButton";
import PopoverButton from "./PopoverButton";
import NodeData from "./NodeData";
const { Text, Title } = Typography;

var JSONPrettyMon = require("react-json-pretty/dist/monikai");

interface NodeTableProps {
  nodes: MatterNodeData[];
  onInterviewNode: (nodeId: number) => void;
  reloadNodes: () => void;
  reloadNode: (nodeId: number) => void;
  discover: () => void;
  removeNode: (nodeId: number) => void;
  commissionWithCode: (code: string) => void;
}

interface ColumnData {
  key: number | string;
  node_id: number;
  available: string;
  is_bridge: boolean;
  last_interviewed: React.ReactNode;
  vendor: string;
  product_name: string;
  serial_number: string;
}

const NodeTable: React.FC<NodeTableProps> = ({
  nodes,
  onInterviewNode,
  reloadNodes,
  reloadNode,
  discover,
  removeNode,
  commissionWithCode,
}) => {
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [isNodeModalVisible, setIsNodeModalVisible] = useState<boolean>(false);
  const [selectedNodeData, setSelectedNodeData] =
    useState<MatterNodeData | null>(null);

  const showModal = (nodeId: number) => {
    const nodeData = nodes.find((n) => {
      return n.node_id === nodeId;
    });
    if (!nodeData) {
      console.error(`node not found ${nodeId}`);
      return;
    }
    setSelectedNodeData(nodeData);
    setIsModalVisible(true);
  };

  const showNodeModal = (nodeId: number) => {
    const nodeData = nodes.find((n) => {
      return n.node_id === nodeId;
    });
    if (!nodeData) {
      console.error(`node not found ${nodeId}`);
      return;
    }
    setSelectedNodeData(nodeData);
    setIsNodeModalVisible(true);
  };

  const onCommissionSubmit = (values: any) => {
    console.log(`form values: ${JSON.stringify(values)}`);
    commissionWithCode(values.code);
  };

  const columns: ColumnsType<ColumnData> = [
    {
      title: "ID",
      dataIndex: "node_id",
      width: "50px",
    },
    {
      title: "Available",
      dataIndex: "available",
      width: "80px",
      render: (text, record) => (
        <Badge
          count={record.is_bridge ? <PartitionOutlined /> : 0}
          offset={[8, 2]}
        >
          {record.available}
        </Badge>
      ),
    },
    {
      title: "Last Interview",
      dataIndex: "last_interviewed",
      width: "150px",
    },
    {
      title: "Vendor",
      dataIndex: "vendor",
      width: "150px",
    },
    {
      title: "Product Name",
      dataIndex: "product_name",
      width: "240px",
    },
    {
      title: "Serial",
      dataIndex: "serial_number",
      width: "150px",
      render: (text, record) => (
        <>{record.serial_number && <Text code>{record.serial_number}</Text>}</>
      ),
    },
    {
      title: "",
      key: "action",
      width: "150px",
      render: (text, record) => (
        <Space>
          <TooltipButton
            tooltipTitle="view node info"
            onClick={() => showNodeModal(record.node_id)}
            type="primary"
            icon={<DeploymentUnitOutlined />}
          />
          <TooltipButton
            tooltipTitle="interview node"
            onClick={() => onInterviewNode(record.node_id)}
            icon={<MonitorOutlined />}
          />
          <TooltipButton
            tooltipTitle="raw data"
            onClick={() => showModal(record.node_id)}
            icon={<ProfileOutlined />}
          />
          <TooltipButton
            tooltipTitle="reload node"
            onClick={() => reloadNode(record.node_id)}
            icon={<ReloadOutlined />}
          />
        </Space>
      ),
    },
  ];

  const nodeTableData: ColumnData[] = nodes.map((n, i) => ({
    key: i,
    node_id: n.node_id,
    available: n.available ? "online" : "unavailable",
    is_bridge: n.is_bridge,
    last_interviewed: <DisplayDate date={n.last_interview} />,
    vendor: nodeVendorName(n),
    product_name: nodeProductName(n),
    serial_number: nodeSerialNumber(n),
  }));
  const onRemoveNodeSubmit = (values: any) => {
    console.log(`form values: ${JSON.stringify(values)}`);
    removeNode(Number(values.node_id));
  };

  return (
    <>
      <Space direction="vertical">
        <Row align="bottom">
          <Col flex="auto">
            <Title level={4}>Nodes</Title>
          </Col>
          <Col flex="50px">
            <Space>
              <PopoverButton
                inputLabel="Code"
                inputName="code"
                onSubmit={onCommissionSubmit}
                buttonIcon={<PlusCircleOutlined />}
                popoverTitle="Commission with Code"
              />
              <PopoverButton
                inputLabel="Node ID"
                inputName="node_id"
                onSubmit={onRemoveNodeSubmit}
                buttonIcon={<DeleteOutlined />}
                popoverTitle="Remove Node by ID"
              />
              <TooltipButton
                tooltipTitle="discover nodes"
                onClick={discover}
                icon={<SearchOutlined />}
              />
              <TooltipButton
                tooltipTitle="reload nodes"
                onClick={reloadNodes}
                icon={<ReloadOutlined />}
              />
            </Space>
          </Col>
        </Row>
        <Table
          columns={columns}
          dataSource={nodeTableData}
          pagination={false}
          size="small"
        />
      </Space>
      <Modal
        title="Node Info"
        open={isNodeModalVisible}
        onOk={() => setIsNodeModalVisible(false)}
        onCancel={() => setIsNodeModalVisible(false)}
        width={800}
      >
        <NodeData data={selectedNodeData} />
      </Modal>
      <Modal
        title="Node Raw Data"
        open={isModalVisible}
        onOk={() => setIsModalVisible(false)}
        onCancel={() => setIsModalVisible(false)}
        width={800}
      >
        <JSONPretty
          id="json-pretty"
          data={selectedNodeData}
          theme={JSONPrettyMon}
        />
      </Modal>
    </>
  );
};

export default NodeTable;
