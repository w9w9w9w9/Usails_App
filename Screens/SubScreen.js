import React from 'react';
import {StyleSheet, View, Platform} from 'react-native';
import BottomNavi from '../Components/BottomNavi';
import WebViewCom from '../Components/WebViewCom';
import {getStatusBarHeight} from 'react-native-status-bar-height';

export default function SubScreen({route, navigation}) {
  const {link} = route.params;
  return (
    <View style={styles.topCon}>
      <>
        <View style={styles.container}>
          <WebViewCom link={link} navigation={navigation} />
        </View>
      </>
      <BottomNavi navigation={navigation} />
    </View>
  );
}
const styles = StyleSheet.create({
  topCon: {
    paddingTop: Platform.OS === 'ios' ? getStatusBarHeight() : 0,
  },
  container: {
    height: '100%',
    backgroundColor: 'white',
  },
});
