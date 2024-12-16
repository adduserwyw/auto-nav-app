import React, { useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Device } from 'react-native-ble-plx';
import { useBluetoothControl } from '~/hooks/useBluetoothControl';
import { DirectionalButton } from '~/components/ui/DirectionalButton';

interface DirectionalControlsProps {
  onDirectionPress: (direction: 'up' | 'down' | 'left' | 'right') => void;
  connectedDevice: Device | null;
}

export const DirectionControls: React.FC<DirectionalControlsProps> = ({
  onDirectionPress,
  connectedDevice,
}) => {
  const { handleContinuousStepCommand, handleStopCommand, handleTurningCommand } =
    useBluetoothControl(connectedDevice);

  const onLongPress = (direction: 'up' | 'down' | 'left' | 'right') => {
    if (!connectedDevice) return;
    handleContinuousStepCommand(connectedDevice, direction);
    if (direction === 'up' || 'down') {
    }
    console.log(`Long press ${direction} command`);
  };

  const onShortPress = (direction: 'up' | 'down' | 'left' | 'right') => {
    if (!connectedDevice) return;
    handleContinuousStepCommand(connectedDevice, direction);
    if (direction === 'up' || 'down') {
      setTimeout(() => {
        handleStopCommand(connectedDevice);
      }, 600);
    }
  };

  const onPressDirectionChange = (direction: 'up' | 'down' | 'left' | 'right') => {
    if (!connectedDevice) return;
    handleTurningCommand(connectedDevice, direction);
    console.log(`press turning ${direction} command`);
  };

  return (
    <View className={style.container}>
      <Text style={styles.heading}>Direction Controls</Text>
      <View style={styles.grid}>
        {/* Empty cell for spacing */}
        <View style={styles.emptyCell} />
        {/* Up button */}
        <DirectionalButton
          direction="up"
          onShortPress={onShortPress}
          onLongPress={onLongPress}
          onDirectionPress={onDirectionPress}
        />
        {/* Empty cell for spacing */}
        <View style={styles.emptyCell} />
        {/* Left button */}
        <DirectionalButton
          direction="left"
          onShortPress={onPressDirectionChange}
          onLongPress={onPressDirectionChange}
          onDirectionPress={onDirectionPress}
        />
        {/* Empty cell for spacing */}
        <View style={styles.emptyCell} />
        {/* Right button */}
        <DirectionalButton
          direction="right"
          onShortPress={onPressDirectionChange}
          onLongPress={onPressDirectionChange}
          onDirectionPress={onDirectionPress}
        />
        {/* Empty cell for spacing */}
        <View style={styles.emptyCell} />
        {/* Down button */}
        <DirectionalButton
          direction="down"
          onShortPress={onShortPress}
          onLongPress={onLongPress}
          onDirectionPress={onDirectionPress}
        />
        {/* Empty cell for spacing */}
        <View style={styles.emptyCell} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  heading: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    maxWidth: 200,
    alignSelf: 'center',
  },
  emptyCell: {
    width: 50,
    height: 50,
  },
  leftRight: {
    backgroundColor: '#8b5cf6',
  },
});

const style = {
  container: `bg-white bg-opacity-90 rounded-lg shadow-lg p-4`,
};
