import { Device } from 'react-native-ble-plx';
import { Config } from 'react-native-config';

const serviceUUID = Config.SERVICE_UUID;
const characteristicUUID = Config.CHARACTERISTIC_UUID;

export const BASIC_COMMANDS = {
  manual: 'M', // Manual
  auto: 'A', // autonomous
  up: 'F', // Forward
  down: 'B', // Backward
  left: 'L', // Left
  right: 'R', // Right
  stop: 'S', //Stopn
  ledOn: 'P', // Led On
  ledOff: 'L', // Led Off
  clear: 'C', // clear waypoints
  sendWaypoints: 'WW', // send waypoints
} as const;

export async function sendWaypoints(device: Device, waypoints: string) {
  try {
    const waypointDataCommand = btoa(`(1,2),(3,4),(4,5),`);
    await device.writeCharacteristicWithResponseForService(
      serviceUUID as string,
      characteristicUUID as string,
      waypointDataCommand
    );
    await device.writeCharacteristicWithResponseForService(
      serviceUUID,
      characteristicUUID,
      btoa('A')
    );
  } catch (error) {
    console.error('Failed to send waypoints:', error);
    throw error;
  }
}

export async function sendSpeedControlCommand(device: Device, speed: string) {
  try {
    const base64Command = btoa(speed);
    await device.writeCharacteristicWithoutResponseForService(
      serviceUUID as string,
      characteristicUUID as string,
      base64Command
    );
    console.log('Speed updated:', speed);
  } catch (error) {
    console.error('Failed to control the speed:', error);
    throw error;
  }
}

export async function sendBluetoothCommand(device: Device, command: string, isContinuous: boolean) {
  try {
    if (isContinuous) {
      const base64Command = btoa(command);
      await device.writeCharacteristicWithResponseForService(
        serviceUUID as string,
        characteristicUUID as string,
        base64Command
      );
    } else {
      const base64Command = btoa(command);
      device.writeCharacteristicWithResponseForService(
        serviceUUID as string,
        characteristicUUID as string,
        base64Command
      );
    }
  } catch (error) {
    console.error('Failed to send bluetooth command:', error);
    throw error;
  }
}

export async function sendTurningCommand(device: Device, command: string) {
  try {
    const turningCommand = btoa(command);
    await device.writeCharacteristicWithoutResponseForService(
      serviceUUID as string,
      characteristicUUID as string,
      turningCommand
    );
  } catch (error) {
    console.error('Failed to send waypoints:', error);
    throw error;
  }
}
