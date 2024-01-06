import React, { useState, useEffect } from "react";
import { WebSocketConfig } from "./Model";
import { Button, Form, Input, Space, Typography } from "antd";
const { Title } = Typography;

type FieldType = {
  name: string | number | (string | number)[];
  host?: string;
  port?: string;
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
  const [fields, setFields] = useState<FieldData[]>([
    { name: ["host"], value: host },
    { name: ["port"], value: port },
  ]);

  useEffect(() => {
    // Load saved settings from local storage
    const savedHost = localStorage.getItem("websocketHost");
    const savedPort = localStorage.getItem("websocketPort");
    if (savedHost) setHost(savedHost);
    if (savedPort) setPort(savedPort);
    setFields([
      {
        name: ["host"],
        value: savedHost,
      },
      {
        name: ["port"],
        value: savedPort,
      },
    ]);
  }, []);

  const onFinish = (values: FieldType) => {
    localStorage.setItem("websocketHost", values.host || "");
    localStorage.setItem("websocketPort", values.port || "");
    const wsc: WebSocketConfig = {
      host: values.host || "",
      port: values.port || "",
    };
    onSave(wsc);
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
        <Form.Item<FieldType> label="Host" name="host">
          <Input />
        </Form.Item>
        <Form.Item<FieldType> label="Port" name="port">
          <Input />
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </Space>
  );
};

export default SettingsForm;
