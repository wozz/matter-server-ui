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

const translateEnum = (type: string, value: any, dataTypeInfo: any) => {
  if (!type || !type.endsWith("Enum")) {
    return value;
  }
  if (!dataTypeInfo || !dataTypeInfo.hasOwnProperty("children")) {
    return value;
  }
  const mappedValue = dataTypeInfo.children.find(
    (child: any) => parseInt(child.id, 10) === value,
  );
  return mappedValue && mappedValue.name ? mappedValue.name : value;
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
      const dataTypeInfo: any = clusterInfo.children.find(
        (child: any) =>
          attributeInfo &&
          child &&
          child.tag === "datatype" &&
          child.name === attributeInfo.type,
      );
      if (attributeInfo) {
        acc[attributeId] = {
          name: attributeInfo.name,
          type: attributeInfo.type,
          children: attributeInfo.children,
          details: attributeInfo.details,
          description: attributeInfo.description,
          dataTypeInfo: dataTypeInfo,
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
  endpointId: string;
  clusterId: string;
  attributes: { [attributeId: string]: ClusterAttribute };
}

const MatterClusterInfo: React.FC<ClusterProps> = ({
  endpointId,
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
        <Text type="secondary">Details:</Text>{" "}
        <Text type="secondary" italic>
          {clusterInfo.details}
        </Text>
        <br />
        <List
          header={<Text strong>Attributes:</Text>}
          size="small"
          dataSource={Object.entries(clusterInfo.attributes).map(
            ([attributeId, attribute]: any) => ({
              key: `${endpointId}-${clusterId}-${attributeId}`,
              name: attribute.name,
              type: attribute.type,
              children: attribute.children,
              values: translateEnum(
                attribute.type,
                attributes[attributeId],
                attribute.dataTypeInfo,
              ),
              details: attribute.details,
              description: attribute.description,
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
              <Text type="secondary">[{item.type}]</Text>
              {item.description && (
                <>
                  {" "}
                  <Text italic>{item.description}</Text>
                </>
              )}
              :{" "}
              {item.children ? (
                <Tooltip
                  title={`children: ${JSON.stringify(item.children, null, 2)}`}
                >
                  <Text>
                    <pre>{JSON.stringify(item.values, null, 2)}</pre>
                  </Text>
                </Tooltip>
              ) : (
                <Text>
                  <pre>{JSON.stringify(item.values, null, 2)}</pre>
                </Text>
              )}
            </div>
          )}
        />
      </div>
    );
  };

  return <div>{renderCluster(clusterId, attributes)}</div>;
};

export default MatterClusterInfo;
