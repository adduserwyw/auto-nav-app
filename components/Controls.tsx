import React, {useEffect} from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Pause, Play, Square } from 'lucide-react-native';
import {Device} from "react-native-ble-plx";
import {useBluetoothControl} from "~/hooks/useBluetoothControl";

interface ControlsProps {
  isRunning: boolean;
  onToggleRunning: () => void;
  onEmergencyStop: () => void;
  connectedDevice: Device | null;
}

export const Controls = ({
                           isRunning,
                           onToggleRunning,
                           onEmergencyStop,
    connectedDevice
                         }: ControlsProps) => {
    const {
        handleStopCommand,
        handleToggleRunning
    } = useBluetoothControl(connectedDevice);


    const handleStop = async () => {
        await handleStopCommand();
        onEmergencyStop();
    };

    const handleRunning = async () => {
        await handleToggleRunning(isRunning);
        onToggleRunning();
    };


    return (
      <View className={styles.container}>
        <Text className={styles.header}>Controls</Text>
        <View className={styles.buttonContainer}>
          <TouchableOpacity
              onPress={handleRunning}
              className={`
                ${styles.controlButton}
                ${isRunning ? styles.toggleButtonRunning : styles.toggleButtonPaused}
              `}
          >
            {isRunning ? (
                <>
                  <Pause color="white" size={16} />
                  <Text className={styles.buttonText}>Pause</Text>
                </>
            ) : (
                <>
                  <Play color="white" size={16} />
                  <Text className={styles.buttonText}>Resume</Text>
                </>
            )}
          </TouchableOpacity>

          <TouchableOpacity
              onPress={handleStop}
              className={`
                ${styles.controlButton}
                ${styles.stopButton}
              `}
          >
            <Square color="white" size={16} />
            <Text className={styles.buttonText}>Emergency Stop</Text>
          </TouchableOpacity>
        </View>
      </View>
  );
};

const styles = {
  container: `bg-white bg-opacity-90 rounded-lg shadow-lg p-4`,
  header: `text-lg font-semibold`,
  buttonContainer: `flex-row gap-4 mt-4 mb-2`,
  controlButton: `flex-1 flex-row items-center justify-center py-2.5 px-3 rounded-lg`,
  toggleButtonRunning: `bg-[#f59e0b]`,
  toggleButtonPaused: `bg-[#10b981]`,
  stopButton: `bg-[#dc2626]`,
  buttonText: `text-white font-medium ml-2`
};