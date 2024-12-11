import React from 'react';
import LinearGradient from 'react-native-linear-gradient';

const RNGradient = ({ children, colors, style }) => {
  return (
    <LinearGradient
      colors={colors}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={style}>
      {children}
    </LinearGradient>
  );
};

export default RNGradient;
