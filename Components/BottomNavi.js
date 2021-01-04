import React from 'react';
import {StyleSheet, View, TouchableOpacity} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Feather from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ustore from '../Store/Ustore';
import moment from 'moment';

export default function BottomNavi({navigation}) {
  const date = moment().format('YYYY-MM-DD');
  return (
    <View style={styles.bottomNaviCon}>
      <TouchableOpacity
        style={styles.bottomNaviBtn}
        onPress={() => {
          Ustore.first = true;
          navigation.navigate('Main');
        }}>
        <Feather name="home" size={24} color="#4C4C4C" />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.bottomNaviBtn}
        onPress={() => {
          navigation.navigate('Sub', {
            navigation: {navigation},
            link: Ustore.url + 'approval/showdocument/all/',
          });
        }}>
        <FontAwesome name="folder-open-o" size={24} color="#4C4C4C" />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.bottomNaviBtn}
        onPress={() => {
          navigation.navigate('Sub', {
            navigation: {navigation},
            link: Ustore.url + 'scheduler/scheduler/' + date,
          });
        }}>
        <FontAwesome5 name="calendar-alt" size={24} color="#4C4C4C" />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.bottomNaviBtn}
        onPress={() => {
          navigation.navigate('Sub', {
            navigation: {navigation},
            link: Ustore.url + 'hr/showemployees/',
          });
        }}>
        <MaterialIcons name="people-outline" size={24} color="#4C4C4C" />
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  Text: {
    backgroundColor: '#F8F9FC',
  },
  bottomNaviBtn: {
    backgroundColor: '#F8F9FC',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    width: '25%',
  },
  bottomNaviCon: {
    position: 'absolute',
    bottom: 0,
    paddingVertical: 0,
    flexDirection: 'row',
    height: '8%',
    width: '100%',
  },
});
