import React from "react";
import { Collapse } from "antd";
import { MatterNodeData } from "./Model";
import MatterClusterInfo from "./MatterClusterInfo";

interface NodeDataProps {
  data: MatterNodeData | null;
}

const NodeData: React.FC<NodeDataProps> = ({ data }) => {
  if (!data) {
    return <>No data</>;
  }
  const organizeAttributes = (attributes: { [key: string]: any }) => {
    const organizedData: {
      [endpointId: string]: {
        [clusterId: string]: { [attributeId: string]: any };
      };
    } = {};

    Object.keys(attributes).forEach((key) => {
      const [endpointId, clusterId, attributeId] = key.split("/");
      if (!organizedData[endpointId]) {
        organizedData[endpointId] = {};
      }
      if (!organizedData[endpointId][clusterId]) {
        organizedData[endpointId][clusterId] = {};
      }
      organizedData[endpointId][clusterId][attributeId] = attributes[key];
    });

    return organizedData;
  };
  const organizedAttributes = organizeAttributes(data.attributes);
  return (
    <>
      <p>Date Commissioned: {data.date_commissioned}</p>
      <p>Last Interview: {data.last_interview}</p>
      <p>Interview Version: {data.interview_version}</p>
      <p>Available: {data.available ? "Yes" : "No"}</p>
      <p>Is Bridge: {data.is_bridge ? "Yes" : "No"}</p>

      <Collapse
        items={Object.entries(organizedAttributes).map(
          ([endpointId, clusters], i) => ({
            key: i.toString(),
            label: `Endpoint ${endpointId}`,
            children: (
              <Collapse
                items={Object.entries(clusters).map(
                  ([clusterId, attrs], ii) => ({
                    key: ii.toString(),
                    label: `Cluster ${clusterId}`,
                    children: (
                      <MatterClusterInfo
                        clusterId={clusterId}
                        attributes={attrs}
                      />
                    ),
                  }),
                )}
              />
            ),
          }),
        )}
      />
    </>
  );
};

export default NodeData;
