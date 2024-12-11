import React from 'react';
import {Modal, StyleSheet, View} from 'react-native';
import {Colors, hp, wp} from '../theme';
import LottieView from 'lottie-react-native';
import {Text} from 'react-native-paper';
import {useTheme} from './RNThemeContext';
const RNLoader = ({visible, style, color, size}) => {
  const {colorScheme} = useTheme();

  return visible ? (
    <Modal transparent={true} visible={visible} animationType="fade">
      <View style={[styles(colorScheme).container, style]}>
        <View style={styles(colorScheme).LoderView}>
          <LottieView
            source={require('../assets/images/Loder.json')}
            style={{height: hp(15), width: wp(40)}}
            autoPlay
            loop
          />
          <Text style={styles(colorScheme).LoderText}>Lodiang...</Text>
        </View>
      </View>
    </Modal>
  ) : null;
};

const styles = colorScheme =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colorScheme === 'dark' ? Colors.BgBlack : Colors.White,
      justifyContent: 'center',
      alignItems: 'center',
    },
    LoderView: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    LoderText: {
      color: Colors.Orange,
      marginTop: hp(-4),
      paddingBottom: hp(2),
    },
  });
export default RNLoader;
