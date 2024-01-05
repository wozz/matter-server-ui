import React, { useState } from "react";
import {
  Button,
  Col,
  Form,
  Input,
  Modal,
  Popover,
  Row,
  Space,
  Table,
  Tooltip,
  Typography,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { MatterNodeData } from "./Model";
import {
  CheckSquareOutlined,
  DeleteOutlined,
  EnterOutlined,
  ReloadOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import {
  nodeVendorName,
  nodeProductName,
  nodeSerialNumber,
} from "./Attributes";
import moment from "moment";
import JSONPretty from "react-json-pretty";
const { Text, Title } = Typography;

var JSONPrettyMon = require("react-json-pretty/dist/monikai");

interface NodeTableProps {
  nodes: MatterNodeData[];
  onInterviewNode: (nodeId: number) => void;
  reloadNodes: () => void;
  reloadNode: (nodeId: number) => void;
  discover: () => void;
  removeNode: (nodeId: number) => void;
}

type RemoveNodeType = {
  node_id?: string;
};

interface ColumnData {
  key: number | string;
  node_id: number;
  available: string;
  is_bridge: boolean;
  last_interviewed: string;
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
}) => {
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [selectedNodeData, setSelectedNodeData] =
    useState<MatterNodeData | null>(null);
  const [removeNodeOpen, setRemoveNodeOpen] = useState<boolean>(false);

  const handleRemoveNodeOpenChange = (newOpen: boolean) => {
    setRemoveNodeOpen(newOpen);
  };

  const showModal = (nodeId: number) => {
    const nodeData = nodes.find((n) => {
      return n.node_id === nodeId;
    });
    if (!nodeData) {
      return;
    }
    setSelectedNodeData(nodeData);
    setIsModalVisible(true);
  };

  const columns: ColumnsType<ColumnData> = [
    {
      title: "ID",
      dataIndex: "node_id",
      width: "20px",
    },
    {
      title: "Available",
      dataIndex: "available",
      width: "50px",
    },
    {
      title: "Bridge",
      dataIndex: "is_bridge",
      width: "50px",
      render: (text, record) => (
        <>{record.is_bridge && <CheckSquareOutlined />}</>
      ),
    },
    {
      title: "Last Interview",
      dataIndex: "last_interviewed",
      width: "100px",
    },
    {
      title: "Vendor",
      dataIndex: "vendor",
      width: "100px",
    },
    {
      title: "Product Name",
      dataIndex: "product_name",
      width: "200px",
    },
    {
      title: "Serial",
      dataIndex: "serial_number",
      width: "130px",
      render: (text, record) => (
        <>{record.serial_number && <Text code>{record.serial_number}</Text>}</>
      ),
    },
    {
      title: "",
      key: "action",
      render: (text, record) => (
        <Space>
          <Button
            onClick={() => onInterviewNode(record.node_id)}
            type="primary"
            size="small"
          >
            Interview Node
          </Button>
          <Button
            onClick={() => showModal(record.node_id)}
            type="default"
            size="small"
          >
            Raw Data
          </Button>
          <Button
            shape="circle"
            size="small"
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
    last_interviewed: moment.utc(n.last_interview).fromNow(),
    vendor: nodeVendorName(n),
    product_name: nodeProductName(n),
    serial_number: nodeSerialNumber(n),
  }));
  const onRemoveNodeFinish = (values: any) => {
    console.log(`form values: ${JSON.stringify(values)}`);
    removeNode(values.node_id);
    setRemoveNodeOpen(false);
  };

  return (
    <>
      <Space direction="vertical">
        <Row align="bottom">
          <Col flex="auto">
            <Title level={2}>Nodes</Title>
          </Col>
          <Col flex="50px">
            <Space>
              <Popover
                content={
                  <>
                    <Form
                      layout="inline"
                      onFinish={onRemoveNodeFinish}
                      autoComplete="off"
                    >
                      <Form.Item<RemoveNodeType> label="Node ID" name="node_id">
                        <Input />
                      </Form.Item>
                      <Form.Item>
                        <Button
                          htmlType="submit"
                          type="primary"
                          size="small"
                          shape="circle"
                          icon={<EnterOutlined />}
                        />
                      </Form.Item>
                    </Form>
                  </>
                }
                title="Remove Node by ID"
                trigger="click"
                open={removeNodeOpen}
                onOpenChange={handleRemoveNodeOpenChange}
              >
                <Button shape="circle" size="small" icon={<DeleteOutlined />} />
              </Popover>
              <Tooltip title="discover nodes">
                <Button
                  shape="circle"
                  size="small"
                  onClick={discover}
                  icon={<SearchOutlined />}
                />
              </Tooltip>
              <Tooltip title="reload nodes">
                <Button
                  shape="circle"
                  size="small"
                  onClick={reloadNodes}
                  icon={<ReloadOutlined />}
                />
              </Tooltip>
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
        ></JSONPretty>
      </Modal>
    </>
  );
};

export default NodeTable;
