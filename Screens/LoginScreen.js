import React, {useState} from 'react';
import {
  TextInput,
  Image,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ToastAndroid,
  ImageBackground,
  Alert,
} from 'react-native';
import {CheckBox} from 'react-native-elements';
import AsyncStorage from '@react-native-community/async-storage';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import axios from 'axios';
import Ustore from '../Store/Ustore';
import messaging from '@react-native-firebase/messaging';

export default function LoginScreen({navigation}) {
  const [Id, setId] = useState('');
  const [Pw, setPw] = useState('');
  const [checked, setChecked] = useState(false);
  const doLogin = () => {
    if (Id === '' || Pw === '') {
      ToastAndroid.show('빈칸을 모두 채워주세요', ToastAndroid.SHORT);
    }
    const data = {
      username: Id,
      password: Pw,
    };
    axios
      .post(Ustore.url + 'api/auth/login', JSON.stringify(data), {
        headers: {'Content-Type': 'application/json'},
      })
      .then(async (res) => {
        Ustore.username = data.username;
        Ustore.password = Pw;
        Ustore.loginToken = 'Token ' + res.data.token;
        Ustore.sessionId = res.data.sessionid;
        Ustore.profileUri =
          Ustore.url.slice(0, Ustore.url.length - 1) + res.data.photo;
        if (checked) {
          await AsyncStorage.setItem('@Id', Id);
          await AsyncStorage.setItem('@Pw', Pw);
        }
        messaging()
          .getToken()
          .then((t) => {
            const td = {token: t};
            axios
              .post(Ustore.url + 'api/auth/token', JSON.stringify(td), {
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: Ustore.loginToken,
                },
              })
              .then(async (r) => {
                Ustore.id = r.data.id;
                if (checked) {
                  await AsyncStorage.setItem('@fcmId', r.data.id.toString());
                }
                navigation.navigate('Main');
              })
              .catch((e) => {
                ToastAndroid.show(
                  '서버에 오류가 발생하였습니다. 다시 시도하여주십시오.',
                  ToastAndroid.SHORT,
                );
              });
          });
      })
      .catch((e) => {
        ToastAndroid.show('ID 혹은 Password가 틀렸습니다.', ToastAndroid.SHORT);
      });
  };
  return (
    <View style={{flex: 1}}>
      <ImageBackground
        source={require('../Sources/login_back.jpg')}
        style={styles.imgback}>
        <View style={styles.container}>
          <View style={styles.titleArea}>
            <Image
              style={styles.title}
              source={require('../Sources/usails_logo.png')}
            />
          </View>
          <View style={styles.formArea}>
            <TextInput
              style={styles.textForm}
              placeholder={'ID'}
              placeholderTextColor="#8C8C8C"
              onChangeText={(text) => setId(text)}
            />
            <TextInput
              style={styles.textForm2}
              secureTextEntry={true}
              keyboardType={'default'}
              placeholderTextColor="#8C8C8C"
              placeholder={'Password'}
              onChangeText={(text) => setPw(text)}
            />
          </View>
          <View style={styles.checkArea}>
            <CheckBox
              title="자동로그인"
              containerStyle={styles.checkbox}
              textStyle={{fontSize: 15}}
              size={30}
              checked={checked}
              onPress={() => setChecked(!checked)}
            />
          </View>
          <View style={styles.buttonArea}>
            <TouchableOpacity style={styles.button} onPress={() => doLogin()}>
              <Text style={styles.buttonTitle}>Login</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.copyright}>
            <Text>Copyrightⓒ 2017-2020 유니원아이앤씨㈜</Text>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    paddingLeft: wp(13),
    paddingRight: wp(13),
    justifyContent: 'flex-start',
  },
  imgback: {
    flex: 1,
    resizeMode: 'cover',
  },
  titleArea: {
    height: '35%',
    width: '100%',
    paddingTop: hp(10),
    paddingBottom: hp(10),
    marginBottom: hp(7),
    alignItems: 'center',
  },
  title: {
    height: '100%',
    width: '100%',
    resizeMode: 'contain',
  },
  formArea: {
    width: '100%',
  },
  textForm: {
    backgroundColor: 'white',
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: '#888',
    width: '100%',
    height: hp('8%'),
    paddingLeft: 5,
    paddingRight: 5,
    marginBottom: hp('2%'),
  },
  textForm2: {
    backgroundColor: 'white',
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: '#888',
    width: '100%',
    height: hp('8%'),
    paddingLeft: 5,
    paddingRight: 5,
  },
  checkArea: {
    padding: 0,
    margin: 0,
    width: '100%',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  checkbox: {
    backgroundColor: 'transparent',
    borderWidth: 0,
    margin: 5,
    padding: 0,
  },
  buttonArea: {
    width: '100%',
    height: hp('8%'),
  },
  button: {
    borderRadius: 10,
    backgroundColor: '#1991D1',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonTitle: {
    color: 'white',
  },
  copyright: {
    alignItems: 'center',
    paddingTop: hp(20),
  },
});
