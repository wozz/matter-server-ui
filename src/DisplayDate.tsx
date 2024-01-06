// Import React and necessary components
import React from "react";
import { Tooltip } from "antd";
import moment from "moment";

interface DisplayDateProps {
  date: string;
}

const DisplayDate: React.FC<DisplayDateProps> = ({ date }) => {
  return (
    <Tooltip title={moment(date).format()}>
      {moment.utc(date).fromNow()}
    </Tooltip>
  );
};

export default DisplayDate;
