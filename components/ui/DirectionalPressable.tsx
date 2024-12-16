import { Pressable, PressableProps } from 'react-native';
import React from 'react';

interface DirectionalPressableProps extends PressableProps {
  onDirectionPress: 'up' | 'down' | 'left' | 'right';
}

const DirectionalPressable: React.FC<DirectionalPressableProps> = ({
  children,
  onPressIn,
  onPressOut,
  onDirectionPress,
  style,
  accessibilityLabel,
  ...props
}) => {
  return (
    <Pressable
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      style={style}
      accessibilityLabel={accessibilityLabel}
      {...props}>
      {children}
    </Pressable>
  );
};

export default DirectionalPressable;
