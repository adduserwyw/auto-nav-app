import { useCallback, useRef } from 'react';
import { Device } from 'react-native-ble-plx';
import {
  BASIC_COMMANDS,
  sendBluetoothCommand,
  sendSpeedControlCommand,
  sendTurningCommand,
  sendWaypoints,
} from '~/utils/bluetoothCommands';
import Toast from 'react-native-toast-message';

export const useBluetoothControl = (device: Device | null) => {
  const handleWaypointCommand = useCallback(
    async (waypoints: string) => {
      if (!device) return;
      try {
        await sendWaypoints(device, waypoints);
      } catch (error) {
        console.error(`Failed to send waypoint:`, error);
        Toast.show({
          type: 'error',
          text1: `Failed to send waypoint: ${error}`,
          position: 'bottom',
        });
      }
    },
    [device]
  );
  const handleContinuousStepCommand = (
    device: Device | null,
    command: keyof typeof BASIC_COMMANDS
  ) => {
    if (!device) return;
    try {
      sendBluetoothCommand(device, BASIC_COMMANDS[command], true);
    } catch (error) {
      console.error(`Failed to send continuous ${command} command:`, error);
      Toast.show({
        type: 'error',
        text1: `Failed to send ${command} command: ${error}`,
        position: 'bottom',
      });
    }
  };
  const handleSingleStepCommand = (device: Device | null, command: keyof typeof BASIC_COMMANDS) => {
    if (!device) return;
    try {
      sendBluetoothCommand(device, BASIC_COMMANDS[command], false);
    } catch (error) {
      console.error(`Failed to send continuous ${command} command:`, error);
      Toast.show({
        type: 'error',
        text1: `Failed to send ${command} command: ${error}`,
        position: 'bottom',
      });
    }
  };

  const handleTurningCommand = (device: Device | null, command: keyof typeof BASIC_COMMANDS) => {
    if (!device) return;
    try {
      console.log('reach here');
      sendTurningCommand(device, BASIC_COMMANDS[command]);
    } catch (error) {
      console.error(`Failed to send turning ${command} command:`, error);
      Toast.show({
        type: 'error',
        text1: `Failed to send ${command} command: ${error}`,
        position: 'bottom',
      });
    }
  };

  const handleStopCommand = (device: Device | null) => {
    if (!device) return;
    try {
      sendBluetoothCommand(device, BASIC_COMMANDS.stop, true);
    } catch (error) {
      console.error(`Failed to send stop command:`, error);
      Toast.show({
        type: 'error',
        text1: `Failed to send stop command: ${error}`,
        position: 'bottom',
      });
    }
  };

  const handleSpeedControlCommand = (device: Device | null, speed: string) => {
    if (!device) return;
    try {
      sendSpeedControlCommand(device, speed);
    } catch (error) {
      console.error(`Failed to control the speed:`, error);
      Toast.show({
        type: 'error',
        text1: `Failed to control the speed: ${error}`,
        position: 'bottom',
      });
    }
  };

  const handleToggleRunning = (
    Device: Device | null,
    isRunning: boolean,
    command: keyof typeof BASIC_COMMANDS
  ) => {
    if (!device) return;
    try {
      sendBluetoothCommand(device, isRunning ? BASIC_COMMANDS.stop : BASIC_COMMANDS[command], true);
    } catch (error) {
      console.error(`Failed to send command:`, error);
      Toast.show({
        type: 'error',
        text1: `Failed to send command: ${error}`,
        position: 'bottom',
      });
    }
  };

  return {
    handleContinuousStepCommand,
    handleSingleStepCommand,
    handleStopCommand,
    handleTurningCommand,
    handleToggleRunning,
    handleWaypointCommand,
    handleSpeedControlCommand,
  };
};
