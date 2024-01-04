import React, { useEffect, useState } from "react";
import { ConfigProvider, Flex, FloatButton, Layout, Space } from "antd";
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
  EventType,
  isEvent,
  MatterNodeData,
  SuccessResultMessage,
  WebSocketConfig,
} from "./Model";
import { HomeOutlined, SettingOutlined } from "@ant-design/icons";
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

  useEffect(() => {
    const savedHost = localStorage.getItem("websocketHost");
    const savedPort = localStorage.getItem("websocketPort");

    console.log(`savedHost: ${savedHost} / savedPort: ${savedPort}`);
    if (savedHost && savedPort) {
      console.log(`setWebSocketConfig`);
      setWebSocketConfig({ host: savedHost, port: savedPort });
    } else {
      console.log(`show settings`);
      setShowSettings(true);
    }
  }, []);

  const handleAllNodes = (msg: SuccessResultMessage) => {
    setAllNodes(msg.result);
  };

  const handleNewNode = (newNode: MatterNodeData) => {
    setAllNodes((currentNodes) => {
      return currentNodes.map((n) =>
        n.node_id === newNode.node_id ? newNode : n,
      );
    });
  };

  const handleGetNodeResponse = (msg: SuccessResultMessage) => {
    handleNewNode(msg.result);
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
    );
    service.setOnMessageListener((event) => {
      const data = JSON.parse(event.data);
      if (isServerInfo(data)) {
        setServerInfo(data);
      } else if (isEvent(data)) {
        const event = data as EventMessage;
        if (event.event === EventType.NODE_UPDATED) {
          const eventNodeData = event.data as MatterNodeData;
          handleNewNode(eventNodeData);
          return;
        }
        setEventMessages((prevMessages) => [...prevMessages, event]);
      } else {
        setMessages((prevMessages) => [...prevMessages, event.data]);
      }
    });
    setSocketService(service);

    return () => {
      service.closeConnection();
    };
  }, [webSocketConfig]);

  const handleSettingsSave = (config: WebSocketConfig) => {
    setWebSocketConfig(config);
    setShowSettings(false);
  };

  const handleReloadNodes = () => {
    console.log("reloading nodes");
    if (socketService) {
      socketService.sendCommand("get_nodes", {}, handleAllNodes);
    } else {
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
      console.error("connection not established");
    }
  };

  const handleDiscover = () => {
    console.log("discovering nodes...");
    if (socketService) {
      socketService.sendCommand("discover", {}, handleDiscoverResponse);
    } else {
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
      console.error("connection not established");
    }
  };

  const toggleSettings = () => {
    setShowSettings((prev) => !prev);
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
        {showSettings ? (
          <Flex justify="center">
            <SettingsForm onSave={handleSettingsSave} />
          </Flex>
        ) : (
          <Flex justify="space-around">
            <Space
              direction="vertical"
              size="middle"
              style={{ display: "flex" }}
            >
              <ServerInfoCell serverInfo={serverInfo} />
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
              />
              {hasBridgeNodes && <EndpointTable nodes={allNodes} />}
              <EventMessagesLog eventMessages={eventMessages} />
            </Space>
          </Flex>
        )}

        <FloatButton onClick={toggleSettings} icon=<SettingOutlined /> />
      </Layout>
    </ConfigProvider>
  );
}

export default App;
