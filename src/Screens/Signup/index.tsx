import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {useState, useRef} from 'react';
import {useNavigation} from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import firestore, {Filter} from '@react-native-firebase/firestore';
import PhoneInput from '../../Components/PhoneInput';
import parsePhoneNumber from 'libphonenumber-js';
import axios from 'axios';

import {BASE_URL} from '../../Utils/constants';
import {removeSpaces} from '../../Utils';

const Signup = () => {
  const [user, setUser] = useState({
    email: '',
    password: '',
    name: '',
    number: '',
  });

  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const phoneInputRef = useRef(null);

  const handleTextChange = (text, key) => {
    const data = {...user};
    data[key] = text;
    setUser(data);
  };

  const checkUser = async () => {
    try {
      const countryCode = phoneInputRef.current.getCountryCode();
      const num = parsePhoneNumber(user.number, countryCode);
      const internationalFormat = num.formatInternational();
      const nationalFormat = num.formatNational();
      const snapShot = await firestore()
        .collection('users')
        .where(
          Filter.or(
            Filter('number', '==', removeSpaces(internationalFormat)),
            Filter('number', '==', removeSpaces(nationalFormat)),
            Filter('number', '==', user.number),
          ),
        )
        .get();

      return snapShot;
    } catch (e) {
      Alert.alert('Error', e?.message || 'Something Went Wrong');
    }
  };

  const createAccountWithExistingUser = async uid =>
    await axios.post(`${BASE_URL}/user/create`, {
      ...user,
      uid,
      countryCode: phoneInputRef.current.getCountryCode(),
    });

  const createUser = async () => {
    try {
      const authUser = await auth().createUserWithEmailAndPassword(
        user.email,
        user.password,
      );
      await firestore().collection('users').doc(authUser.user.uid).set({
        name: user.name,
        email: user.email,
        number: user.number,
        isActive: true,
        countryCode: phoneInputRef.current.getCountryCode()
      });
    } catch (e) {
      throw new Error(e);
    }
  };

  const handleSignup = async () => {
    try {
      setLoading(true);
      const userSnapshot = await checkUser();
      if (!userSnapshot.empty) {
        const uid = userSnapshot.docs[0].id;
        if (userSnapshot.docs[0].data().isActive) {
          throw new Error('Phone number Already Exist');
        }
        await createAccountWithExistingUser(uid);
      } else {
        await createUser();
      }

      Alert.alert('Success', 'User Created');
    } catch (e) {
      console.log('e?.response?.data', e?.response);
      Alert.alert(
        'ERROR',
        e?.response?.data?.message || e?.message || 'Something went wrong',
      );
    } finally {
      setLoading(false);
    }
  };
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <View style={{width: 300}}>
        <Text style={{color: 'black', fontSize: 30, textAlign: 'center'}}>
          Sign Up
        </Text>
        <TextInput
          style={{
            borderWidth: 1,
            borderColor: 'grey',
            borderRadius: 10,
            width: '100%',
            marginTop: 20,
            height: 45,
            color: 'black',
            backgroundColor: 'white',
          }}
          placeholderTextColor="black"
          placeholder={'Enter Name'}
          onChangeText={text => handleTextChange(text, 'name')}
          value={user.name}
        />
        <View style={{marginTop: 20}}>
          <PhoneInput
            ref={phoneInputRef}
            onChangeText={text => handleTextChange(text, 'number')}
            value={user.number}
          />
        </View>
        {/* <TextInput
          style={{
            borderWidth: 1,
            borderColor: 'grey',
            borderRadius: 10,
            width: '100%',
            marginTop: 20,
            height: 45,
            color: 'black',
          }}
          inputMode="numeric"
          placeholderTextColor="black"
          placeholder={'Contact Number'}
          onChangeText={text => handleTextChange(text, 'number')}
          value={user.number}
        /> */}

        <TextInput
          style={{
            borderWidth: 1,
            borderColor: 'grey',
            borderRadius: 10,
            width: '100%',
            marginTop: 20,
            height: 45,
            color: 'black',
            backgroundColor: 'white',
          }}
          placeholderTextColor="black"
          placeholder={'Enter Email'}
          onChangeText={text => handleTextChange(text, 'email')}
          value={user.email}
        />
        <TextInput
          style={{
            borderWidth: 1,
            borderColor: 'grey',
            borderRadius: 10,
            width: '100%',
            marginTop: 20,
            height: 45,
            color: 'black',
            backgroundColor: 'white',
          }}
          placeholderTextColor="black"
          placeholder={'Enter Password'}
          onChangeText={text => handleTextChange(text, 'password')}
          value={user.password}
        />
        <View style={{width: '100%', alignItems: 'flex-end'}}>
          <TouchableOpacity
            style={{
              backgroundColor: '#ee5253',
              width: 100,
              marginTop: 10,
              padding: 4,
              borderRadius: 5,
            }}
            disabled={
              !user.email || !user.password || !user.name || !user.number
            }
            onPress={handleSignup}>
            {loading ? (
              <ActivityIndicator />
            ) : (
              <Text style={{color: '#ffffff', textAlign: 'center'}}>
                Sign Up
              </Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={{color: '#1e90ff', fontSize: 16, marginTop: 10}}>
              SignIn
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Signup;
