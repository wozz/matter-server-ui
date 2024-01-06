import React from "react";
import { Descriptions } from "antd";

type ClusterAttribute = any;

interface ClusterProps {
  clusterId: string;
  attributes: { [attributeId: string]: ClusterAttribute };
}

const MatterClusterInfo: React.FC<ClusterProps> = ({
  clusterId,
  attributes,
}) => {
  const renderCluster = (
    id: string,
    attrs: { [attributeId: string]: ClusterAttribute },
  ) => {
    switch (id) {
      case "40": // Basic Information Cluster
      case "57": // Bridged Device Basic Information
        return (
          <Descriptions title="Basic Information" layout="vertical" bordered>
            <Descriptions.Item label="Data Model Revision">
              {JSON.stringify(attrs["0"])}
            </Descriptions.Item>
            <Descriptions.Item label="Vendor Name">
              {JSON.stringify(attrs["1"])}
            </Descriptions.Item>
            <Descriptions.Item label="Vendor ID">
              {JSON.stringify(attrs["2"])}
            </Descriptions.Item>
            <Descriptions.Item label="Product Name">
              {JSON.stringify(attrs["3"])}
            </Descriptions.Item>
            <Descriptions.Item label="Product ID">
              {JSON.stringify(attrs["4"])}
            </Descriptions.Item>
            <Descriptions.Item label="Node Label">
              {JSON.stringify(attrs["5"])}
            </Descriptions.Item>
            <Descriptions.Item label="Location">
              {JSON.stringify(attrs["6"])}
            </Descriptions.Item>
            <Descriptions.Item label="Hardware Version">
              {JSON.stringify(attrs["7"])}
            </Descriptions.Item>
            <Descriptions.Item label="Hardware Version String">
              {JSON.stringify(attrs["8"])}
            </Descriptions.Item>
            <Descriptions.Item label="Software Version">
              {JSON.stringify(attrs["9"])}
            </Descriptions.Item>
            <Descriptions.Item label="Software Version String">
              {JSON.stringify(attrs["10"])}
            </Descriptions.Item>
            <Descriptions.Item label="Manufacturing Date">
              {JSON.stringify(attrs["11"])}
            </Descriptions.Item>
            <Descriptions.Item label="Part Number">
              {JSON.stringify(attrs["12"])}
            </Descriptions.Item>
            <Descriptions.Item label="Product URL">
              {JSON.stringify(attrs["13"])}
            </Descriptions.Item>
            <Descriptions.Item label="Product Label">
              {JSON.stringify(attrs["14"])}
            </Descriptions.Item>
            <Descriptions.Item label="Serial Number">
              {JSON.stringify(attrs["15"])}
            </Descriptions.Item>
            <Descriptions.Item label="Local Config Disabled">
              {JSON.stringify(attrs["16"])}
            </Descriptions.Item>
            <Descriptions.Item label="Reachable">
              {JSON.stringify(attrs["17"])}
            </Descriptions.Item>
            <Descriptions.Item label="Unique ID">
              {JSON.stringify(attrs["18"])}
            </Descriptions.Item>
            <Descriptions.Item label="Capability Minima">
              {JSON.stringify(attrs["19"])}
            </Descriptions.Item>
            <Descriptions.Item label="Product Appearance">
              {JSON.stringify(attrs["20"])}
            </Descriptions.Item>
          </Descriptions>
        );
      case "46": // Power Source Configuration
        return (
          <Descriptions
            title="Power Source Configuration"
            layout="vertical"
            bordered
          >
            <Descriptions.Item label="Sources">
              {JSON.stringify(attrs["0"])}
            </Descriptions.Item>
          </Descriptions>
        );
      case "47": // Power Source Cluster
        return (
          <Descriptions title="Power Source" layout="vertical" bordered>
            <Descriptions.Item label="Status">{attrs["0"]}</Descriptions.Item>
            <Descriptions.Item label="Order">{attrs["1"]}</Descriptions.Item>
            <Descriptions.Item label="Description">
              {attrs["2"]}
            </Descriptions.Item>
            <Descriptions.Item label="Assessed Input Voltage">
              {attrs["3"]}
            </Descriptions.Item>
            <Descriptions.Item label="Assessed Input Frequency">
              {attrs["4"]}
            </Descriptions.Item>
            <Descriptions.Item label="Current Type">
              {attrs["5"]}
            </Descriptions.Item>
            <Descriptions.Item label="Assessed Current">
              {attrs["6"]}
            </Descriptions.Item>
            <Descriptions.Item label="Nominal Voltage">
              {attrs["7"]}
            </Descriptions.Item>
            <Descriptions.Item label="Maximum Current">
              {attrs["8"]}
            </Descriptions.Item>
            <Descriptions.Item label="Wired Present">
              {attrs["9"]}
            </Descriptions.Item>
            <Descriptions.Item label="Active Wired Faults">
              {JSON.stringify(attrs["10"])}
            </Descriptions.Item>
            <Descriptions.Item label="Battery Voltage">
              {attrs["11"]}
            </Descriptions.Item>
            <Descriptions.Item label="Battery Percent Remaining">
              {attrs["12"]}
            </Descriptions.Item>
            <Descriptions.Item label="Battery Time Remaining">
              {attrs["13"]}
            </Descriptions.Item>
            <Descriptions.Item label="Battery Charge Level">
              {attrs["14"]}
            </Descriptions.Item>
            <Descriptions.Item label="Battery Replacement Needed">
              {attrs["15"]}
            </Descriptions.Item>
            <Descriptions.Item label="Battery Replaceability">
              {attrs["16"]}
            </Descriptions.Item>
            <Descriptions.Item label="Battery Present">
              {attrs["17"]}
            </Descriptions.Item>
            <Descriptions.Item label="Active Battery Faults">
              {JSON.stringify(attrs["18"])}
            </Descriptions.Item>
            <Descriptions.Item label="Battery Replacement Description">
              {attrs["19"]}
            </Descriptions.Item>
            <Descriptions.Item label="Battery Common Designation">
              {attrs["20"]}
            </Descriptions.Item>
            <Descriptions.Item label="Battery ANSI Designation">
              {attrs["21"]}
            </Descriptions.Item>
            <Descriptions.Item label="Battery IEC Designation">
              {attrs["22"]}
            </Descriptions.Item>
            <Descriptions.Item label="Battery Approved Chemistry">
              {attrs["23"]}
            </Descriptions.Item>
            <Descriptions.Item label="Battery Capacity">
              {attrs["24"]}
            </Descriptions.Item>
            <Descriptions.Item label="Battery Quantity">
              {attrs["25"]}
            </Descriptions.Item>
            <Descriptions.Item label="Battery Charge State">
              {attrs["26"]}
            </Descriptions.Item>
            <Descriptions.Item label="Time To Full Charge">
              {attrs["27"]}
            </Descriptions.Item>
            <Descriptions.Item label="Functional While Charging">
              {attrs["28"]}
            </Descriptions.Item>
            <Descriptions.Item label="Charging Current">
              {attrs["29"]}
            </Descriptions.Item>
            <Descriptions.Item label="Active Battery Charge Faults">
              {JSON.stringify(attrs["30"])}
            </Descriptions.Item>
            <Descriptions.Item label="Endpoint List">
              {JSON.stringify(attrs["31"])}
            </Descriptions.Item>
          </Descriptions>
        );
      case "63": // Group Key Management Cluster
        return (
          <Descriptions title="Group Key Management" layout="vertical" bordered>
            <Descriptions.Item label="Group Key Map">
              {JSON.stringify(attrs["0"])}
            </Descriptions.Item>
            <Descriptions.Item label="Group Table">
              {JSON.stringify(attrs["1"])}
            </Descriptions.Item>
            <Descriptions.Item label="Max Groups Per Fabric">
              {attrs["2"]}
            </Descriptions.Item>
            <Descriptions.Item label="Max Group Keys Per Fabric">
              {attrs["3"]}
            </Descriptions.Item>
          </Descriptions>
        );

      default:
        // Fallback for unknown clusters
        return <pre>{JSON.stringify(attrs, null, 2)}</pre>;
    }
  };

  return <div>{renderCluster(clusterId, attributes)}</div>;
};

export default MatterClusterInfo;
