import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

interface ModeSelectorProps {
    mode: "manual" | "waypoint";
    onModeChange: (mode: "manual" | "waypoint") => void;
}

// Custom Radio Button Component
const RadioButton = ({
                         selected,
                         onPress,
                         label
                     }: {
    selected: boolean,
    onPress: () => void,
    label: string
}) => {
    return (
        <View className="flex-row items-center space-x-2">
            <TouchableOpacity
                onPress={onPress}
                className={`
          w-5 h-5 rounded-full border-2 
          ${selected ? 'border-blue-500 bg-blue-500' : 'border-gray-300'}
        `}
            >
                {selected && (
                    <View className="w-2 h-2 bg-white rounded-full self-center mt-1" />
                )}
            </TouchableOpacity>
            <Text className={`${selected ? 'text-blue-500' : 'text-gray-700'}`}>
                {label}
            </Text>
        </View>
    );
};

export const ModeSelector = ({ mode, onModeChange }: ModeSelectorProps) => {
    return (
        <View className="bg-white bg-opacity-90 rounded-lg shadow-lg p-4">
            <Text className="text-lg font-semibold text-gray-800">Operation Mode</Text>
            <View className="flex-row gap-4">
                <RadioButton
                    selected={mode === "manual"}
                    onPress={() => onModeChange("manual")}
                    label="Manual Control"
                />
                <RadioButton
                    selected={mode === "waypoint"}
                    onPress={() => onModeChange("waypoint")}
                    label="Waypoint Navigation"
                />
            </View>
        </View>
    );
};