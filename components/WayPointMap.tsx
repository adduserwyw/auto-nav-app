import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import {
  LeafletView,
  MapMarker,
  MapShape,
  MapShapeType,
  WebviewLeafletMessage,
} from 'react-native-leaflet-view';
import Toast from 'react-native-toast-message';
import { BASIC_COMMANDS, sendBluetoothCommand, sendWaypoints } from '~/utils/bluetoothCommands';
import { Device } from 'react-native-ble-plx';

interface WaypointMapProps {
  onAddWaypoint: (coordinate: Coordinate) => void;
  onClearWaypoints: () => void;
  connectedDevice: Device | null;
}

interface Coordinate {
  lat: number;
  lng: number;
}

export const WaypointMap: React.FC<WaypointMapProps> = ({
  onAddWaypoint,
  onClearWaypoints,
  connectedDevice,
}) => {
  const [points, setPoints] = useState<Coordinate[]>([]);
  const [isMoving, setIsMoving] = useState(false);
  const [carPosition, setCarPosition] = useState<Coordinate | null>(null);
  const [mapError, setMapError] = useState<string | null>(null);

  // Initial map settings
  const initialCenter = { lat: 61, lng: 60 };
  const mapLayers = [
    {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      baseLayerIsChecked: true,
      baseLayerName: 'OpenStreetMap.Mapnik',
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    },
  ];

  // Convert points to markers for Leaflet
  const markers: MapMarker[] = points.map((point, index) => ({
    id: `marker-${index}`,
    position: { lat: point.lat, lng: point.lng },
    icon: '📍',
    size: [24, 24],
    title: `Waypoint ${index + 1}`,
  }));

  // Create path line for connected waypoints
  const pathLine: MapShape | null =
    points.length > 1
      ? {
          shapeType: MapShapeType.POLYLINE,
          color: '#8b5cf6',
          id: 'path',
          positions: points.map((p) => ({ lat: p.lat, lng: p.lng })),
        }
      : null;

  // Car marker
  const carMarker: MapMarker | null = carPosition
    ? {
        id: 'car',
        position: carPosition,
        icon: '🚗',
        size: [24, 24],
      }
    : null;

  const handleMapPress = (message: WebviewLeafletMessage) => {
    if (!connectedDevice) return;
    // sendWaypoints(connectedDevice, `(${newPoint.lat},${newPoint.lng}),`);
    sendWaypoints(connectedDevice, ` (1,2)`);
    if (message.event === 'onMapClicked' && message.payload) {
      const newPoint = {
        lat: message.payload.touchLatLng.lat,
        lng: message.payload.touchLatLng.lng,
      };
      setPoints((prev) => [...prev, newPoint]);
      onAddWaypoint(newPoint);
      if (!connectedDevice) return;
      console.log('New Point !!!!!', ` (${newPoint.lat},${newPoint.lng})`);
      // sendWaypoints(connectedDevice, `(${newPoint.lat},${newPoint.lng}),`);
      sendWaypoints(connectedDevice, ` (1,2)`);
      Toast.show({
        type: 'info',
        text1: 'Waypoint Added',
        text2: `Coordinates: ${newPoint.lat.toFixed(6)}, ${newPoint.lng.toFixed(6)}`,
        position: 'bottom',
      });
    }
  };

  const handleMapError = (error: WebviewLeafletMessage) => {
    console.error('Map error:', error);
    setMapError('Failed to load map. Please check your internet connection.');
  };

  const startCarMovement = async () => {
    if (points.length < 2 || isMoving) return;

    setIsMoving(true);
    setCarPosition(points[0]);

    for (let i = 1; i < points.length; i++) {
      const end = points[i];
      setCarPosition(end);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    setIsMoving(false);
    Toast.show({
      type: 'success',
      text1: 'Route Completed!',
      position: 'bottom',
    });
  };

  const handleClearAll = () => {
    setPoints([]);
    onClearWaypoints();
    setCarPosition(null);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Visual Waypoint Map</Text>

      <View style={styles.mapContainer}>
        {mapError ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{mapError}</Text>
          </View>
        ) : (
          <LeafletView
            mapCenterPosition={initialCenter}
            mapMarkers={[...markers, ...(carMarker ? [carMarker] : [])]}
            mapShapes={pathLine ? [pathLine] : []}
            mapLayers={mapLayers}
            zoom={8}
            onMessageReceived={handleMapPress}
            doDebug={true}
            renderLoading={() => <Text>Loading map...</Text>}
          />
        )}
      </View>

      <Text style={styles.helpText}>
        Tap anywhere on the map to add a waypoint. Points will be automatically connected in
        sequence.
      </Text>

      <View style={styles.buttonContainer}>
        <Pressable
          style={[styles.button, styles.destructiveButton]}
          onPress={handleClearAll}
          disabled={isMoving}>
          <Text style={styles.buttonText}>Clear All</Text>
        </Pressable>

        <Pressable
          style={[
            styles.button,
            styles.primaryButton,
            (points.length < 2 || isMoving) && styles.disabledButton,
          ]}
          onPress={startCarMovement}
          disabled={points.length < 2 || isMoving}>
          <Text style={styles.buttonText}>{isMoving ? 'Moving...' : 'Start Movement'}</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  mapContainer: {
    width: '100%',
    height: 300,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#F1F5F9',
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  errorText: {
    color: '#ef4444',
    textAlign: 'center',
  },
  helpText: {
    marginTop: 16,
    fontSize: 14,
    color: '#64748B',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    gap: 8,
  },
  button: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
  },
  primaryButton: {
    backgroundColor: '#8b5cf6',
  },
  destructiveButton: {
    backgroundColor: '#ef4444',
  },
  disabledButton: {
    opacity: 0.5,
  },
});
