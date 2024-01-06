import React from "react";
import { Collapse, Typography } from "antd";
import { MatterNodeData } from "./Model";
import MatterClusterInfo, { clusterById } from "./MatterClusterInfo";
import DisplayDate from "./DisplayDate";
const { Text } = Typography;

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
      <Text>
        Date Commissioned: <DisplayDate date={data.date_commissioned} />
      </Text>
      <br />
      <Text>
        Last Interview: <DisplayDate date={data.last_interview} />
      </Text>
      <br />
      <Text>Interview Version: {data.interview_version}</Text>
      <br />
      <Text>Available: {data.available ? "Yes" : "No"}</Text>
      <br />
      {data.is_bridge && (
        <>
          <Text>Is Bridge: Yes</Text>
          <br />
        </>
      )}

      <Collapse
        items={Object.entries(organizedAttributes).map(
          ([endpointId, clusters], i) => ({
            key: `${data.node_id}-${endpointId}-${i.toString()}`,
            label: `Endpoint ${endpointId}`,
            children: (
              <Collapse
                size="small"
                items={Object.entries(clusters).map(
                  ([clusterId, attrs], ii) => ({
                    key: ii.toString(),
                    label: `Cluster ${clusterId} [${
                      clusterById(clusterId)
                        ? clusterById(clusterId).name || "unnamed"
                        : "unknown"
                    }]`,
                    children: (
                      <MatterClusterInfo
                        endpointId={endpointId}
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
