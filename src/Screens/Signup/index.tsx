import {View, Text, TextInput, TouchableOpacity, Alert} from 'react-native';
import {useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

import { fetchDeviceToken } from '../../Utils';

const Signup = () => {
  const [user, setUser] = useState({
    email: '',
    password: '',
    name: ''
  });

  const navigation = useNavigation();

  const handleTextChange = (text, key) => {
    data = {...user};
    data[key] = text;
    setUser(data);
  };

  const handleSignup = async () => {
    try {
      const authUser = await auth().createUserWithEmailAndPassword(user.email, user.password)
      const token = await fetchDeviceToken()
      await firestore().collection('users').doc(authUser.user.uid).set({
        name: user.name,
        email: user.email,
        deviceToken: token,
      })
      Alert.alert("User Created")
    } catch(e) {
      console.log("handleSignup ==>", e.message)
    }
  }
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
          }}
          placeholderTextColor="black"
          placeholder={'Enter Name'}
          onChangeText={text => handleTextChange(text, 'name')}
          value={user.name}
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
            disabled={!user.email || !user.password || !user.name}
            onPress={handleSignup}>
            <Text style={{color: '#ffffff', textAlign: 'center'}}>Sign Up</Text>
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
