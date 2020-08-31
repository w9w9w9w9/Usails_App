import React from 'react';
import {StyleSheet, View, Image} from 'react-native';

export default function SplashScreen() {
  return (
    <View style={styles.container}>
      <Image
        style={styles.splashImg}
        source={require('../Sources/Splash.png')}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
    justifyContent: 'flex-end',
  },
  splashImg: {
    height: '100%',
    width: '100%',
    resizeMode: 'cover',
  },
});
