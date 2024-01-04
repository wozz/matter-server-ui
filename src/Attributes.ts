import { MatterNodeData } from "./Model";

export function nodeVendorName(m: MatterNodeData): string {
  return m.attributes["0/40/1"];
}

export function nodeProductName(m: MatterNodeData): string {
  return m.attributes["0/40/3"];
}

export function nodeSerialNumber(m: MatterNodeData): string {
  return m.attributes["0/40/15"];
}
