import React, { useState, useEffect } from "react";
import { WebSocketConfig } from "./Model";
import { Button, Form, Input, Space, Typography } from "antd";
const { Title } = Typography;

type FieldType = {
  name: string | number | (string | number)[];
  host?: string;
  port?: string;
  scheme?: string;
  path?: string;
};

interface FieldData {
  name: string | number | (string | number)[];
  value?: any;
  touched?: boolean;
  validating?: boolean;
  errors?: string[];
}

interface SettingsFormProps {
  onSave: (data: WebSocketConfig) => void;
}

const SettingsForm: React.FC<SettingsFormProps> = ({ onSave }) => {
  const [host, setHost] = useState<string>("");
  const [port, setPort] = useState<string>("");
  const [scheme, setScheme] = useState<string>("ws");
  const [path, setPath] = useState<string>("/ws");
  const [fields, setFields] = useState<FieldData[]>([
    { name: ["host"], value: host },
    { name: ["port"], value: port },
    { name: ["scheme"], value: scheme },
    { name: ["path"], value: path },
  ]);

  useEffect(() => {
    // Load saved settings from local storage
    const savedHost = localStorage.getItem("websocketHost");
    const savedPort = localStorage.getItem("websocketPort");
    const savedScheme = localStorage.getItem("websocketScheme");
    const savedPath = localStorage.getItem("websocketPath");
    if (savedHost) setHost(savedHost);
    if (savedPort) setPort(savedPort);
    if (savedScheme) setScheme(savedScheme);
    if (savedPath) setPath(savedPath);
    setFields([
      {
        name: ["host"],
        value: savedHost,
      },
      {
        name: ["port"],
        value: savedPort,
      },
      {
        name: ["scheme"],
        value: savedScheme || "ws",
      },
      {
        name: ["path"],
        value: savedPath || "/ws",
      },
    ]);
  }, []);

  const onFinish = (values: FieldType) => {
    localStorage.setItem("websocketHost", values.host || "");
    localStorage.setItem("websocketPort", values.port || "");
    localStorage.setItem("websocketScheme", values.scheme || "ws");
    localStorage.setItem("websocketPath", values.path || "/ws");
    const wsc: WebSocketConfig = {
      host: values.host || "",
      port: values.port || "",
      scheme: values.scheme || "ws",
      path: values.path || "/ws",
    };
    onSave(wsc);
  };

  const setHAAddonDefaults = () => {
    setFields([
      {
        name: ["host"],
        value: window.location.hostname,
      },
      {
        name: ["port"],
        value:
          window.location.port || window.location.protocol === "http"
            ? "80"
            : "443",
      },
      {
        name: ["scheme"],
        value: window.location.protocol.replace("http", "ws").replace(":", ""),
      },
      {
        name: ["path"],
        value: `${window.location.pathname}wsproxy?host=localhost`,
      },
    ]);
  };

  return (
    <Space direction="vertical">
      <Title level={2}>Settings</Title>
      <Form
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600 }}
        fields={fields}
        onFieldsChange={(_, allFields) => {
          setFields(allFields);
        }}
        onFinish={onFinish}
        autoComplete="off"
      >
        <Form.Item<FieldType> label="Scheme" name="scheme">
          <Input />
        </Form.Item>
        <Form.Item<FieldType> label="Host" name="host">
          <Input />
        </Form.Item>
        <Form.Item<FieldType> label="Port" name="port">
          <Input />
        </Form.Item>
        <Form.Item<FieldType> label="Path" name="path">
          <Input />
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 4, span: 16 }}>
          <Space>
            <Button type="dashed" size="small" onClick={setHAAddonDefaults}>
              HA Addon Defaults
            </Button>
            <Button type="primary" size="small" htmlType="submit">
              Submit
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Space>
  );
};

export default SettingsForm;
