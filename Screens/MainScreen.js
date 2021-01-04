import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  ToastAndroid,
  Dimensions,
  BackHandler,
  Platform,
} from 'react-native';
import BottomNavi from '../Components/BottomNavi';
import axios from 'axios';
import Ustore from '../Store/Ustore';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import Icon from 'react-native-vector-icons/dist/MaterialIcons';
import {useFocusEffect} from '@react-navigation/native';
import {CommonActions} from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';
import {Badge} from 'react-native-elements';
import messaging from '@react-native-firebase/messaging';
import moment from 'moment';

export default function MainScreen({navigation}) {
  const [myAppr, setMyAppr] = useState(0);
  const [mysche, setMyShce] = useState(0);
  const [bpTime, setBpTime] = useState(0);
  const [tab, setTab] = useState(true);
  const [listData, setListData] = useState([{}]);
  const [currentSchedule, setCurrentSchedule] = useState(0);
  const [alarmCount, setAlarmCount] = useState(0);
  const [badgeVisible, setBadgeVisible] = useState(false);
  const [alarmVisible, setAlarmVisible] = useState(false);
  const [setVisible, setSetVisible] = useState(false);
  const [alarmList, setAlarmList] = useState();
  const [asd, setasd] = useState(true);
  const width = Dimensions.get('window').width;
  const date = moment().format('YYYY-MM-DD');
  const onAlarmClicked = () => {
    if (alarmVisible === false) {
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
          if (aData.count === 0) {
            setAlarmList([{key: 0, text: '알람이 없습니다.'}]);
            setBadgeVisible(false);
          } else {
            setBadgeVisible(true);
            var tmplist = [];
            for (let i = 0; i < Number.parseInt(aData.count); i++) {
              tmplist.push({
                text: aData.results[i].text,
                url: aData.results[i].url,
              });
            }
            setAlarmList(tmplist);
          }
        })
        .catch(function (e) {
          console.log(e);
        });
    }
    setAlarmVisible(!alarmVisible);
    setSetVisible(false);
  };
  const onLogoutClicked = async () => {
    if (Ustore.mPermission) {
      axios
        .delete(Ustore.url + 'api/auth/token/' + Ustore.id, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: Ustore.loginToken,
          },
        })
        .then(async function () {
          await AsyncStorage.removeItem('@Id');
          await AsyncStorage.removeItem('@Pw');
          await AsyncStorage.removeItem('@fcmId');
          Ustore.first = true;
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{name: 'Login'}],
            }),
          );
        })
        .catch(function (e) {
          console.log('logout error', e);
        });
    } else {
      await AsyncStorage.removeItem('@Id');
      await AsyncStorage.removeItem('@Pw');
      Ustore.first = true;
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{name: 'Login'}],
        }),
      );
    }
  };
  const onNoticeClick = () => {
    setTab(true);
    axios //게시판
      .get(Ustore.url + 'api/v0.1/noticeboard', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: Ustore.loginToken,
        },
        params: {
          category: 1,
        },
      })
      .then(function (res) {
        const aData = res.data;
        if (aData.count === 0) {
          setListData([{key: 0, text: '공지가 없습니다.'}]);
        } else {
          var tcnt = 0;
          aData.count > 4 ? (tcnt = 4) : (tcnt = aData.count);
          var tmplist = [];
          for (let i = 0; i < tcnt; i++) {
            tmplist.push({
              key: aData.results[i].id,
              title: aData.results[i].title,
            });
          }
          setListData(tmplist);
        }
      });
  };
  const onBoardClick = () => {
    setTab(false);
    axios
      .get(Ustore.url + 'api/v0.1/noticeboard', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: Ustore.loginToken,
        },
        params: {
          category: null,
        },
      })
      .then(function (res) {
        const aData = res.data;
        if (aData.count == 0) {
          setListData([{key: 0, text: '공지가 없습니다.'}]);
        } else {
          var tcnt = 0;
          aData.count > 4 ? (tcnt = 4) : (tcnt = aData.count);
          var tmplist = [];
          for (let i = 0; i < tcnt; i++) {
            tmplist.push({
              key: aData.results[i].id,
              title: aData.results[i].title,
            });
          }
          setListData(tmplist);
        }
      });
  };
  const myBackPress = () => {
    var currentTime = Date.now();
    if (currentTime - bpTime <= 2000) {
      BackHandler.exitApp();
      return true;
    } else {
      setBpTime(currentTime);
      ToastAndroid.show('한번 더 누르시면 앱이 종료됩니다', ToastAndroid.SHORT);
      return true;
    }
  };
  useEffect(() => {
    if (asd) {
      setasd(false);
      Ustore.first = false;
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
          if (aData.count === 0) {
            setBadgeVisible(false);
          } else {
            setBadgeVisible(true);
          }
        })
        .catch(function (e) {
          console.log(e);
        });
      axios //나의일정 count
        .get(Ustore.url + 'api/v0.1/servicereport', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: Ustore.loginToken,
          },
        })
        .then(function (res) {
          const count = res.data.count;
          if (count !== 0) {
            var tmp = 0;
            for (; tmp < count; ++tmp) {
              if (res.data.results[tmp].serviceStatus !== 'Y') {
                break;
              }
            }
            setCurrentSchedule(res.data.results[tmp].serviceId);
          } else {
            setCurrentSchedule(0);
          }
          setMyShce(count);
        })
        .catch(function (e) {
          console.log(e);
        });
      axios //나의 결제 count
        .get(Ustore.url + 'api/v0.1/document', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: Ustore.loginToken,
          },
          params: {
            approval: 'do',
          },
        })
        .then(function (res) {
          const count = res.data.count;
          setMyAppr(count);
        })
        .catch(function (e) {
          console.log(e);
        });
      axios //게시판
        .get(Ustore.url + 'api/v0.1/noticeboard', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: Ustore.loginToken,
          },
          params: {
            category: 1,
          },
        })
        .then(function (res) {
          const aData = res.data;
          if (aData.count == 0) {
            setListData([{key: 0, title: '공지가 없습니다.'}]);
          } else {
            var tcnt = 0;
            aData.count > 4 ? (tcnt = 4) : (tcnt = aData.count);
            var tmplist = [];
            for (let i = 0; i < tcnt; i++) {
              tmplist.push({
                key: aData.results[i].id,
                title: aData.results[i].title,
              });
            }
            setListData(tmplist);
          }
        })
        .catch(function (e) {
          console.log(e);
        });
    }
    //app on foreground
    const unsubscribe = messaging().onMessage(async (remoteMessage) => {});
    //app on background
    messaging().onNotificationOpenedApp((remoteMessage) => {
      if (remoteMessage) {
        navigation.navigate('Sub', {
          navigation: {navigation},
          link: remoteMessage.data.url,
        });
      }
    });

    //app on quite
    messaging()
      .getInitialNotification()
      .then((remoteMessage) => {
        if (remoteMessage) {
          navigation.navigate('Sub', {
            navigation: {navigation},
            link: remoteMessage.data.url,
          });
        }
      });
    return unsubscribe;
  }, []);
  useFocusEffect(() => {
    if (Ustore.first) {
      Ustore.first = false;
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
      axios //나의일정 count
        .get(Ustore.url + 'api/v0.1/servicereport', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: Ustore.loginToken,
          },
        })
        .then(function (res) {
          const count = res.data.count;
          if (count !== 0) {
            var tmp = 0;
            for (; tmp < count; ++tmp) {
              if (res.data.results[tmp].serviceStatus !== 'Y') break;
            }
            setCurrentSchedule(res.data.results[tmp].serviceId);
          } else setCurrentSchedule(0);
          setMyShce(count);
        })
        .catch(function (e) {
          console.log(e);
        });
      axios //나의 결제 count
        .get(Ustore.url + 'api/v0.1/document', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: Ustore.loginToken,
          },
          params: {
            approval: 'do',
          },
        })
        .then(function (res) {
          const count = res.data.count;
          setMyAppr(count);
        })
        .catch(function (e) {
          console.log(e);
        });
      axios //게시판
        .get(Ustore.url + 'api/v0.1/noticeboard', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: Ustore.loginToken,
          },
          params: {
            category: 1,
          },
        })
        .then(function (res) {
          const aData = res.data;
          if (aData.count == 0) {
            setListData([{key: 0, title: '공지가 없습니다.'}]);
          } else {
            var tcnt = 0;
            aData.count > 4 ? (tcnt = 4) : (tcnt = aData.count);
            var tmplist = [];
            for (let i = 0; i < tcnt; i++) {
              tmplist.push({
                key: aData.results[i].id,
                title: aData.results[i].title,
              });
            }
            setListData(tmplist);
          }
        })
        .catch(function (e) {
          console.log(e);
        });
    }
    BackHandler.addEventListener('myBackPress', myBackPress);
    return () => {
      BackHandler.removeEventListener('myBackPress', myBackPress);
    };
    // app 로딩됐을때 필요한 것 -> 전사공지 띄우기,갯수받아오기
  }, [listData, myBackPress]);

  return (
    <View style={styles.topCon}>
      <View style={styles.container}>
        <View style={styles.backBox} />
        <View style={styles.shortcut}>
          <View style={styles.twoBtn}>
            <View style={styles.shortcutV}>
              <Image
                style={styles.largeIcon}
                source={require('../Sources/file.png')}
              />
              <TouchableOpacity
                style={styles.shortcutBtn1Top}
                onPress={() => {
                  Ustore.first = true;
                  navigation.navigate('Sub', {
                    navigation: {navigation},
                    link: Ustore.url + 'approval/showdocument/all/',
                  });
                }}>
                <Text style={styles.approval}>전자결재</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.shortcutBtn1}
                onPress={() => {
                  Ustore.first = true;
                  navigation.navigate('Sub', {
                    navigation: {navigation},
                    link:
                      Ustore.url + 'approval/showdocument/ing/?option=결재대기',
                  });
                }}>
                <Text style={{color: 'black'}}>결재현황</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.numBtn}
                onPress={() => {
                  Ustore.first = true;
                  navigation.navigate('Sub', {
                    navigation: {navigation},
                    link:
                      Ustore.url + 'approval/showdocument/ing/?option=결재대기',
                  });
                }}>
                <Text
                  style={[
                    styles.numText,
                    myAppr == 0 ? {color: 'black'} : {color: '#1991D1'},
                  ]}>
                  {myAppr}
                </Text>
              </TouchableOpacity>
            </View>
            <View
              style={{
                width: 2,
                height: '80%',
                backgroundColor: '#1991D1',
              }}
            />
            <View style={styles.shortcutV}>
              <Image
                style={styles.largeIcon}
                source={require('../Sources/pen.png')}
              />
              <TouchableOpacity
                style={styles.shortcutBtn1Top}
                onPress={() => {
                  Ustore.first = true;
                  navigation.navigate('Sub', {
                    navigation: {navigation},
                    link: Ustore.url + 'service/showservices/',
                  });
                }}>
                <Text style={styles.approval}>일정관리</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.shortcutBtn1}
                onPress={() => {
                  Ustore.first = true;
                  navigation.navigate('Sub', {
                    navigation: {navigation},
                    link: Ustore.url + 'scheduler/scheduler/' + date,
                  });
                }}>
                <Text style={{color: 'black'}}>나의일정</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  Ustore.first = true;
                  navigation.navigate('Sub', {
                    navigation: {navigation},
                    link:
                      Ustore.url +
                      (currentSchedule === 0
                        ? 'scheduler/scheduler/' + date
                        : 'service/viewservice/' + currentSchedule),
                  });
                }}>
                <Text
                  style={[
                    {fontSize: 30, fontWeight: 'bold'},
                    mysche == 0 ? {color: 'black'} : {color: '#1991D1'},
                  ]}>
                  {mysche}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <TouchableOpacity
            style={styles.shortcutBtnBottom}
            onPress={() => {
              Ustore.first = true;
              navigation.navigate('Sub', {
                navigation: {navigation},
                link:
                  Ustore.url +
                  (Ustore.com === 'dsa'
                    ? 'daesungwork/showstockinout/'
                    : 'dashboard/service/'),
              });
            }}>
            <Text style={styles.shotcutBBtnText}>
              {Ustore.com === 'dsa' ? '입출고현황' : '대시보드'}
            </Text>
            <Icon name="keyboard-arrow-right" size={24} color="#4C4C4C" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.shortcutBtnBottom}
            onPress={() => {
              Ustore.first = true;
              navigation.navigate('Sub', {
                navigation: {navigation},
                link:
                  Ustore.url +
                  (Ustore.com === 'dsa'
                    ? 'service/showreports/'
                    : 'sales/showcontracts/'),
              });
            }}>
            <Text style={styles.shotcutBBtnText}>
              {Ustore.com === 'dsa' ? '오늘의 업무' : '영업관리'}
            </Text>
            <Icon name="keyboard-arrow-right" size={24} color="#4C4C4C" />
          </TouchableOpacity>
        </View>
        <View style={styles.board}>
          <View style={styles.tabCon}>
            <TouchableOpacity // tab Btn 이라 리스트뷰에 보여주도록 해야함
              style={tab ? styles.tabBtn : styles.tabBtnPress}
              onPress={() => {
                onNoticeClick();
              }}>
              <Text
                style={[
                  tab ? {color: '#4C4C4C'} : {color: 'white'},
                  {fontWeight: 'bold', fontSize: 18},
                ]}>
                전사공지
              </Text>
            </TouchableOpacity>
            <TouchableOpacity // tab Btn 이라 리스트뷰에 보여주도록 해야함
              style={tab ? styles.tabBtnPress : styles.tabBtn}
              onPress={() => {
                onBoardClick();
              }}>
              <Text
                style={[
                  tab ? {color: 'white'} : {color: '#4C4C4C'},
                  {fontWeight: 'bold', fontSize: 18},
                ]}>
                최신게시판
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.listContainer}>
            <FlatList
              style={styles.list}
              data={listData}
              keyExtractor={(item) => listData.indexOf(item).toString()}
              renderItem={({item}) => {
                return (
                  <TouchableOpacity
                    style={styles.listItem}
                    onPress={() => {
                      Ustore.first = true;
                      navigation.navigate('Sub', {
                        navigation: {navigation},
                        link:
                          Ustore.url + 'noticeboard/view-notice/' + item.key,
                      });
                    }}>
                    <Image
                      source={require('../Sources/speaker.png')}
                      style={{
                        width: '10%',
                        height: '110%',
                        resizeMode: 'contain',
                      }}
                    />
                    <Text numberOfLines={1} style={styles.listItemText}>
                      {item.title}
                    </Text>
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        </View>
      </View>
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
              setAlarmVisible(false);
              setSetVisible(!setVisible);
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
      {alarmVisible && (
        <View style={styles.alarmBox}>
          <Text style={styles.alarmTitle}>알람 목록</Text>
          <FlatList
            style={styles.alarmList}
            data={alarmList}
            keyExtractor={(item) => alarmList.indexOf(item).toString()}
            renderItem={({item}) => {
              return (
                <TouchableOpacity
                  style={styles.alarmItem}
                  onPress={() => {
                    setAlarmVisible(false);
                    Ustore.first = true;
                    navigation.navigate('Sub', {
                      navigation: {navigation},
                      link: Ustore.url + item.url,
                    });
                  }}>
                  <Text numberOfLines={1} style={styles.alarmItemText}>
                    {item.text}
                  </Text>
                </TouchableOpacity>
              );
            }}
          />
        </View>
      )}
      {setVisible && (
        <View style={styles.profileBox}>
          <TouchableOpacity
            style={styles.profileButton}
            onPress={() => {
              setSetVisible(!setSetVisible);
              setAlarmVisible(false);
              Ustore.first = true;
              navigation.navigate('Sub', {
                navigation: {navigation},
                link: Ustore.url + 'hr/',
              });
            }}>
            <Text style={styles.profileText}>Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.profileButton}
            onPress={() => onLogoutClicked()}>
            <Text style={styles.profileText}>Logout</Text>
          </TouchableOpacity>
        </View>
      )}
      <BottomNavi navigation={navigation} />
    </View>
  );
}
const styles = StyleSheet.create({
  backBox: {
    width: '150%',
    height: '50%',
    position: 'absolute',
    backgroundColor: '#1991D1',
    padding: 0,
    margin: 0,
    top: -hp(27),
    transform: [{rotate: '-13deg'}],
  },
  topCon: {
    overflow: 'visible',
    backgroundColor: 'transparent',
    justifyContent: 'flex-end',
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? getStatusBarHeight() : 10,
  },
  container: {
    zIndex: 0,
    marginTop: hp(7),
    marginBottom: hp(8),
    height: '85%',
    paddingHorizontal: 20,
    justifyContent: 'center',
    backgroundColor: '#EAEAEA',
    alignItems: 'center',
  },
  shortcut: {
    width: '100%',
    height: '55%',
    marginBottom: '8%',
  },
  twoBtn: {
    backgroundColor: 'white',
    borderRadius: 15,
    width: '100%',
    height: '60%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: hp(1),
  },
  shortcutV: {
    height: '100%',
    width: '49%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  largeIcon: {
    width: '22%',
    height: '20%',
    resizeMode: 'cover',
  },
  shortcutBtn1Top: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 5,
    width: '100%',
  },
  shortcutBtn1: {
    padding: 5,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  shortcutBtnBottom: {
    width: '100%',
    height: '20%',
    borderRadius: 15,
    marginBottom: hp(1),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    paddingRight: 10,
  },
  shotcutBBtnText: {
    color: '#4C4C4C',
    paddingLeft: '10%',
    fontSize: 20,
    fontWeight: 'bold',
  },
  board: {
    width: '100%',
    height: '37%',
  },
  tabCon: {
    flexDirection: 'row',
    height: '25%',
    width: '100%',
  },
  listContainer: {
    backgroundColor: 'white',
    height: '75%',
    width: '100%',
  },
  approval: {
    fontWeight: 'bold',
    color: '#1991D1',
    fontSize: 24,
  },
  tabBtn: {
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    width: '50%',
  },
  tabBtnPress: {
    backgroundColor: '#1991D1',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    width: '50%',
  },
  list: {
    paddingTop: '5%',
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginHorizontal: '5%',
    padding: 3,
    borderBottomWidth: 1,
    borderColor: '#C8C8C8',
  },
  listItemText: {
    width: '90%',
    height: '100%',
    paddingLeft: 10,
    textAlign: 'left',
    fontSize: 17,
  },
  numBtn: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  numText: {
    textAlign: 'center',
    fontSize: 30,
    fontWeight: 'bold',
    width: '100%',
  },
  alarmBox: {
    alignItems: 'center',
    backgroundColor: 'white',
    position: 'absolute',
    justifyContent: 'center',
    top: '13%',
    right: '10%',
    width: '80%',
    borderWidth: 2,
    borderRadius: 5,
  },
  alarmTitle: {
    color: 'white',
    textAlign: 'center',
    backgroundColor: '#4E73DF',
    width: '100%',
    height: 30,
    fontSize: 20,
  },
  alarmItem: {
    borderBottomWidth: 0.5,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  alarmItemText: {
    width: '95%',
    textAlign: 'center',
  },
  alarmList: {
    width: '100%',
  },
  profileBox: {
    alignItems: 'center',
    backgroundColor: 'white',
    position: 'absolute',
    justifyContent: 'center',
    top: '13%',
    right: '10%',
    width: '30%',
    height: '10%',
    borderWidth: 2,
    borderRadius: 5,
  },
  profileButton: {
    height: '50%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileText: {
    textAlign: 'center',
  },
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
    top: Platform.OS === 'ios' ? getStatusBarHeight() : 10,
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
