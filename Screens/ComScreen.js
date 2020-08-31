import React, {useState} from 'react';
import {
  TextInput,
  Image,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Alert,
  ToastAndroid,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Ustore from '../Store/Ustore';

export default function ComScreen({navigation}) {
  const [Com, setCom] = useState('');
  const doLogin = async () => {
    if (Com === '') {
      ToastAndroid.show('빈칸을 채워주세요', ToastAndroid.SHORT);
    } else if (
      Com !== 'dsa' &&
      Com !== 'unioneinc' &&
      Com !== 'sunsite' &&
      Com !== 'sample'
    ) {
      Alert.alert(
        '존재하지 않는 회사명입니다.',
        '지급받으신 홈페이지 주소의 처음 부분을 입력해주세요.\n\n예시) 도메인: example.usails.biz\n\n\t\t\t\t\t\t\t\t\t\t입력: example',
        [{text: '확인', style: 'calcel'}],
      );
    } else {
      await AsyncStorage.setItem('@Com', Com);
      Ustore.com = Com;
      Ustore.url = 'https://' + Com + '.usails.biz/';
      navigation.navigate('Login');
    }
  };
  return (
    <View style={{height: '100%', width: '100%'}}>
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
              placeholder={'Company'}
              placeholderTextColor="#8C8C8C"
              onChangeText={(text) => setCom(text)}
            />
          </View>
          <View style={styles.buttonArea}>
            <TouchableOpacity style={styles.button} onPress={() => doLogin()}>
              <Text style={styles.buttonTitle}>다음</Text>
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
    alignItems: 'center',
  },
  title: {
    height: '100%',
    width: '100%',
    resizeMode: 'contain',
  },
  formArea: {
    marginTop: hp(10),
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
    paddingTop: hp(30),
  },
});
