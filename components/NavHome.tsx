import React, { useState } from 'react';
import {
    View,
    Text,
    SafeAreaView,
    ScrollView,
    TouchableOpacity,
    StyleSheet
} from 'react-native';
import { Bot, Navigation } from 'lucide-react-native';
import Toast from 'react-native-toast-message';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import ConnectionStatus from "~/components/ConnectionStatus";
import {ModeSelector} from "~/components/ModeSelector";
import {CarStatus} from "~/components/CarStatus";
import {SpeedControl} from "~/components/SpeedControl";
import {Controls} from "~/components/Controls";
import {DirectionalControls} from "~/components/DirectionalControls";
import {WaypointMap} from "~/components/WayPointMap";


interface Coordinate {
    lat: number;
    lng: number;
}

const Index = () => {
 const [isConnected, setIsConnected] = useState(false);
    const [isRunning, setIsRunning] = useState(false);
    const [waypoints, setWaypoints] = useState<Coordinate[]>([]);
    const [speed, setSpeed] = useState(15);
    const [mode, setMode] = useState<"manual" | "waypoint">("manual");

    const carStatus = {
        battery: 85,
        obstacleDistance: null,
        speed: speed,
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
        showToast("Waypoint added successfully");
    };

    const handleToggleRunning = () => {
        setIsRunning(!isRunning);
        showToast(isRunning ? "Mission paused" : "Mission resumed");
    };

    const handleEmergencyStop = () => {
        setIsRunning(false);
        setSpeed(0);
        showToast("Emergency stop activated", 'error');
    };

    const handleDirectionPress = (direction: 'up' | 'down' | 'left' | 'right') => {
        if (mode === "waypoint") return;
        const directionMessages = {
            up: "Moving forward",
            down: "Moving backward",
            left: "Turning left",
            right: "Turning right"
        };
        showToast(directionMessages[direction]);
    };

    const handleSpeedChange = (newSpeed: number) => {
        setSpeed(newSpeed);
        console.log("Speed updated:", newSpeed);
    };

    const handleModeChange = (newMode: "manual" | "waypoint") => {
        setMode(newMode);
        showToast(`Switched to ${newMode} mode`);
    };

return(
        <SafeAreaView className={styles.container}>
                   <ScrollView className={styles.scrollContainer}>
                       {/* Header */}
                       <View className="mt-16 gap-6">
                           {/*<View className={styles.headerTitleContainer}>*/}
                           {/*    <Bot color="#8b5cf6" size={24} />*/}
                           {/*    <Text className={styles.headerTitle}>Auto-Nav Explorer</Text>*/}
                           {/*    <Navigation color="#8b5cf6" size={24} />*/}
                           {/*</View>*/}
                           <ConnectionStatus isConnected={isConnected} />
                       </View>

                       {/* Main Content */}
                       <View className="flex flex-column mt-6">
                           {/* Left Column */}
                           <View className="flex flex-column gap-6">
                               <ModeSelector mode={mode} onModeChange={handleModeChange} />
                               <View className="flex">
                                   <CarStatus {...carStatus}/>
                               </View>
                               <View>
                                   <SpeedControl
                                       onSpeedChange={handleSpeedChange}
                                       currentSpeed={speed}
                                   />
                               </View>
                               <Controls
                                   isRunning={isRunning}
                                   onToggleRunning={handleToggleRunning}
                                   onEmergencyStop={handleEmergencyStop}
                               />
                               {mode === "manual" && (
                                   <DirectionalControls
                                       onDirectionPress={handleDirectionPress}
                                   />
                               )}
                           </View>


                           {/*/!* Right Column *!/*/}
                           <View className={`${styles.cardContainer} mt-6`} style={[mode === "manual" && style.disabled]}>
                               {/* Waypoint Map */}
                               <WaypointMap onAddWaypoint={handleAddWaypoint} />
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
                                                       {index === 0 ? "Current Target" : "Queued"}
                                                   </Text>
                                               </View>
                                           ))}
                                       </ScrollView>
                                   )}
                               </View>
                           </View>

                           {/*    {mode === "waypoint" && (*/}
                           {/*        <View className={styles.rightColumn}>*/}
                           {/*          <MapView*/}
                           {/*              provider={PROVIDER_GOOGLE}*/}
                           {/*              className={styles.map}*/}
                           {/*              initialRegion={{*/}
                           {/*                latitude: 37.78825,*/}
                           {/*                longitude: -122.4324,*/}
                           {/*                latitudeDelta: 0.0922,*/}
                           {/*                longitudeDelta: 0.0421,*/}
                           {/*              }}*/}
                           {/*              onPress={(e) => {*/}
                           {/*                const coordinate = e.nativeEvent.coordinate;*/}
                           {/*                handleAddWaypoint({*/}
                           {/*                  lat: coordinate.latitude,*/}
                           {/*                  lng: coordinate.longitude*/}
                           {/*                });*/}
                           {/*              }}*/}
                           {/*          >*/}
                           {/*            {waypoints.map((wp, index) => (*/}
                           {/*                <Marker*/}
                           {/*                    key={index}*/}
                           {/*                    coordinate={{*/}
                           {/*                      latitude: wp.lat,*/}
                           {/*                      longitude: wp.lng*/}
                           {/*                    }}*/}
                           {/*                    title={`Waypoint ${index + 1}`}*/}
                           {/*                    description={index === 0 ? "Current Target" : "Queued"}*/}
                           {/*                />*/}
                           {/*            ))}*/}
                           {/*          </MapView>*/}

                           {/*          /!* Waypoints List *!/*/}
                           {/*          <View className={styles.waypointsContainer}>*/}
                           {/*            <Text className={styles.waypointsTitle}>Waypoints</Text>*/}
                           {/*            {waypoints.length === 0 ? (*/}
                           {/*                <Text className={styles.noWaypointsText}>*/}
                           {/*                  No waypoints added yet*/}
                           {/*                </Text>*/}
                           {/*            ) : (*/}
                           {/*                waypoints.map((wp, index) => (*/}
                           {/*                    <View key={index} className={styles.waypointItem}>*/}
                           {/*                      <Text className={styles.waypointText}>*/}
                           {/*                        Point {index + 1}: ({wp.lat.toFixed(6)}, {wp.lng.toFixed(6)})*/}
                           {/*                      </Text>*/}
                           {/*                      <Text className={styles.waypointStatus}>*/}
                           {/*                        {index === 0 ? "Current Target" : "Queued"}*/}
                           {/*                      </Text>*/}
                           {/*                    </View>*/}
                           {/*                ))*/}
                           {/*            )}*/}
                           {/*          </View>*/}
                           {/*        </View>*/}
                           {/*    )}*/}
                       </View>
                       </ScrollView>
            <Toast/>
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
        pointerEvents: "none",
    },
    panel: {
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        borderRadius: 8,
        padding: 16,
        marginTop: 16,
    },
    heading: {
        fontSize: 18,
        fontWeight: "600",
        marginBottom: 12,
    },
    noWaypointsText: {
        color: "gray",
        fontSize: 14,
    },
    waypointsList: {
        marginTop: 8,
    },
    waypointItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 8,
        backgroundColor: "#f9f9f9",
        borderRadius: 6,
        marginBottom: 8,
    },
    waypointText: {
        fontSize: 14,
    },
    waypointStatus: {
        fontSize: 12,
        color: "gray",
    },
});