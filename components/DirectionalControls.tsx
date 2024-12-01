import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from "lucide-react-native";

interface DirectionalControlsProps {
  onDirectionPress: (direction: 'up' | 'down' | 'left' | 'right') => void;
}

export const DirectionalControls: React.FC<DirectionalControlsProps> = ({ onDirectionPress }) => {
  return (
      <View className={style.container}>
        <Text style={styles.heading}>Direction Controls</Text>
        <View style={styles.grid}>
          {/* Empty cell for spacing */}
          <View style={styles.emptyCell} />
          {/* Up button */}
          <TouchableOpacity
              onPress={() => onDirectionPress('up')}
              style={[styles.button, styles.upDown]}
              accessibilityLabel="Move Forward"
          >
            <ArrowUp width={24} height={24} color={"#e0e0e0"} />
          </TouchableOpacity>
          {/* Empty cell for spacing */}
          <View style={styles.emptyCell} />
          {/* Left button */}
          <TouchableOpacity
              onPress={() => onDirectionPress('left')}
              style={[styles.button, styles.leftRight]}
              accessibilityLabel="Turn Left"
          >
            <ArrowLeft width={24} height={24} color={"#e0e0e0"} />
          </TouchableOpacity>
          {/* Empty cell for spacing */}
          <View style={styles.emptyCell} />
          {/* Right button */}
          <TouchableOpacity
              onPress={() => onDirectionPress('right')}
              style={[styles.button, styles.leftRight]}
              accessibilityLabel="Turn Right"
          >
            <ArrowRight width={24} height={24} color={"#e0e0e0"} />
          </TouchableOpacity>
          {/* Empty cell for spacing */}
          <View style={styles.emptyCell} />
          {/* Down button */}
          <TouchableOpacity
              onPress={() => onDirectionPress('down')}
              style={[styles.button, styles.upDown]}
              accessibilityLabel="Move Backward"
          >
            <ArrowDown width={24} height={24} color={"#e0e0e0"}/>
          </TouchableOpacity>
          {/* Empty cell for spacing */}
          <View style={styles.emptyCell} />
        </View>
      </View>
  );
};

const styles = StyleSheet.create({
  heading: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    maxWidth: 200,
    alignSelf: 'center',
  },
  emptyCell: {
    width: 50,
    height: 50,
  },
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
  leftRight: {
    backgroundColor: '#8b5cf6',
  },
});


const style={
  container: `bg-white bg-opacity-90 rounded-lg shadow-lg p-4`,
};