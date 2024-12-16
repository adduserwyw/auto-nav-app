import React, { useRef, useState } from 'react';
import { Pressable, TouchableOpacity, StyleSheet } from 'react-native';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react-native';
import { Device } from 'react-native-ble-plx';
import DirectionalPressable from '~/components/ui/DirectionalPressable';

interface DirectionalButtonProps {
  direction: 'up' | 'down' | 'left' | 'right';
  onLongPress: (direction: 'up' | 'down' | 'left' | 'right') => void;
  onShortPress: (direction: 'up' | 'down' | 'left' | 'right') => void;
  onDirectionPress: (direction: 'up' | 'down' | 'left' | 'right') => void;
  style?: object;
  iconSize?: number;
  iconColor?: string;
  longPressThreshold?: number;
}

export const DirectionalButton: React.FC<DirectionalButtonProps> = ({
  direction,
  onLongPress,
  onShortPress,
  onDirectionPress,
  style,
  iconSize = 24,
  iconColor = '#e0e0e0',
  longPressThreshold = 600,
}) => {
  const pressStartTime = useRef(0);
  const [isPressing, setIsPressing] = useState(false);

  const handleLongPress = () => {
    onLongPress(direction);
  };

  const handleShortPress = () => {
    onShortPress(direction);
  };

  const handlePressIn = () => {
    onDirectionPress(direction);
    handleShortPress();
    pressStartTime.current = Date.now();
    setIsPressing(true);
  };

  const handlePressOut = () => {
    const pressDuration = Date.now() - pressStartTime.current;
    setIsPressing(false);
    if (pressDuration >= longPressThreshold) {
      handleLongPress();
      // } else {
      //     handleShortPress();
    }
  };

  const getIcon = () => {
    switch (direction) {
      case 'up':
        return <ArrowUp width={iconSize} height={iconSize} color={iconColor} />;
      case 'down':
        return <ArrowDown width={iconSize} height={iconSize} color={iconColor} />;
      case 'right':
        return <ArrowRight width={iconSize} height={iconSize} color={iconColor} />;
      case 'left':
        return <ArrowLeft width={iconSize} height={iconSize} color={iconColor} />;
      default:
        return <ArrowUp width={iconSize} height={iconSize} color={iconColor} />;
    }
  };

  return (
    <DirectionalPressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onDirectionPress={direction}
      style={[styles.button, styles.upDown, style]}
      accessibilityLabel={`Move ${direction}`}>
      {getIcon()}
    </DirectionalPressable>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    margin: 4,
  },
  upDown: {
    backgroundColor: '#8b5cf6',
  },
});
