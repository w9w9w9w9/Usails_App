import React, {useEffect, useState} from 'react';
import {BackHandler, Platform} from 'react-native';
import WebView from 'react-native-webview';
import Ustore from '../Store/Ustore';
import CookieManager from '@react-native-community/cookies';
import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';
import {CommonActions} from '@react-navigation/native';

export default function WebViewCom({link, navigation}) {
  const [ref, setRef] = useState(React.createRef);
  const [cgb, setCgb] = useState(false);
  const [back, setBack] = useState(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const webViewBp = () => {
    console.log('in Webviewbp');
    if (cgb && ref) {
      ref.goBack();
      return true;
    }
  };

  useEffect(() => {
    CookieManager.set(link, {
      name: 'sessionid',
      value: Ustore.sessionId,
      domain: Ustore.com + '.usails.biz',
      path: '/',
      httpOnly: true,
    }).then((done) => {
      CookieManager.get(Ustore.url).then((cookies) => {});
    });
    BackHandler.addEventListener('webViewBp', webViewBp);
    return () => {
      BackHandler.removeEventListener('webViewBp', webViewBp);
    };
    // app 로딩됐을때 필요한 것 -> 전사공지 띄우기
  }, [link, webViewBp]);

  return (
    <WebView
      allowsBackForwardNavigationGestures
      geolocationEnabled={true}
      style={{flex: 1}}
      source={{
        uri: link,
      }}
      ref={(w) => setRef(w)}
      onNavigationStateChange={(n) => {
        if (Platform.OS === 'ios') {
          if (n.navigationType === 'backforward') {
            if (back) {
              ref.goBack();
              setBack(false);
            } else {
              setBack(true);
            }
          } else {
            setBack(false);
          }
        }
        if (n.url.includes('logout')) {
          ref.stopLoading();
          axios
            .delete(Ustore.url + 'api/auth/token/' + Ustore.id, {
              headers: {
                'Content-Type': 'application/json',
                Authorization: Ustore.loginToken,
              },
            })
            .then(async function () {
              Ustore.first = true;
              await AsyncStorage.removeItem('@Id');
              await AsyncStorage.removeItem('@Pw');
              await AsyncStorage.removeItem('@fcmId');
              navigation.dispatch(
                CommonActions.reset({
                  index: 0,
                  routes: [{name: 'Login'}],
                }),
              );
            })
            .catch(function (e) {
              console.log(e);
            });
        }
        setCgb(n.canGoBack);
      }}
      sharedCookiesEnabled={true}
    />
  );
}
