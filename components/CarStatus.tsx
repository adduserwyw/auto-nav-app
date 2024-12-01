import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Battery, Navigation2, Shield, Bot } from 'lucide-react-native';

interface CarStatusProps {
    battery: number;
    obstacleDistance: number | null;
    speed: number;
}

export const CarStatus = ({ battery, obstacleDistance, speed }: CarStatusProps) => {
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
        <View className={style.container}>
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
                    <Text style={styles.value}>
                        {obstacleDistance ? `${obstacleDistance}cm` : 'N/A'}
                    </Text>
                    <Text style={styles.label}>Obstacle</Text>
                </View>

                <View style={styles.gridItem}>
                    <Navigation2 color="#a855f7" size={24} />
                    <Text style={styles.value}>{speed} km/h</Text>
                    <Text style={styles.label}>Speed</Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderRadius: 12,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
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
        color: '#64748b', // muted text color
    },
});


const style={
    container: `bg-white bg-opacity-90 rounded-lg shadow-lg p-4`,
};