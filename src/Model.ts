export interface CommandMessage {
  message_id: string;
  command: string;
  args?: { [key: string]: any };
}

export interface ServerInfoMessage {
  fabric_id: number;
  compressed_fabric_id: number;
  schema_version: number;
  min_supported_schema_version: number;
  sdk_version: string;
  wifi_credentials_set: boolean;
  thread_credentials_set: boolean;
}

export function isServerInfo(data: Object): boolean {
  return (
    data.hasOwnProperty("fabric_id") && // or other unique key for ServerInfoMessage
    data.hasOwnProperty("compressed_fabric_id")
  ); // additional checks as needed
}

export enum EventType {
  NODE_ADDED = "node_added",
  NODE_UPDATED = "node_updated",
  NODE_REMOVED = "node_removed",
  NODE_EVENT = "node_event",
  ATTRIBUTE_UPDATED = "attribute_updated",
  SERVER_SHUTDOWN = "server_shutdown",
  ENDPOINT_ADDED = "endpoint_added",
  ENDPOINT_REMOVED = "endpoint_removed",
}

export interface EventMessage {
  event: EventType;
  data: Object;
}

export function isEvent(data: Object): boolean {
  return data.hasOwnProperty("event") && data.hasOwnProperty("data");
}

export interface ResultMessageBase {
  message_id: string;
}

export interface SuccessResultMessage extends ResultMessageBase {
  result: any; // Adjust according to the expected structure
}

export interface MatterNodeData {
  node_id: number;
  date_commissioned: string; // Dates will be strings in JSON
  last_interview: string;
  interview_version: number;
  available: boolean;
  is_bridge: boolean;
  attributes: { [key: string]: any };
  attribute_subscriptions: Array<[number | null, number | null, number | null]>;
}

export interface WebSocketConfig {
  host: string;
  port: string;
}
