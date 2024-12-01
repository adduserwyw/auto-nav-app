import React from 'react';
import { View, Text,StyleSheet } from 'react-native';
import { Battery, Navigation2, Shield, Bot } from "lucide-react-native";

interface CarStatusProps {
    battery: number;
    obstacleDistance: number | null;
    speed: number;
}

export const CarStatus = ({ battery, obstacleDistance, speed }: CarStatusProps) => {
    const getBatteryColor = (level: number) => {
        if (level > 50) return "#22c55e";
        if (level > 20) return "#f59e0b";
        return "#ef4444";
    };

    const getObstacleColor = (distance: number | null) => {
        if (distance === null) return "#6b7280";
        if (distance > 100) return "#22c55e";
        if (distance > 50) return "#f59e0b";
        return "#ef4444";
    };

    return (
        <View className="bg-white bg-opacity-90 rounded-lg shadow-lg p-4 flex-grow">
            <Text className="text-xl font-bold mb-4 text-center">Vehicle Status</Text>
            <View className="flex-row items-center justify-between mb-3">
                <View className="flex-row items-center">
                    <Battery style={[styles.icon]} color={getBatteryColor(battery)} />
                    <Text>Battery</Text>
                </View>
                <Text className={getBatteryColor(battery)}>{battery}%</Text>
            </View>

            <View className="flex-row items-center justify-between mb-3">
                <View className="flex-row items-center">
                    <Shield style={[styles.icon]} color={getObstacleColor(obstacleDistance)} />
                    <Text>Obstacle</Text>
                </View>
                <Text className={getObstacleColor(obstacleDistance)}>
                    {obstacleDistance ? `${obstacleDistance}cm` : 'N/A'}
                </Text>
            </View>

            <View className="flex-row items-center justify-between">
                <View className="flex-row items-center">
                    <Navigation2 style={[styles.icon]} color={"#7A288A"} />
                    <Text>Speed</Text>
                </View>
                <Text>{speed} km/h</Text>
            </View>
        </View>
    );

};


const styles = StyleSheet.create({
    icon: {
        marginRight: 8,
    }
});