import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, Pressable } from 'react-native';
import Svg, { Line } from 'react-native-svg';
import { MapPin, Car } from 'lucide-react-native';
import Toast from 'react-native-toast-message';
import Animated, {
    useAnimatedStyle,
    withTiming,
    useSharedValue
} from 'react-native-reanimated';


interface Coordinate {
    lat: number;
    lng: number;
}

interface WaypointMapProps {
    onAddWaypoint: (coordinate: Coordinate) => void;
    onClearWaypoints: () => void;
}

export const WaypointMap: React.FC<WaypointMapProps> = ({ onAddWaypoint,onClearWaypoints  }) => {
    const [points, setPoints] = useState<Coordinate[]>([]);
    const [isMoving, setIsMoving] = useState(false);
    const [carPosition, setCarPosition] = useState<Coordinate | null>(null);
    const mapRef = useRef<View>(null);
    const { width } = Dimensions.get('window');
    const mapHeight = 300;


    // // Animated values for car movement
    const carX = useSharedValue(0);
    const carY = useSharedValue(0);

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
            text1: 'Waypoint Added',
            text2: `Coordinates: ${lat.toFixed(6)}, ${lng.toFixed(6)}`,
            position: 'bottom'
        });
    };

    // Convert lat/lng to pixel coordinates for display
    const getPixelCoordinates = (coord: Coordinate) => {
        const x = ((coord.lng + 180) / 360) * width;
        const y = mapHeight - ((coord.lat / 90) * mapHeight);
        return { x, y };
    };

    // Animated style for the car
    const animatedCarStyle = useAnimatedStyle(() => {
        return {
            transform: [
                { translateX: carX.value },
                { translateY: carY.value },
            ],
        };
    });

    const startCarMovement = async () => {
        if (points.length < 2 || isMoving) return;

        setIsMoving(true);
        // const start = points[1];
        // const startPixels = getPixelCoordinates(start);
        setCarPosition({lat:50,lng:50});

        for (let i = 1; i < points.length; i++) {
            const start = points[i-1];
            const end = points[i];
            const startPixels = getPixelCoordinates(start);
            const endPixels = getPixelCoordinates(end);

            carX.value = withTiming(endPixels.x - 12, { duration: 1000 });
            carY.value = withTiming(endPixels.y - 12, { duration: 1000 });

            setCarPosition(end);
            await new Promise(resolve => setTimeout(resolve, 1000));
        }

        setIsMoving(false);
        Toast.show({
            type: 'success',
            text1: 'Route Completed!',
            position: 'bottom'
        });
    };

    const handleClearAll = async () => {
        setPoints([]);
        onClearWaypoints();
        setCarPosition(null);
        // try {
        //     const response = await fetch('http://localhost:3001/command', {
        //         method: 'POST',
        //         headers: {
        //             'Content-Type': 'application/json',
        //         },
        //         body: JSON.stringify({ command: 'c' }),
        //     });
        //     if (response.ok) {
        //         Toast.show({
        //             type: 'success',
        //             text1: 'Success',
        //             text2: 'Cleared all waypoints and sent clear command to car',
        //             position: 'bottom'
        //         });
        //     } else {
        //         throw new Error('Failed to send command');
        //     }
        // } catch (error) {
        //     Toast.show({
        //         type: 'error',
        //         text1: 'Error',
        //         text2: 'Failed to send clear command to car',
        //         position: 'bottom'
        //     });
        // }
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
                <Svg style={StyleSheet.absoluteFillObject}>
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
                                stroke="#8b5cf6"
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

                {carPosition && (
                    <Animated.View style={[styles.car, animatedCarStyle]}>
                        <Car size={24} color="#8b5cf6" />
                    </Animated.View>
                )}
            </Pressable>

            <Text style={styles.helpText}>
                Tap anywhere on the map to add a waypoint. Points will be automatically connected in sequence.
            </Text>

            <View style={styles.buttonContainer}>
                <Pressable
                    style={[styles.button, styles.destructiveButton]}
                    onPress={handleClearAll}
                    disabled={isMoving}
                >
                    <Text style={styles.buttonText}>Clear All</Text>
                </Pressable>

                <Pressable
                    style={[
                        styles.button,
                        styles.primaryButton,
                        (points.length < 2 || isMoving) && styles.disabledButton
                    ]}
                    onPress={startCarMovement}
                    disabled={points.length < 2 || isMoving}
                >
                    <Text style={styles.buttonText}>
                        {isMoving ? "Moving..." : "Start Movement"}
                    </Text>
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
        backgroundColor: '#8b5cf6',
    },
    waypointLabel: {
        position: 'absolute',
        top: -24,
        width: 20,
        textAlign: 'center',
        color: '#8b5cf6',
        fontSize: 12,
        fontWeight: '500',
    },
    centerPin: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: [{ translateX: -12 }, { translateY: -12 }],
    },
    car: {
        position: 'absolute',
        width: 24,
        height: 24,
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



// import React, { useState, useRef } from 'react';
// import { View, Text, StyleSheet, Dimensions, Pressable, Platform } from 'react-native';
// import MapView, { Marker, Polyline, PROVIDER_DEFAULT } from 'react-native-maps';
// import { MapPin, Car } from 'lucide-react-native';
// import Toast from 'react-native-toast-message';
// import Animated, {
//     useAnimatedStyle,
//     withTiming,
//     useSharedValue
// } from 'react-native-reanimated';
//
// interface Coordinate {
//     latitude: number;
//     longitude: number;
// }
//
// interface WaypointMapProps {
//     onAddWaypoint: (coordinate: Coordinate) => void;
//     onClearWaypoints: () => void;
// }
//
// export const WaypointMap: React.FC<WaypointMapProps> = ({ onAddWaypoint, onClearWaypoints }) => {
//     const [points, setPoints] = useState<Coordinate[]>([]);
//     const [isMoving, setIsMoving] = useState(false);
//     const [carPosition, setCarPosition] = useState<Coordinate | null>(null);
//     const mapRef = useRef<MapView>(null);
//     const { width } = Dimensions.get('window');
//     const mapHeight = 300;
//
//     // Initial region for the map
//     const initialRegion = {
//         latitude: 0,
//         longitude: 0,
//         latitudeDelta: 100,
//         longitudeDelta: 100,
//     };
//
//     const handleMapPress = (e: any) => {
//         const coordinate = e.nativeEvent.coordinate;
//         const newPoint = {
//             latitude: coordinate.latitude,
//             longitude: coordinate.longitude,
//         };
//
//         setPoints(prev => [...prev, newPoint]);
//         onAddWaypoint(newPoint);
//
//         Toast.show({
//             type: 'info',
//             text1: 'Waypoint Added',
//             text2: `Coordinates: ${coordinate.latitude.toFixed(6)}, ${coordinate.longitude.toFixed(6)}`,
//             position: 'bottom'
//         });
//     };
//
//     const animateToNextPoint = async (start: Coordinate, end: Coordinate) => {
//         const duration = 1000; // 1 second
//         const frames = 60; // 60 frames per animation
//         const latDiff = end.latitude - start.latitude;
//         const lngDiff = end.longitude - start.longitude;
//
//         for (let i = 0; i <= frames; i++) {
//             const progress = i / frames;
//             const currentPosition = {
//                 latitude: start.latitude + (latDiff * progress),
//                 longitude: start.longitude + (lngDiff * progress),
//             };
//             setCarPosition(currentPosition);
//             await new Promise(resolve => setTimeout(resolve, duration / frames));
//         }
//     };
//
//     const startCarMovement = async () => {
//         if (points.length < 2 || isMoving) return;
//
//         setIsMoving(true);
//         setCarPosition(points[0]);
//
//         for (let i = 1; i < points.length; i++) {
//             const start = points[i - 1];
//             const end = points[i];
//             await animateToNextPoint(start, end);
//         }
//
//         setIsMoving(false);
//         Toast.show({
//             type: 'success',
//             text1: 'Route Completed!',
//             position: 'bottom'
//         });
//     };
//
//     const handleClearAll = () => {
//         setPoints([]);
//         setCarPosition(null);
//         onClearWaypoints();
//         Toast.show({
//             type: 'success',
//             text1: 'Cleared all waypoints',
//             position: 'bottom'
//         });
//     };
//
//     // Custom marker component for waypoints
//     const WaypointMarker = ({ index }: { index: number }) => (
//         <View style={styles.waypointMarker}>
//             <Text style={styles.waypointLabel}>{index + 1}</Text>
//         </View>
//     );
//
//     // Custom marker component for car
//     const CarMarker = () => (
//         <View style={styles.carMarker}>
//             <Car size={24} color="#8b5cf6" />
//         </View>
//     );
//
//     return (
//         <View style={styles.container}>
//             <Text style={styles.title}>Visual Waypoint Map</Text>
//
//             <MapView
//                 ref={mapRef}
//                 provider={PROVIDER_DEFAULT} // This will use OSM on Android and Apple Maps on iOS
//                 style={styles.map}
//                 initialRegion={initialRegion}
//                 onPress={handleMapPress}
//                 // OSM specific styling
//                 customMapStyle={[]}
//                 mapType="standard"
//             >
//                 {/* Polyline connecting waypoints */}
//                 <Polyline
//                     coordinates={points}
//                     strokeColor="#8b5cf6"
//                     strokeWidth={2}
//                     lineDashPattern={[4, 4]}
//                 />
//
//                 {/* Waypoint markers */}
//                 {points.map((point, index) => (
//                     <Marker
//                         key={`waypoint-${index}`}
//                         coordinate={point}
//                     >
//                         <WaypointMarker index={index} />
//                     </Marker>
//                 ))}
//
//                 {/* Car marker */}
//                 {carPosition && (
//                     <Marker
//                         coordinate={carPosition}
//                     >
//                         <CarMarker />
//                     </Marker>
//                 )}
//             </MapView>
//
//             <Text style={styles.helpText}>
//                 Tap anywhere on the map to add a waypoint. Points will be automatically connected in sequence.
//             </Text>
//
//             <View style={styles.buttonContainer}>
//                 <Pressable
//                     style={[styles.button, styles.destructiveButton]}
//                     onPress={handleClearAll}
//                     disabled={isMoving}
//                 >
//                     <Text style={styles.buttonText}>Clear All</Text>
//                 </Pressable>
//
//                 <Pressable
//                     style={[
//                         styles.button,
//                         styles.primaryButton,
//                         (points.length < 2 || isMoving) && styles.disabledButton
//                     ]}
//                     onPress={startCarMovement}
//                     disabled={points.length < 2 || isMoving}
//                 >
//                     <Text style={styles.buttonText}>
//                         {isMoving ? "Moving..." : "Start Movement"}
//                     </Text>
//                 </Pressable>
//             </View>
//         </View>
//     );
// };
//
// const styles = StyleSheet.create({
//     container: {
//         padding: 4,
//     },
//     title: {
//         fontSize: 18,
//         fontWeight: '600',
//         marginBottom: 16,
//     },
//     map: {
//         width: '100%',
//         height: 300,
//         borderRadius: 8,
//         overflow: 'hidden',
//     },
//     waypointMarker: {
//         width: 24,
//         height: 24,
//         backgroundColor: '#8b5cf6',
//         borderRadius: 12,
//         alignItems: 'center',
//         justifyContent: 'center',
//         borderWidth: 2,
//         borderColor: 'white',
//     },
//     waypointLabel: {
//         color: 'white',
//         fontSize: 12,
//         fontWeight: '600',
//     },
//     carMarker: {
//         width: 32,
//         height: 32,
//         backgroundColor: 'white',
//         borderRadius: 16,
//         alignItems: 'center',
//         justifyContent: 'center',
//         borderWidth: 2,
//         borderColor: '#8b5cf6',
//     },
//     helpText: {
//         marginTop: 16,
//         fontSize: 14,
//         color: '#64748B',
//     },
//     buttonContainer: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         marginTop: 16,
//         gap: 8,
//     },
//     button: {
//         flex: 1,
//         padding: 12,
//         borderRadius: 8,
//         alignItems: 'center',
//     },
//     buttonText: {
//         color: 'white',
//         fontWeight: '600',
//     },
//     primaryButton: {
//         backgroundColor: '#8b5cf6',
//     },
//     destructiveButton: {
//         backgroundColor: '#ef4444',
//     },
//     disabledButton: {
//         opacity: 0.5,
//     },
// });