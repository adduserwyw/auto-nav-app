import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import Slider from '@react-native-community/slider';
import Toast from 'react-native-toast-message';
import { useBluetoothControl } from '~/hooks/useBluetoothControl';
import { Device } from 'react-native-ble-plx';

interface SpeedControlProps {
  onSpeedChange: (speed: number) => void;
  currentSpeed: number;
  connectedDevice: Device | null;
}

export const SpeedControl = ({
  onSpeedChange,
  currentSpeed,
  connectedDevice,
}: SpeedControlProps) => {
  const { handleSpeedControlCommand } = useBluetoothControl(connectedDevice);

  useEffect(() => {
    if (connectedDevice) {
      handleSpeedChange(currentSpeed);
    }
    console.log('SpeedControl: currentSpeed', currentSpeed);
  }, [currentSpeed]);
  const handleSpeedChange = (value: number) => {
    onSpeedChange(value);
    if (!connectedDevice) return;
    handleSpeedControlCommand(connectedDevice, value.toString());
    Toast.show({
      type: 'info',
      text1: 'Speed Control',
      text2: `Speed set to ${value}`,
      position: 'bottom',
    });
  };

  return (
    <View className="rounded-lg bg-white bg-opacity-90 p-4 shadow-lg">
      <Text className="mb-2 text-lg font-bold">Speed Control</Text>
      <Text className="mb-2 text-center text-base">Level: {currentSpeed}</Text>
      <Slider
        minimumValue={0}
        maximumValue={10}
        step={1}
        style={{ height: 40 }}
        value={currentSpeed}
        onValueChange={handleSpeedChange}
        minimumTrackTintColor="#8b5cf6"
        maximumTrackTintColor="#8b5cf6"
        thumbTintColor="#8b5cf6"
      />
    </View>
  );
};
