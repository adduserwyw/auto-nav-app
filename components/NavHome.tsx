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
import ConnectionStatus from "~/components/ConnectionStatus";
import {ModeSelector} from "~/components/ModeSelector";
import {CarStatus} from "~/components/CarStatus";


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
            position: 'top',
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
                       <View className="mt-20 gap-6">
                           <View className={styles.headerTitleContainer}>
                               <Bot color="#8b5cf6" size={24} />
                               <Text className={styles.headerTitle}>Auto-Nav Explorer</Text>
                               <Navigation color="#8b5cf6" size={24} />
                           </View>
                           <ConnectionStatus isConnected={isConnected} />
                       </View>

                       {/* Main Content */}
                       <View className="flex flex-column mt-6">
                           {/* Left Column */}
                           <View className="flex flex-column gap-6">
                               <ModeSelector mode={mode} onModeChange={handleModeChange} />
                               <View className="flex flex-row">
                                   <CarStatus {...carStatus}/>
                               </View>
                               <View>
                                   {/*<SpeedControl*/}
                                   {/*    onSpeedChange={handleSpeedChange}*/}
                                   {/*    currentSpeed={speed}*/}
                                   {/*/>*/}
                               </View>
                               {/*<Controls*/}
                               {/*    isRunning={isRunning}*/}
                               {/*    onToggleRunning={handleToggleRunning}*/}
                               {/*    onEmergencyStop={handleEmergencyStop}*/}
                               {/*/>*/}
                               {/*{mode === "manual" && (*/}
                               {/*    <DirectionalControls*/}
                               {/*        onDirectionPress={handleDirectionPress}*/}
                               {/*    />*/}
                               {/*)}*/}
                           </View>


                           {/*/!* Right Column *!/*/}
                           {/*    /!*{mode === "waypoint" && (*!/*/}
                           {/*    /!*    <View style={styles.rightColumn}>*!/*/}
                           {/*    /!*      <MapView*!/*/}
                           {/*    /!*          provider={PROVIDER_GOOGLE}*!/*/}
                           {/*    /!*          style={styles.map}*!/*/}
                           {/*    /!*          initialRegion={{*!/*/}
                           {/*    /!*            latitude: 37.78825,*!/*/}
                           {/*    /!*            longitude: -122.4324,*!/*/}
                           {/*    /!*            latitudeDelta: 0.0922,*!/*/}
                           {/*    /!*            longitudeDelta: 0.0421,*!/*/}
                           {/*    /!*          }}*!/*/}
                           {/*    /!*          onPress={(e) => {*!/*/}
                           {/*    /!*            const coordinate = e.nativeEvent.coordinate;*!/*/}
                           {/*    /!*            handleAddWaypoint({*!/*/}
                           {/*    /!*              lat: coordinate.latitude,*!/*/}
                           {/*    /!*              lng: coordinate.longitude*!/*/}
                           {/*    /!*            });*!/*/}
                           {/*    /!*          }}*!/*/}
                           {/*    /!*      >*!/*/}
                           {/*    /!*        {waypoints.map((wp, index) => (*!/*/}
                           {/*    /!*            <Marker*!/*/}
                           {/*    /!*                key={index}*!/*/}
                           {/*    /!*                coordinate={{*!/*/}
                           {/*    /!*                  latitude: wp.lat,*!/*/}
                           {/*    /!*                  longitude: wp.lng*!/*/}
                           {/*    /!*                }}*!/*/}
                           {/*    /!*                title={`Waypoint ${index + 1}`}*!/*/}
                           {/*    /!*                description={index === 0 ? "Current Target" : "Queued"}*!/*/}
                           {/*    /!*            />*!/*/}
                           {/*    /!*        ))}*!/*/}
                           {/*    /!*      </MapView>*!/*/}

                           {/*    /!*      /!* Waypoints List *!/*!/*/}
                           {/*    /!*      <View style={styles.waypointsContainer}>*!/*/}
                           {/*    /!*        <Text style={styles.waypointsTitle}>Waypoints</Text>*!/*/}
                           {/*    /!*        {waypoints.length === 0 ? (*!/*/}
                           {/*    /!*            <Text style={styles.noWaypointsText}>*!/*/}
                           {/*    /!*              No waypoints added yet*!/*/}
                           {/*    /!*            </Text>*!/*/}
                           {/*    /!*        ) : (*!/*/}
                           {/*    /!*            waypoints.map((wp, index) => (*!/*/}
                           {/*    /!*                <View key={index} style={styles.waypointItem}>*!/*/}
                           {/*    /!*                  <Text style={styles.waypointText}>*!/*/}
                           {/*    /!*                    Point {index + 1}: ({wp.lat.toFixed(6)}, {wp.lng.toFixed(6)})*!/*/}
                           {/*    /!*                  </Text>*!/*/}
                           {/*    /!*                  <Text style={styles.waypointStatus}>*!/*/}
                           {/*    /!*                    {index === 0 ? "Current Target" : "Queued"}*!/*/}
                           {/*    /!*                  </Text>*!/*/}
                           {/*    /!*                </View>*!/*/}
                           {/*    /!*            ))*!/*/}
                           {/*    /!*        )}*!/*/}
                           {/*    /!*      </View>*!/*/}
                           {/*    /!*    </View>*!/*/}
                           {/*    /!*)}*!/*/}
                       </View>
                       </ScrollView>
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
  rightColumn: `gap-4`,
  map: `h-[300px] w-full rounded-lg`,
  waypointsContainer: `bg-white rounded-lg p-4 shadow-md`,
  waypointsTitle: `text-lg font-semibold mb-3`,
  noWaypointsText: `text-gray-500`,
  waypointItem: `flex-row justify-between items-center bg-[#f9fafb] p-2 rounded-md my-1`,
  waypointText: `text-sm`,
  waypointStatus: `text-xs text-gray-500`
};