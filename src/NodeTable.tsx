import React, { useState } from "react";
import {
  Badge,
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
  DeleteOutlined,
  EnterOutlined,
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
  commissionWithCode: (code: string) => void;
}

type RemoveNodeType = {
  node_id?: string;
};

type CommissionType = {
  code?: string;
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
  commissionWithCode,
}) => {
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [selectedNodeData, setSelectedNodeData] =
    useState<MatterNodeData | null>(null);
  const [removeNodeOpen, setRemoveNodeOpen] = useState<boolean>(false);
  const [commissionOpen, setCommissionOpen] = useState<boolean>(false);

  const handleRemoveNodeOpenChange = (newOpen: boolean) => {
    setRemoveNodeOpen(newOpen);
  };
  const handleCommissionOpenChange = (newOpen: boolean) => {
    setCommissionOpen(newOpen);
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

  const onCommissionFinish = (values: any) => {
    console.log(`form values: ${JSON.stringify(values)}`);
    commissionWithCode(values.code);
    setCommissionOpen(false);
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
          <Tooltip title="interview node">
            <Button
              onClick={() => onInterviewNode(record.node_id)}
              type="primary"
              size="small"
              shape="circle"
              icon={<MonitorOutlined />}
            />
          </Tooltip>
          <Tooltip title="raw data">
            <Button
              onClick={() => showModal(record.node_id)}
              type="default"
              size="small"
              shape="circle"
              icon={<ProfileOutlined />}
            />
          </Tooltip>
          <Tooltip title="reload node">
            <Button
              shape="circle"
              size="small"
              onClick={() => reloadNode(record.node_id)}
              icon={<ReloadOutlined />}
            />
          </Tooltip>
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
    removeNode(Number(values.node_id));
    setRemoveNodeOpen(false);
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
              <Popover
                content={
                  <>
                    <Form
                      layout="inline"
                      onFinish={onCommissionFinish}
                      autoComplete="off"
                    >
                      <Form.Item<CommissionType> label="Code" name="code">
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
                title="Commission with Code"
                trigger="click"
                open={commissionOpen}
                onOpenChange={handleCommissionOpenChange}
              >
                <Button
                  shape="circle"
                  size="small"
                  icon={<PlusCircleOutlined />}
                />
              </Popover>
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
        />
      </Modal>
    </>
  );
};

export default NodeTable;
