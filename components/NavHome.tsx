import React, { useEffect, useState } from 'react';
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import Toast from 'react-native-toast-message';
import ConnectionStatus from '~/components/ConnectionStatus';
import { ModeSelector } from '~/components/ModeSelector';
import { CarStatus } from '~/components/CarStatus';
import { SpeedControl } from '~/components/SpeedControl';
import { Controls } from '~/components/Controls';
import { DirectionControls } from '~/components/DirectionControls';
import { WaypointMap } from '~/components/WayPointMap';
import { Device } from 'react-native-ble-plx';

interface Coordinate {
  lat: number;
  lng: number;
}

const Index = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [connectedDevice, setConnectedDevice] = useState<Device | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [waypoints, setWaypoints] = useState<Coordinate[]>([]);
  const [speed, setSpeed] = useState(9);
  const [mode, setMode] = useState<'manual' | 'waypoint' | 'disconnected'>('disconnected');
  const [direction, setDirection] = useState<'up' | 'down' | 'left' | 'right' | null>(null);

  const carStatus = {
    battery: 85,
    obstacleDistance: null,
    speed: speed,
  };

  const handleDeviceConnect = (device: Device) => {
    if (device) {
      if (mode === 'disconnected') {
        setMode('manual');
      }
      setConnectedDevice(device);
    }
  };

  const showToast = (description: string, type: 'success' | 'error' = 'success') => {
    Toast.show({
      type: type === 'success' ? 'success' : 'error',
      text1: description,
      position: 'bottom',
    });
  };

  const handleAddWaypoint = (coordinate: Coordinate) => {
    setWaypoints([...waypoints, coordinate]);
    showToast('Waypoint added successfully');
  };

  const handleClearWaypoints = () => {
    setWaypoints([]);
    showToast('Waypoint cleared successfully');
  };

  const handleToggleRunning = () => {
    setIsRunning(!isRunning);
    showToast(isRunning ? 'Mission paused' : 'Mission resumed');
  };

  const handleEmergencyStop = () => {
    setIsRunning(false);
    setSpeed(0);
    showToast('Emergency stop activated', 'error');
  };

  const handleDirectionPress = (direction: 'up' | 'down' | 'left' | 'right') => {
    const directionMessages = {
      up: 'Moving forward',
      down: 'Moving backward',
      left: 'Turning left',
      right: 'Turning right',
    };
    setDirection(direction);
    setIsRunning(true);
    showToast(directionMessages[direction]);
  };

  const handleSpeedChange = (newSpeed: number) => {
    setSpeed(newSpeed);
    console.log('Speed updated:', newSpeed);
  };

  const handleModeChange = (newMode: 'manual' | 'waypoint' | 'disconnected') => {
    setMode(newMode);
    showToast(`Switched to ${newMode} mode`);
  };

  useEffect(() => {
    console.log('connectedDevice updated:', connectedDevice);
    if (!connectedDevice) {
      setMode('disconnected');
      setIsConnected(false);
    }
  }, [connectedDevice]);

  return (
    <SafeAreaView className={styles.container}>
      <ScrollView className={styles.scrollContainer}>
        {/* Header */}
        <View className="mt-16 gap-6">
          <ConnectionStatus
            isConnected={isConnected}
            onDeviceConnect={handleDeviceConnect}
            connectedDevice={connectedDevice}
          />
        </View>
        {/* Main Content */}
        {/*<View className="flex flex-column mt-6" style={[mode != "disconnected" && style.disabled]}>*/}
        <View className="flex-column mt-6 flex">
          {/* Left Column */}
          <View className="flex-column flex gap-6">
            <ModeSelector
              mode={mode}
              onModeChange={handleModeChange}
              onDeviceConnect={handleDeviceConnect}
              connectedDevice={connectedDevice}
            />
            {mode !== 'disconnected' && (
              <View>
                <SpeedControl
                  onSpeedChange={handleSpeedChange}
                  currentSpeed={speed}
                  connectedDevice={connectedDevice}
                />
                <View className="mt-6">
                  <Controls
                    isRunning={isRunning}
                    onToggleRunning={handleToggleRunning}
                    onEmergencyStop={handleEmergencyStop}
                    onDeviceConnect={handleDeviceConnect}
                    connectedDevice={connectedDevice}
                    direction={direction}
                  />
                </View>
              </View>
            )}
            {mode === 'manual' && (
              <DirectionControls
                onDirectionPress={handleDirectionPress}
                connectedDevice={connectedDevice}
              />
            )}
          </View>

          {mode === 'waypoint' && (
            <View
              className={`${styles.cardContainer} mt-6`}
              style={[mode != 'waypoint' && style.disabled]}>
              {/* Waypoint Map */}
              <WaypointMap
                onAddWaypoint={handleAddWaypoint}
                onClearWaypoints={handleClearWaypoints}
                connectedDevice={connectedDevice}
              />
              {/* Waypoints List */}
              <View style={style.panel}>
                <Text style={style.heading}>Waypoints</Text>
                {waypoints.length === 0 ? (
                  <Text style={style.noWaypointsText}>No waypoints added yet</Text>
                ) : (
                  <ScrollView style={style.waypointsList}>
                    {waypoints.map((wp, index) => (
                      <View key={index} style={style.waypointItem}>
                        <Text style={style.waypointText}>
                          Point {index + 1}: ({wp.lat.toFixed(6)}, {wp.lng.toFixed(6)})
                        </Text>
                        <Text style={style.waypointStatus}>
                          {index === 0 ? 'Current Target' : 'Queued'}
                        </Text>
                      </View>
                    ))}
                  </ScrollView>
                )}
              </View>
            </View>
          )}
          <View className="mt-6 flex" style={[style.disabled]}>
            <CarStatus {...carStatus} />
          </View>
        </View>
      </ScrollView>
      <Toast />
    </SafeAreaView>
  );
};

export default Index;

const styles = {
  container: `flex-1 bg-[#f9fafb]`,
  scrollContainer: `flex-grow px-4 py-2`,
  header: `flex-col justify-between items-center mb-4`,
  headerTitleContainer: `flex-row items-center gap-2`,
  headerTitle: `text-xl font-bold text-[#8b5cf6]`,
  mainContent: `flex-col gap-4`,
  leftColumn: `gap-4`,
  cardContainer: `bg-white bg-opacity-90 rounded-lg shadow-lg p-4`,
};

const style = StyleSheet.create({
  // container: {
  //     flex: 1,
  //     padding: 16,
  // },
  disabled: {
    opacity: 0.5,
    pointerEvents: 'none',
  },
  panel: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 8,
    padding: 16,
    marginTop: 16,
  },
  heading: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  noWaypointsText: {
    color: 'gray',
    fontSize: 14,
  },
  waypointsList: {
    marginTop: 8,
  },
  waypointItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 8,
    backgroundColor: '#f9f9f9',
    borderRadius: 6,
    marginBottom: 8,
  },
  waypointText: {
    fontSize: 14,
  },
  waypointStatus: {
    fontSize: 12,
    color: 'gray',
  },
});
