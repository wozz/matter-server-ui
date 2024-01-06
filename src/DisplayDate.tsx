// Import React and necessary components
import React from "react";
import { Tooltip } from "antd";
import moment from "moment";

interface DisplayDateProps {
  date: string;
  reverse?: boolean;
}

const DisplayDate: React.FC<DisplayDateProps> = ({ date, reverse = false }) => {
  if (reverse) {
    return (
      <Tooltip title={moment.utc(date).fromNow()}>
        {moment(date).format()}
      </Tooltip>
    );
  }
  return (
    <Tooltip title={moment(date).format()}>
      {moment.utc(date).fromNow()}
    </Tooltip>
  );
};

export default DisplayDate;
