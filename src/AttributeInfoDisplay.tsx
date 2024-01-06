import React from "react";
import { Tooltip, Typography } from "antd";
import { SpecMatter } from "./spec";
const { Text } = Typography;

interface AttributeInfoDisplayProps {
  path: string;
  value: any;
}

const findAttributeDetails = (
  specMatter: any,
  endpointId: string,
  clusterId: string,
  attributeId: string,
) => {
  const clusterInfo = specMatter.children.find(
    (child: any) =>
      child.tag === "cluster" &&
      parseInt(child.id, 10) === parseInt(clusterId, 10),
  );

  if (!clusterInfo) {
    return null;
  }

  const attributeInfo = clusterInfo.children.find(
    (child: any) =>
      child.tag === "attribute" &&
      parseInt(child.id, 10) === parseInt(attributeId, 10),
  );

  return attributeInfo
    ? {
        clusterName: clusterInfo.name,
        clusterDetails: clusterInfo.details,
        attributeName: attributeInfo.name,
        attributeDetails:
          attributeInfo.details ||
          attributeInfo.description ||
          "No additional details",
      }
    : null;
};

const AttributeInfoDisplay: React.FC<AttributeInfoDisplayProps> = ({
  path,
  value,
}) => {
  const [endpointId, clusterId, attributeId] = path.split("/");
  const attributeDetails = findAttributeDetails(
    SpecMatter,
    endpointId,
    clusterId,
    attributeId,
  );

  if (!attributeDetails) {
    return (
      <>
        {path}: {JSON.stringify(value)}
      </>
    );
  }

  return (
    <div>
      <Text>[{endpointId}]</Text>{" "}
      <Tooltip title={attributeDetails.clusterDetails}>
        <Text>{attributeDetails.clusterName}:</Text>
      </Tooltip>{" "}
      <Tooltip title={attributeDetails.attributeDetails}>
        <Text>{attributeDetails.attributeName}</Text>
      </Tooltip>
      <Text>
        <pre>{JSON.stringify(value)}</pre>
      </Text>
    </div>
  );
};

export default AttributeInfoDisplay;
