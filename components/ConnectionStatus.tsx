import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet
} from "react-native";
import { Wifi, WifiOff, Bluetooth, BluetoothOff, Bot } from "lucide-react-native";
import Toast from 'react-native-toast-message';

interface ConnectionStatusProps {
  isConnected: boolean;
}

export const ConnectionStatus: React.FC<ConnectionStatusProps> = ({ isConnected }) => {
  const [isWifiEnabled, setIsWifiEnabled] = useState(true);
  const [isBluetoothEnabled, setIsBluetoothEnabled] = useState(false);

  const handleWifiChange = () => {
    const newWifiState = !isWifiEnabled;
    setIsWifiEnabled(newWifiState);

    Toast.show({
      type: 'info',
      text1: `WiFi ${newWifiState ? 'enabled' : 'disabled'}`,
      position: 'top'
    });

    console.log("WiFi mode changed:", newWifiState);
  };

  const handleBluetoothChange = () => {
    const newBluetoothState = !isBluetoothEnabled;
    setIsBluetoothEnabled(newBluetoothState);

    Toast.show({
      type: 'info',
      text1: `Bluetooth ${newBluetoothState ? 'enabled' : 'disabled'}`,
      position: 'top'
    });

    console.log("Bluetooth mode changed:", newBluetoothState);
  };

  return (
      <View className={styles.container}>
        <View className={styles.headerContainer}>
          <Bot color="#8b5cf6" size={20} />
          <Text className={styles.headerTitle}>Robot Car Connection</Text>
        </View>

        <View className={styles.connectionsContainer}>
          <View className={styles.buttonGroup}>
            <TouchableOpacity
                onPress={handleWifiChange}
                className={`
                  ${styles.connectionButton}
                  ${isWifiEnabled ? styles.activeButton : styles.inactiveButton}
                `}
            >
              {isWifiEnabled ? (
                  <Wifi color="#8b5cf6" size={16} />
              ) : (
                  <WifiOff color="#6b7280" size={16} />
              )}
              <Text className={`
               ${styles.buttonText}
                ${isWifiEnabled ? styles.activeText : styles.inactiveText}
              `}>
                WiFi
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
                onPress={handleBluetoothChange}
                className={`
               ${styles.connectionButton}
                 ${isBluetoothEnabled ? styles.activeButton : styles.inactiveButton}
                `}
            >
              {isBluetoothEnabled ? (
                  <Bluetooth color="#8b5cf6" size={16} />
              ) : (
                  <BluetoothOff color="#6b7280" size={16} />
              )}
              <Text className={`
               ${styles.buttonText} 
                ${isBluetoothEnabled ? styles.activeText : styles.inactiveText}
              `}>
                Bluetooth
              </Text>
            </TouchableOpacity>
          </View>

          <View className={`${styles.connectionStatus} ${isConnected ? styles.connectedBorder : styles.disconnectedBorder}`}>
            {isWifiEnabled && (
                isConnected
                    ? <Wifi color="#8b5cf6" size={16} />
                    : <WifiOff color="#ef4444" size={16} />
            )}
            {isBluetoothEnabled && (
                isConnected
                    ? <Bluetooth color="#8b5cf6" size={16} />
                    : <BluetoothOff color="#ef4444" size={16} />
            )}
            <Text className={`${styles.connectionText}
              ${isConnected ? styles.connectedText : styles.disconnectedText}
            `}>
              {isConnected ? 'Connected' : 'Disconnected'}
            </Text>
          </View>
        </View>
      </View>
  );
};

const styles = {
  container:`bg-white bg-opacity-90 rounded-lg shadow-lg p-4`,
  headerContainer: `flex-row items-center gap-2 mb-3`,
  headerTitle: `text-sm font-semibold text-[#8b5cf6]`,
  connectionsContainer: `gap-3`,
  buttonGroup: `flex-row gap-3`,
  connectionButton: `flex-1 flex-row items-center justify-center py-2.5 px-3 rounded-lg gap-1.5`,
  activeButton: `bg-[rgba(139,92,246,0.1)]`,
  inactiveButton: `bg-[rgba(107,114,128,0.1)]`,
  buttonText: `text-sm font-medium`,
  activeText: `text-[#8b5cf6]`,
  inactiveText: `text-[#6b7280]`,
  connectionStatus: `flex-row items-center gap-2 py-2.5 px-3 rounded-lg border`,
  connectedBorder: `border-[rgba(139,92,246,0.2)]`,
  disconnectedBorder: `border-[rgba(239,68,68,0.2)]`,
  connectionText: `text-sm font-medium`,
  connectedText: `text-[#8b5cf6]`,
  disconnectedText: `text-[#ef4444]`
};

export default ConnectionStatus;