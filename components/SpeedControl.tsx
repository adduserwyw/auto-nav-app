import React from 'react';
import { View, Text } from 'react-native';
import Slider from '@react-native-community/slider';
import Toast from 'react-native-toast-message';

interface SpeedControlProps {
    onSpeedChange: (speed: number) => void;
    currentSpeed: number;
}

export const SpeedControl = ({ onSpeedChange, currentSpeed }: SpeedControlProps) => {
    const handleSpeedChange = (value: number) => {
        onSpeedChange(value);
        Toast.show({
            type: 'info',
            text1: 'Speed Control',
            text2: `Speed set to ${value} km/h`
        });
        console.log("Speed changed:", value);
    };

    return (
        <View className="bg-white bg-opacity-90 rounded-lg shadow-lg p-4">
            <Text className="text-lg font-bold mb-2">Speed Control</Text>
            <Text className="text-center text-base mb-2">{currentSpeed} km/h</Text>
            <Slider
                minimumValue={0}
                maximumValue={120}
                step={1}
                value={currentSpeed}
                onValueChange={handleSpeedChange}
                minimumTrackTintColor="#007bff"
                maximumTrackTintColor="#d3d3d3"
                thumbTintColor="#007bff"
            />
        </View>
    );
};