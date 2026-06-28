import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

const SOCKET_SERVER_URL = 'https://shuttleapp-api.thelocalgodd.me/';

export interface MQTTDevice {
  deviceId: string;
  position: {
    latitude: number;
    longitude: number;
    course: number;
    speed: number;
    valid: boolean;
    serverTime: string;
  };
  deviceName?: string | null;
  deviceStatus?: string | null;
  protocol?: string | null;
}

export interface MQTTDeviceMap {
  [deviceId: string]: MQTTDevice;
}

export default function useMQTTBuses() {
  const [devices, setDevices] = useState<MQTTDeviceMap>({});
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    console.log('🔌 Connecting to Socket.IO for MQTT device tracking...');

    const newSocket = io(SOCKET_SERVER_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    newSocket.on('connect', () => {
      console.log('✅ Socket.IO connected for MQTT devices:', newSocket.id);
      setIsConnected(true);
    });

    newSocket.on('disconnect', (reason) => {
      console.log('🔌 Socket.IO disconnected for MQTT devices:', reason);
      setIsConnected(false);
    });

    newSocket.on('connect_error', (error) => {
      console.error('❌ Socket.IO connection error for MQTT devices:', error.message);
      setIsConnected(false);
    });

    newSocket.on('mqtt-device-locations', (devicesArray: MQTTDevice[]) => {
      console.log('📡 Received MQTT device locations:', devicesArray.length, 'devices');

      const devicesMap: MQTTDeviceMap = {};
      devicesArray.forEach((device) => {
        devicesMap[device.deviceId] = device;
      });

      setDevices(devicesMap);
    });

    return () => {
      console.log('🧹 Cleaning up Socket.IO connection for MQTT devices');
      newSocket.close();
    };
  }, []);

  return {
    devices,
    selectedDeviceId,
    setSelectedDeviceId,
    isConnected,
  };
}
