import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Battery, Navigation2, Shield, Bot, Car, RefreshCw } from 'lucide-react-native';
import Toast from 'react-native-toast-message';

interface CarStatusProps {
  battery: number;
  obstacleDistance: number | null;
  speed: number;
}

interface CarLocation {
  lat: string;
  lng: string;
  timestamp: Date;
}

export const CarStatus = ({ battery, obstacleDistance, speed }: CarStatusProps) => {
  const [carLocation, setCarLocation] = useState<CarLocation | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const getCarPosition = async () => {
    setIsLoading(true);
    try {
      // Replace with actual API call
      const response = await fetch('your-car-api-endpoint/location');
      const data = await response.json();

      // Mock data - replace with actual API response
      const carPosition: CarLocation = {
        lat: '37.7749',
        lng: '-122.4194',
        timestamp: new Date(),
      };

      setCarLocation(carPosition);
      Toast.show({
        type: 'success',
        text1: 'Car position loaded',
        position: 'bottom',
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Failed to get car location',
        position: 'bottom',
      });
      console.error('Error fetching car position:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getBatteryColor = (level: number) => {
    if (level > 50) return '#22c55e'; // success green
    if (level > 20) return '#f59e0b'; // warning yellow
    return '#ef4444'; // error red
  };

  const getObstacleColor = (distance: number | null) => {
    if (distance === null) return '#94a3b8'; // neutral gray
    if (distance > 100) return '#22c55e'; // success green
    if (distance > 50) return '#f59e0b'; // warning yellow
    return '#ef4444'; // error red
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Bot color="#a855f7" size={20} />
        <Text style={styles.title}>Vehicle Status</Text>
      </View>

      <View style={styles.grid}>
        <View style={styles.gridItem}>
          <Battery color={getBatteryColor(battery)} size={24} />
          <Text style={styles.value}>{battery}%</Text>
          <Text style={styles.label}>Battery</Text>
        </View>

        <View style={styles.gridItem}>
          <Shield color={getObstacleColor(obstacleDistance)} size={24} />
          <Text style={styles.value}>{obstacleDistance ? `${obstacleDistance}cm` : 'N/A'}</Text>
          <Text style={styles.label}>Obstacle</Text>
        </View>

        <View style={styles.gridItem}>
          <Navigation2 color="#a855f7" size={24} />
          <Text style={styles.value}>{speed} km/h</Text>
          <Text style={styles.label}>Speed</Text>
        </View>
      </View>

      {/* Car Location Display Box */}
      <View style={styles.locationContainer}>
        <View style={styles.locationHeader}>
          <View style={styles.locationTitleContainer}>
            <Car color="#a855f7" size={20} />
            <Text style={styles.locationTitle}>Car's Current Location</Text>
          </View>
          <TouchableOpacity
            onPress={getCarPosition}
            disabled={isLoading}
            style={styles.refreshButton}>
            {isLoading ? (
              <ActivityIndicator size="small" color="#a855f7" />
            ) : (
              <RefreshCw color="#a855f7" size={16} />
            )}
            <Text style={styles.refreshText}>Refresh</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.locationGrid}>
          <View>
            <Text style={styles.locationLabel}>Latitude: </Text>
            <Text style={styles.locationValue}>{carLocation?.lat || 'N/A'}</Text>
          </View>
          <View>
            <Text style={styles.locationLabel}>Longitude: </Text>
            <Text style={styles.locationValue}>{carLocation?.lng || 'N/A'}</Text>
          </View>
        </View>

        <Text style={styles.timestamp}>
          Last Updated: {carLocation ? carLocation.timestamp.toLocaleString() : 'Never'}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    // borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    // shadowRadius: 4,
    // elevation: 3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  grid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  gridItem: {
    flex: 1,
    alignItems: 'center',
    gap: 8,
  },
  value: {
    fontSize: 14,
    fontWeight: '500',
  },
  label: {
    fontSize: 12,
    color: '#64748b',
  },
  locationContainer: {
    marginTop: 16,
    padding: 12,
    backgroundColor: 'rgba(167, 139, 250, 0.1)',
    borderRadius: 8,
  },
  locationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  locationTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  locationTitle: {
    fontSize: 14,
    fontWeight: '500',
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  refreshText: {
    fontSize: 12,
    color: '#a855f7',
  },
  locationGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  locationLabel: {
    fontSize: 12,
    color: '#64748b',
  },
  locationValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  timestamp: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 12,
  },
});
