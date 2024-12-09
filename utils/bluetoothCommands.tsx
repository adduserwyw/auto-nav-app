import Config from "react-native-config";
import { Device } from 'react-native-ble-plx';

const serviceUUID = Config.SERVICE_UUID;
const characteristicUUID = Config.CHARACTERISTIC_UUID;


export const BASIC_COMMANDS = {
    manual: 'M', // Manual
    auto: 'A', // autonomous
    up: 'F',    // Forward
    down: 'B',  // Backward
    left: 'L',  // Left
    right: 'R',  // Right
    stop:'S',  //Stop
    ledOn: 'P', // Led On
    ledOff: 'L', // Led Off
    clear: 'C', // clear waypoints
    sendWaypoints: 'W' // send waypoints
} as const;


export const sendBluetoothCommand = async (
    device: Device,
    command: string,
    isContinuous: boolean
): Promise<void> => {
    try {
        if(isContinuous) {
            const base64Command = btoa(command);
            await device.writeCharacteristicWithoutResponseForService(
                serviceUUID as string,
                characteristicUUID as string,
                base64Command
            );
        }else{
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
};