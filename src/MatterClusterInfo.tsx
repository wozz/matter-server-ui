import React from "react";
import { List, Tooltip, Typography } from "antd";

import { SpecMatter } from "./spec";
const { Text } = Typography;

export const clusterById = (clusterId: string) => {
  return findClusterById(SpecMatter, clusterId);
};

const findClusterById = (specMatter: any, clusterId: any) => {
  const cluster = specMatter.children.find(
    (child: any) =>
      child.tag === "cluster" &&
      parseInt(child.id, 10) === parseInt(clusterId, 10),
  );
  return cluster || null;
};

const parseClusterData = (specMatter: any, clusterId: any, attributes: any) => {
  const clusterInfo = findClusterById(specMatter, clusterId);
  if (!clusterInfo) {
    return null; // or handle the error as needed
  }

  const parsedAttributes = Object.keys(attributes).reduce(
    (acc: any, attributeId: any) => {
      const attributeInfo: any = clusterInfo.children.find(
        (child: any) =>
          child.tag === "attribute" &&
          parseInt(child.id, 10) === parseInt(attributeId, 10),
      );
      if (attributeInfo) {
        acc[attributeId] = {
          name: attributeInfo.name,
          type: attributeInfo.type,
          children: attributeInfo.children || [],
          details: attributeInfo.details,
        };
      }
      return acc;
    },
    {},
  );

  return {
    clusterName: clusterInfo.name,
    classification: clusterInfo.classification,
    details: clusterInfo.details,
    attributes: parsedAttributes,
  };
};

type ClusterAttribute = any;

interface ClusterProps {
  clusterId: string;
  attributes: { [attributeId: string]: ClusterAttribute };
}

const MatterClusterInfo: React.FC<ClusterProps> = ({
  clusterId,
  attributes,
}) => {
  console.log("test");
  const clusterInfo = parseClusterData(SpecMatter, clusterId, attributes);
  const renderCluster = (
    id: string,
    attrs: { [attributeId: string]: ClusterAttribute },
  ) => {
    if (!clusterInfo) {
      return <pre>{JSON.stringify(attrs, null, 2)}</pre>;
    }
    return (
      <div>
        <Text>Name: {clusterInfo.clusterName}</Text>
        <br />
        <Text>Classification: {clusterInfo.classification}</Text>
        <br />
        <Text>Details: {clusterInfo.details}</Text>
        <br />
        <List
          header={<Text strong>Attributes:</Text>}
          size="small"
          dataSource={Object.entries(clusterInfo.attributes).map(
            ([attributeId, attribute]: any) => ({
              key: attributeId,
              name: attribute.name,
              type: attribute.type,
              children: attribute.children,
              values: attributes[attributeId],
              details: attribute.details,
            }),
          )}
          renderItem={(item) => (
            <div key={item.key}>
              <Tooltip
                title={
                  item.details
                    ? `${item.details}`
                    : `no attribute details available`
                }
              >
                <Text strong>{item.name}</Text>
              </Tooltip>{" "}
              <Text type="secondary">[{item.type}]</Text>:{" "}
              <Tooltip
                title={
                  item.children
                    ? `children: ${JSON.stringify(item.children, null, 2)}`
                    : "attribute not found in spec"
                }
              >
                <Text>
                  <pre>{JSON.stringify(item.values, null, 2)}</pre>
                </Text>
              </Tooltip>
            </div>
          )}
        />
      </div>
    );
  };

  return <div>{renderCluster(clusterId, attributes)}</div>;
};

export default MatterClusterInfo;
