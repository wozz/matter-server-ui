import { CommandMessage, SuccessResultMessage } from "./Model";
import { v4 as uuidv4 } from "uuid";

class WebSocketService {
  private socket: WebSocket;
  private startedListening: boolean;
  private messageHandler?: (event: MessageEvent) => void;
  private messageQueue: string[] = [];
  private callbacks: Map<string, (data: SuccessResultMessage) => void> =
    new Map();

  constructor(url: string, allNodesHandler: (data: any) => void) {
    this.socket = new WebSocket(url);
    this.startedListening = false;

    this.socket.onopen = () => {
      console.log("WebSocket Connected");
      this.messageQueue.forEach((msg) => this.socket.send(msg));
      this.messageQueue = [];
    };

    this.socket.onclose = (event) => {
      console.log(
        `WebSocket Closed: Code=${event.code}, Reason=${event.reason}`,
      );
    };

    this.socket.onerror = (error) => {
      console.error("WebSocket Error: ", error);
      console.dir(error);
    };

    this.socket.onmessage = (event: MessageEvent) => {
      console.log("WebSocket OnMessage");
      if (!this.startedListening) {
        this.startedListening = true;
        this.sendCommand("start_listening", null, allNodesHandler);
      }
      const data = JSON.parse(event.data);
      if (data.message_id && this.callbacks.has(data.message_id)) {
        const callback = this.callbacks.get(data.message_id);
        callback?.(data);
        this.callbacks.delete(data.message_id);
        return; // skip main message handler for callbacks
      }
      if (this.messageHandler) {
        this.messageHandler(event);
      }
    };
  }

  sendCommand(command: string, args?: any, callback?: (data: any) => void) {
    console.debug("Publishing command message:", command);
    const msg: CommandMessage = {
      message_id: uuidv4(),
      command: command,
      args: args,
    };
    if (callback) {
      this.callbacks.set(msg.message_id, callback);
    }
    this.sendMessage(JSON.stringify(msg));
  }

  sendMessage(message: string) {
    if (this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(message);
    } else {
      // Queue the message if the socket is not open
      this.messageQueue.push(message);
    }
  }

  setOnMessageListener(onMessage: (event: MessageEvent) => void) {
    this.messageHandler = onMessage;
  }

  closeConnection() {
    this.socket.close();
  }
}

export default WebSocketService;
