import React, {useRef, useState} from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from "lucide-react-native";
import {Device} from "react-native-ble-plx";
import {useBluetoothControl} from "~/hooks/useBluetoothControl";
import {DirectionalButton} from "~/components/ui/DirectionalButton"

interface DirectionalControlsProps {
  onDirectionPress: (direction: 'up' | 'down' | 'left' | 'right') => void;
  connectedDevice: Device | null;
}


export const DirectionControls: React.FC<DirectionalControlsProps> = ({ onDirectionPress,connectedDevice }) => {


  const {
    sendSingleCommand,
      handleDirectionCommand
  } = useBluetoothControl(connectedDevice);


  const onLongPress = (direction) => {
    handleDirectionCommand(direction);
    console.log(`Long press ${direction} command`);
  };

  const onShortPress = (direction) => {
    sendSingleCommand(direction)
    console.log(`Short press ${direction}`);
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
                onShortPress={onShortPress}
                onLongPress={onLongPress}
                onDirectionPress={onDirectionPress}
            />
          {/* Empty cell for spacing */}
          <View style={styles.emptyCell} />
          {/* Right button */}
            <DirectionalButton
                direction="right"
                onDirectionPress={onDirectionPress}
                iconSize={24}
                iconColor="#e0e0e0"
            />
          {/* Empty cell for spacing */}
          <View style={styles.emptyCell} />
          {/* Down button */}
            <DirectionalButton
                direction="down"
                onDirectionPress={onDirectionPress}
                iconSize={24}
                iconColor="#e0e0e0"
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
  // button: {
  //   width: 50,
  //   height: 50,
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   borderRadius: 8,
  //   margin: 4,
  // },
  // upDown: {
  //   backgroundColor: '#8b5cf6',
  // },
  leftRight: {
    backgroundColor: '#8b5cf6',
  },
});


const style={
  container: `bg-white bg-opacity-90 rounded-lg shadow-lg p-4`,
};