import React, {useState, useEffect} from 'react';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  Text,
  Dimensions,
} from 'react-native';
import {Badge} from 'react-native-elements';
import axios from 'axios';
import Ustore from '../Store/Ustore';

export default function MyHeader({navigation}) {
  const [alarmCount, setAlarmCount] = useState(0);
  const [badgeVisible, setBadgeVisible] = useState(false);
  const [first, setFirst] = useState(false);
  const width = Dimensions.get('window').width;
  const onAlarmClicked = () => {
    if (Ustore.alarmVisible == false) {
      axios
        .get(Ustore.url + 'api/v0.1/alerts', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: Ustore.loginToken,
          },
        })
        .then(function (res) {
          const aData = res.data;
          setAlarmCount(aData.count);
          if (aData.count == 0) {
            Ustore.alarmList = [{key: 0, text: '알람이 없습니다.'}];
          } else {
            setBadgeVisible(true);
            var tmplist = [];
            for (let i = 0; i < Number.parseInt(aData.count); i++) {
              tmplist.push(aData.results[i].text);
            }
            Ustore.alarmList = tmplist.slice();
            //setAlarmList(tmplist);
          }
        })
        .catch(function (e) {
          console.log(e);
        });
    }
    Ustore.setAlarmVisible(!Ustore.alarmVisible);
    Ustore.setSetVisible(false);
    console.log(Ustore.alarmVisible);
    console.log(Ustore.alarmList);
  };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!first) {
      setFirst(true);
      axios
        .get(Ustore.url + 'api/v0.1/alerts', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: Ustore.loginToken,
          },
        })
        .then(function (res) {
          const aData = res.data;
          setAlarmCount(aData.count);
          if (aData.count == 0) {
            setBadgeVisible(false);
          } else {
            setBadgeVisible(true);
          }
        })
        .catch(function (e) {
          console.log(e);
        });
    }
  });
  return (
    <View style={styles.header}>
      <Image
        style={styles.logo}
        source={require('../Sources/usails_logo_white.png')}
      />
      <View style={styles.rightView}>
        <TouchableOpacity
          style={styles.alarmBtn}
          onPress={() => onAlarmClicked()}>
          <Image
            source={require('../Sources/bell.png')}
            style={styles.alarmImg}
          />
          {badgeVisible && (
            <Badge
              value={alarmCount}
              status="error"
              containerStyle={styles.badge}
              badgeStyle={{borderWidth: 0}}
            />
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            width: '45%',
            height: '100%',
            justifyContent: 'center',
            marginRight: '5%',
            borderRadius: width * 0.3 * 0.45 * 0.5,
          }}
          onPress={() => {
            Ustore.setAlarmVisible(false);
            Ustore.setSetVisible(!Ustore.setVisible);
          }}>
          <Image
            source={{uri: Ustore.profileUri}}
            style={{
              width: '100%',
              height: '100%',
              borderRadius: width * 0.3 * 0.45 * 0.5,
            }}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  rightView: {
    flexDirection: 'row',
    width: '30%',
    height: '100%',
    justifyContent: 'space-between',
  },
  badge: {
    position: 'absolute',
    top: 2,
    right: 0,
  },
  header: {
    overflow: 'visible',
    position: 'absolute',
    top: getStatusBarHeight(),
    backgroundColor: 'transparent',
    paddingBottom: 0,
    paddingHorizontal: 20,
    width: '100%',
    height: '7%',
    borderColor: 'black',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  logo: {
    height: '100%',
    width: '50%',
    resizeMode: 'contain',
  },

  alarmBtn: {
    width: '35%',
    height: '100%',
    justifyContent: 'center',
  },
  alarmImg: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
});
