import React from "react";
import { List, Space, Tooltip } from "antd";

import { SpecMatter } from "./spec";

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
        <p>Name: {clusterInfo.clusterName}</p>
        <p>Classification: {clusterInfo.classification}</p>
        <p>Details: {clusterInfo.details}</p>

        <List
          header="Attributes:"
          size="small"
          dataSource={Object.entries(clusterInfo.attributes).map(
            ([attributeId, attribute]: any) => ({
              key: attributeId,
              name: attribute.name,
              type: attribute.type,
              children: attribute.children,
              values: attributes[attributeId],
            }),
          )}
          renderItem={(item) => (
            <div key={item.key}>
              {item.name} [{item.type}]:{" "}
              <Tooltip
                title={
                  item.children
                    ? `children: ${JSON.stringify(item.children, null, 2)}`
                    : "attribute not found in spec"
                }
              >
                <pre>{JSON.stringify(item.values, null, 2)}</pre>
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
