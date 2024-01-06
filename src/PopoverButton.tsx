// Import React and necessary components
import React, { useState } from "react";
import { Popover, Button, Form, Input } from "antd";
import { EnterOutlined } from "@ant-design/icons";

interface PopoverButtonProps {
  popoverTitle: string;
  inputLabel: string;
  inputName: string;
  buttonIcon: React.ReactNode;
  onSubmit: (values: any) => void;
  onOpenChange?: (open: boolean) => void; // Optional, to notify parent component
}

const PopoverButton: React.FC<PopoverButtonProps> = ({
  popoverTitle,
  inputLabel,
  inputName,
  buttonIcon,
  onSubmit,
  onOpenChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (onOpenChange) {
      onOpenChange(open);
    }
  };

  const onFinish = (data: any) => {
    setIsOpen(false);
    onSubmit(data);
  };

  const content = (
    <Form layout="inline" onFinish={onFinish} autoComplete="off">
      <Form.Item label={inputLabel} name={inputName}>
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
  );

  return (
    <Popover
      content={content}
      title={popoverTitle}
      trigger="click"
      open={isOpen}
      onOpenChange={handleOpenChange}
    >
      <Button shape="circle" size="small" icon={buttonIcon} />
    </Popover>
  );
};

export default PopoverButton;
