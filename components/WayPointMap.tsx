import { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, Pressable } from 'react-native';
import Svg, { Line } from 'react-native-svg';
import { MapPin } from 'lucide-react-native';
import Toast from 'react-native-toast-message';

interface Coordinate {
    lat: number;
    lng: number;
}

interface WaypointMapProps {
    onAddWaypoint: (coordinate: Coordinate) => void;
}

export const WaypointMap = ({ onAddWaypoint }: WaypointMapProps) => {
    const [points, setPoints] = useState<Coordinate[]>([]);
    const mapRef = useRef<View>(null);
    const { width } = Dimensions.get('window');
    const mapHeight = 300;

    const handlePress = (e: any) => {
        if (!mapRef.current) return;

        // Get coordinates relative to the map view
        const { locationX: x, locationY: y } = e.nativeEvent;

        // Convert pixel coordinates to lat/lng (simplified mapping)
        const lat = ((mapHeight - y) / mapHeight) * 90;
        const lng = ((x / width) * 360) - 180;

        const newPoint = { lat, lng };
        setPoints(prev => [...prev, newPoint]);
        onAddWaypoint(newPoint);
        Toast.show({
            type: 'info',
            text1: `Waypoint added at coordinates: " + ${lat.toFixed(6)}+ ", " + ${lng.toFixed(6)}`,
            position: 'bottom'
        });
    };

    // Convert lat/lng to pixel coordinates for display
    const getPixelCoordinates = (coord: Coordinate) => {
        const x = ((coord.lng + 180) / 360) * width;
        const y = mapHeight - ((coord.lat / 90) * mapHeight);
        return { x, y };
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Visual Waypoint Map</Text>
            <Pressable
                ref={mapRef}
                onPress={handlePress}
                style={styles.mapContainer}
            >
                {/* Grid Background */}
                <View style={styles.grid}>
                    {Array.from({ length: 64 }).map((_, i) => (
                        <View key={i} style={styles.gridCell} />
                    ))}
                </View>

                {/* SVG for connecting lines */}
                <Svg style={StyleSheet.absoluteFill}>
                    {points.map((point, index) => {
                        if (index === 0) return null;
                        const prevPoint = points[index - 1];
                        const start = getPixelCoordinates(prevPoint);
                        const end = getPixelCoordinates(point);

                        return (
                            <Line
                                key={`line-${index}`}
                                x1={start.x}
                                y1={start.y}
                                x2={end.x}
                                y2={end.y}
                                stroke="#007AFF"
                                strokeWidth="2"
                                strokeDasharray="4"
                            />
                        );
                    })}
                </Svg>

                {/* Waypoint markers */}
                {points.map((point, index) => {
                    const { x, y } = getPixelCoordinates(point);
                    return (
                        <View
                            key={`point-${index}`}
                            style={[
                                styles.waypoint,
                                {
                                    left: x - 6,
                                    top: y - 6,
                                }
                            ]}
                        >
                            <Text style={styles.waypointLabel}>{index + 1}</Text>
                        </View>
                    );
                })}

                <View style={styles.centerPin}>
                    <MapPin color="#8b5cf6" size={24} style={{ opacity: 0.75 }} />
                </View>
            </Pressable>

            <Text style={styles.helpText}>
                Tap anywhere on the map to add a waypoint. Points will be automatically connected in sequence.
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 4,
        // backgroundColor: '#FFFFFF',
        // borderRadius: 12,
        // shadowColor: '#000',
        // shadowOffset: { width: 0, height: 2 },
        // shadowOpacity: 0.1,
        // shadowRadius: 4,
        // elevation: 3,
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 16,
    },
    mapContainer: {
        width: '100%',
        height: 300,
        backgroundColor: '#F1F5F9',
        borderRadius: 8,
        overflow: 'hidden',
        position: 'relative',
    },
    grid: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    gridCell: {
        width: '12.5%',
        height: '12.5%',
        borderWidth: 0.5,
        borderColor: 'rgba(203, 213, 225, 0.5)',
    },
    waypoint: {
        position: 'absolute',
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#007AFF',
    },
    waypointLabel: {
        position: 'absolute',
        top: -24,
        width: 20,
        textAlign: 'center',
        color: '#007AFF',
        fontSize: 12,
        fontWeight: '500',
    },
    centerPin: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: [{ translateX: -12 }, { translateY: -12 }],
    },
    helpText: {
        marginTop: 16,
        fontSize: 14,
        color: '#64748B',
    },
});
