import axios from "axios";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

const API_BASE_URL = "http://localhost:8080/api";
const WS_URL = "http://localhost:8080/ws";

export interface EnvironmentData {
  id: string;
  timestamp: string;
  temperatureCelsius: number;
  humidityPercent: number;
  sensor: string;
  device: string;
  location: string;
  dataSource: string;
}

export const api = {
  getLatest: () =>
    axios.get<EnvironmentData>(`${API_BASE_URL}/environment/latest`),
  getHistory: (limit: number = 50) =>
    axios.get<EnvironmentData[]>(
      `${API_BASE_URL}/environment/history?limit=${limit}`
    ),
};

export class WebSocketService {
  private client: Client;
  private onMessageCallback?: (data: EnvironmentData) => void;

  constructor() {
    this.client = new Client({
      webSocketFactory: () => new SockJS(WS_URL),
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });
  }

  connect(onMessage: (data: EnvironmentData) => void) {
    this.onMessageCallback = onMessage;

    this.client.onConnect = () => {
      console.log("WebSocket connected");
      this.client.subscribe("/topic/environment", (message) => {
        const data = JSON.parse(message.body);
        this.onMessageCallback?.(data);
      });
    };

    this.client.activate();
  }

  disconnect() {
    this.client.deactivate();
  }
}
