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
            text2: `Speed set to ${value} km/h`,
            position: 'bottom'
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
                style={{height: 40}}
                value={currentSpeed}
                onValueChange={handleSpeedChange}
                minimumTrackTintColor="#8b5cf6"
                maximumTrackTintColor="#8b5cf6"
                thumbTintColor="#8b5cf6"
            />
        </View>
    );
};