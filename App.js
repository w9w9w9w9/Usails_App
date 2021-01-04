/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useState, useEffect} from 'react';
import {PermissionsAndroid, Platform} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import SplashScreen from './Screens/SplashScreen.js';
import MainScreen from './Screens/MainScreen.js';
import LoginScreen from './Screens/LoginScreen.js';
import SubScreen from './Screens/SubScreen.js';
import ComScreen from './Screens/ComScreen.js';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import Ustore from './Store/Ustore';
import axios from 'axios';
import messaging from '@react-native-firebase/messaging';
import Geolocation from 'react-native-geolocation-service';

function HomeScreen({navigation}) {
  const [page, setPage] = useState(0);
  async function requestPermission() {
    await messaging()
      .requestPermission()
      .then(async (m) => {
        if (m > 0) {
          Ustore.mPermission = true;
        }
        //messaging의 requestPermission 함수 실행시 두번 실행됨  -> 따라서 then으로 연결된 부분도 두번 나오는 것 같음.
        await Geolocation.requestAuthorization('always').then((g) => {
          if (g === 'denied') {
          }
        });
      });
  }

  useEffect(() => {
    if (Platform.OS === 'ios') {
      requestPermission();
    } else {
      PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Access Permission',
          message: 'We would like to use your location',
          buttonPositive: 'Okay',
        },
      );
    }

    setTimeout(() => {
      async function getLogin() {
        await AsyncStorage.getItem('@Com').then(async (v) => {
          if (v != null) {
            Ustore.com = v;
            Ustore.url = 'https://' + v + '.usails.biz/';
            await AsyncStorage.getItem('@Id').then(async (value) => {
              if (value != null) {
                Ustore.username = value;
                await AsyncStorage.getItem('@Pw').then((pvalue) => {
                  Ustore.password = pvalue;
                  const data = {
                    username: Ustore.username,
                    password: Ustore.password,
                  };
                  axios
                    .post(Ustore.url + 'api/auth/login', JSON.stringify(data), {
                      headers: {
                        'Content-Type': 'application/json',
                      },
                    })
                    .then(async (res) => {
                      Ustore.loginToken = 'Token ' + res.data.token;
                      Ustore.sessionId = res.data.sessionid;
                      Ustore.profileUri =
                        Ustore.url.slice(0, Ustore.url.length - 1) +
                        res.data.photo;
                      //알람설정을 허용했을 경우
                      if (Ustore.mPermission) {
                        await AsyncStorage.getItem('@fcmId').then((r) => {
                          Ustore.id = r;
                        });
                      }
                      setPage(3);
                    })
                    .catch((e) => {
                      console.log('login error', e);
                    });
                });
              } else {
                setPage(2);
              }
            });
          } else {
            setPage(1);
          }
        });
      }
      getLogin();
    }, 2000);
  });

  switch (page) {
    case 0:
      return <SplashScreen />;
    case 1:
      return <ComScreen navigation={navigation} />;
    case 2:
      return <LoginScreen navigation={navigation} />;
    case 3:
      return <MainScreen navigation={navigation} />;
  }
}

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Main" component={MainScreen} />
        <Stack.Screen name="Sub" component={SubScreen} />
        <Stack.Screen name="Com" component={ComScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
