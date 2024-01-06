import React, { useCallback, useEffect, useState } from "react";
import {
  Col,
  ConfigProvider,
  Flex,
  FloatButton,
  Layout,
  Modal,
  notification,
  Row,
  Space,
} from "antd";
import ServerInfoCell from "./ServerInfoCell";
import EventMessagesLog from "./EventMessageLog";
import NodeTable from "./NodeTable";
import EndpointTable from "./EndpointTable";
import SettingsForm from "./SettingsForm";
import "./App.css";
import WebSocketService from "./WebSocketService";
import {
  ServerInfoMessage,
  isServerInfo,
  EventMessage,
  ServerEventMessage,
  EventType,
  isEvent,
  MatterNodeData,
  NotificationType,
  SuccessResultMessage,
  WebSocketConfig,
} from "./Model";
import { HomeOutlined, InfoOutlined, SettingOutlined } from "@ant-design/icons";
const { Header } = Layout;

function App() {
  const [messages, setMessages] = useState<string[]>([]);
  const [socketService, setSocketService] = useState<WebSocketService | null>(
    null,
  );
  const [serverInfo, setServerInfo] = useState<ServerInfoMessage | null>(null);
  const [eventMessages, setEventMessages] = useState<EventMessage[]>([]);
  const [allNodes, setAllNodes] = useState<MatterNodeData[]>([]);
  const [webSocketConfig, setWebSocketConfig] = useState<WebSocketConfig>({
    host: "",
    port: "",
  });
  const [showSettings, setShowSettings] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [api, contextHolder] = notification.useNotification();

  const openNotificationWithIcon = useCallback(
    (type: NotificationType, title: string, message: string) => {
      api[type]({
        message: title,
        description: message,
      });
    },
    [api],
  );

  useEffect(() => {
    const savedHost = localStorage.getItem("websocketHost");
    const savedPort = localStorage.getItem("websocketPort");

    console.log(`savedHost: ${savedHost} / savedPort: ${savedPort}`);
    if (savedHost && savedPort) {
      console.log(`setWebSocketConfig`);
      setWebSocketConfig({ host: savedHost, port: savedPort });
    } else {
      setShowSettings(true);
    }
  }, []);

  const handleAllNodes = (msg: SuccessResultMessage) => {
    setAllNodes(msg.result);
  };

  const handleUpdatedNode = (newNode: MatterNodeData) => {
    setAllNodes((currentNodes) => {
      return currentNodes.map((n) =>
        n.node_id === newNode.node_id ? newNode : n,
      );
    });
  };

  const handleNewNode = (newNode: MatterNodeData) => {
    setAllNodes((currentNodes) => {
      return [...currentNodes, newNode];
    });
  };

  const handleCommissionResponse = (msg: SuccessResultMessage) => {
    handleNewNode(msg.result);
  };

  const handleGetNodeResponse = (msg: SuccessResultMessage) => {
    handleUpdatedNode(msg.result);
  };

  const handleDiscoverResponse = (msg: SuccessResultMessage) => {
    console.dir(msg.result);
  };

  useEffect(() => {
    if (!webSocketConfig.host || !webSocketConfig.port) {
      console.log("web socket config not setup yet");
      return;
    }
    const service = new WebSocketService(
      `ws://${webSocketConfig.host}:${webSocketConfig.port}/ws`,
      handleAllNodes,
      openNotificationWithIcon,
    );
    service.setOnMessageListener((event) => {
      const data = JSON.parse(event.data);
      if (isServerInfo(data)) {
        setServerInfo(data);
      } else if (isEvent(data)) {
        const event = data as ServerEventMessage;
        if (event.event === EventType.NODE_UPDATED) {
          const eventNodeData = event.data as MatterNodeData;
          handleUpdatedNode(eventNodeData);
          return;
        }
        const eventMsg: EventMessage = {
          receive_time: new Date(),
          event: event,
        };
        setEventMessages((prevMessages) => [...prevMessages, eventMsg]);
      } else {
        setMessages((prevMessages) => [...prevMessages, event.data]);
      }
    });
    setSocketService(service);

    return () => {
      service.closeConnection();
    };
  }, [webSocketConfig, openNotificationWithIcon]);

  const handleSettingsSave = (config: WebSocketConfig) => {
    setWebSocketConfig(config);
    setShowSettings(false);
  };

  const handleReloadNodes = () => {
    openNotificationWithIcon(
      "info",
      "Reloading Nodes",
      "sending get_nodes command to server",
    );
    console.log("reloading nodes");
    if (socketService) {
      socketService.sendCommand("get_nodes", {}, handleAllNodes);
    } else {
      openNotificationWithIcon(
        "error",
        "Reload Nodes Failed",
        "server connection not established",
      );
      console.error("connection not established");
    }
  };

  const handleReloadNode = (nodeId: number) => {
    console.log(`reloading node: ${nodeId}`);
    if (socketService) {
      socketService.sendCommand(
        "get_node",
        { node_id: nodeId },
        handleGetNodeResponse,
      );
    } else {
      openNotificationWithIcon(
        "error",
        "Reload Node Failed",
        "server connection not established",
      );
      console.error("connection not established");
    }
  };

  const handleDiscover = () => {
    console.log("discovering nodes...");
    if (socketService) {
      socketService.sendCommand("discover", {}, handleDiscoverResponse);
    } else {
      openNotificationWithIcon(
        "error",
        "Discover Failed",
        "server connection not established",
      );
      console.error("connection not established");
    }
  };

  const handleInterviewNode = (nodeId: number) => {
    console.log(`interviewing node: ${nodeId}`);
    if (socketService) {
      socketService.sendCommand(
        "interview_node",
        { node_id: nodeId },
        (data) => {
          console.log(`node interview complete: ${JSON.stringify(data)}`);
        },
      );
    } else {
      openNotificationWithIcon(
        "error",
        "Interview Node Failed",
        "server connection not established",
      );
      console.error("connection not established");
    }
  };

  const handleRemoveNode = (nodeId: number) => {
    console.log(`remove node: ${nodeId}`);
    if (socketService) {
      socketService.sendCommand("remove_node", { node_id: nodeId }, (data) => {
        console.log(`node remove complete: ${JSON.stringify(data)}`);
      });
    } else {
      openNotificationWithIcon(
        "error",
        "Remove Node Failed",
        "server connection not established",
      );
      console.error("connection not established");
    }
  };

  const handleCommissionWithCode = (code: string) => {
    console.log(`commission with code`);
    if (socketService) {
      socketService.sendCommand(
        "commission_with_code",
        { code: code, network_only: true },
        handleCommissionResponse,
      );
    } else {
      openNotificationWithIcon(
        "error",
        "Commission Failed",
        "server connection not established",
      );
      console.error("connection not established");
    }
  };

  const hasBridgeNodes = allNodes.some((n) => {
    return n.is_bridge;
  });

  return (
    <ConfigProvider
      theme={{
        components: {
          Layout: {
            headerBg: "grey",
            headerColor: "white",
          },
        },
      }}
    >
      <Layout>
        <Header>
          <Space>
            <HomeOutlined /> Matter Server UI
          </Space>
        </Header>
        {contextHolder}
        {showSettings ? (
          <Flex justify="center">
            <SettingsForm onSave={handleSettingsSave} />
          </Flex>
        ) : (
          <Flex justify="space-around">
            <Row justify="center">
              <Col span={20}>
                <Space
                  direction="vertical"
                  size="middle"
                  style={{ display: "flex" }}
                >
                  <Modal
                    closable={false}
                    open={showInfo}
                    onOk={() => setShowInfo(false)}
                    onCancel={() => setShowInfo(false)}
                  >
                    <ServerInfoCell serverInfo={serverInfo} />
                  </Modal>
                  {messages.length > 0 && (
                    <>
                      <h1>Unknown Messages:</h1>
                      {messages.map((message, index) => (
                        <div key={index}>{message}</div>
                      ))}
                    </>
                  )}
                  <NodeTable
                    nodes={allNodes}
                    onInterviewNode={handleInterviewNode}
                    reloadNodes={handleReloadNodes}
                    reloadNode={handleReloadNode}
                    discover={handleDiscover}
                    removeNode={handleRemoveNode}
                    commissionWithCode={handleCommissionWithCode}
                  />
                  {hasBridgeNodes && <EndpointTable nodes={allNodes} />}
                  <EventMessagesLog eventMessages={eventMessages} />
                </Space>
              </Col>
            </Row>
          </Flex>
        )}

        <FloatButton.Group shape="circle">
          <FloatButton
            onClick={() => setShowInfo((prev) => !prev)}
            icon=<InfoOutlined />
          />
          <FloatButton
            onClick={() => setShowSettings((prev) => !prev)}
            icon=<SettingOutlined />
          />
        </FloatButton.Group>
      </Layout>
    </ConfigProvider>
  );
}

export default App;
