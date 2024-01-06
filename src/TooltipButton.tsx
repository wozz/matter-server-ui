import React from "react";
import { Tooltip, Button } from "antd";

interface TooltipButtonProps {
  tooltipTitle: string;
  onClick: () => void;
  icon: React.ReactNode;
  shape?: "circle" | "round" | "default";
  size?: "large" | "middle" | "small";
  type?: "primary" | "default";
}

const TooltipButton: React.FC<TooltipButtonProps> = ({
  tooltipTitle,
  onClick,
  icon,
  shape = "circle",
  size = "small",
  type = "default",
}) => {
  return (
    <Tooltip title={tooltipTitle}>
      <Button
        shape={shape}
        size={size}
        onClick={onClick}
        icon={icon}
        type={type}
      />
    </Tooltip>
  );
};

export default TooltipButton;
