import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { Colors } from '../theme';
import RNStyles from './RNStyles';
const RNImageLoader = ({ visible, containerStyle, size, color }) => {
  return visible ? (
    <View style={[RNStyles.imageLoading, containerStyle]}>
      <ActivityIndicator size={size ?? 'large'} color={color ?? Colors.Primary} />
    </View>
  ) : null;
};
export default RNImageLoader;
