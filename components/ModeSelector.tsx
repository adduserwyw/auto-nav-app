import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';

interface ModeSelectorProps {
    mode: "manual" | "waypoint";
    onModeChange: (mode: "manual" | "waypoint") => void;
}

export const ModeSelector = ({ mode, onModeChange }: ModeSelectorProps) => {
    return (
        <View className={style.container}>
            <Text style={styles.title}>Operation Mode</Text>

            <View style={styles.radioGroup}>
                <Pressable
                    style={styles.radioOption}
                    onPress={() => onModeChange("manual")}
                >
                    <View style={styles.radioOuterCircle}>
                        {mode === "manual" && <View style={styles.radioInnerCircle} />}
                    </View>
                    <Text style={styles.radioLabel}>Manual Control</Text>
                </Pressable>

                <Pressable
                    style={styles.radioOption}
                    onPress={() => onModeChange("waypoint")}
                >
                    <View style={styles.radioOuterCircle}>
                        {mode === "waypoint" && <View style={styles.radioInnerCircle} />}
                    </View>
                    <Text style={styles.radioLabel}>Waypoint Navigation</Text>
                </Pressable>
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
    title: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 16,
    },
    radioGroup: {
        flexDirection: 'row',
        gap: 16,
    },
    radioOption: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    radioOuterCircle: {
        height: 20,
        width: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#8b5cf6',
        alignItems: 'center',
        justifyContent: 'center',
    },
    radioInnerCircle: {
        height: 10,
        width: 10,
        borderRadius: 5,
        backgroundColor: '#8b5cf6',
    },
    radioLabel: {
        fontSize: 14,
        color: '#1f2937',
    },
});

const style = {
    container: `bg-white bg-opacity-90 rounded-lg shadow-lg p-4`,
}