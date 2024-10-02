import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {useSelector, useDispatch} from 'react-redux';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

import {setUser} from '../../Redux/user/userSlice';

const Login = () => {
  const [userCreds, setUserCreds] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation();
  const dispatch = useDispatch();

  const handleTextChange = (text, key) => {
    data = {...userCreds};
    data[key] = text;
    setUserCreds(data);
  };

  const handleSignin = async () => {
    try {
      setLoading(true);
      const authUser = await auth().signInWithEmailAndPassword(
        userCreds.email,
        userCreds.password,
      );
      const userData = await firestore()
        .collection('users')
        .doc(authUser.user.uid)
        .get();
      dispatch(setUser(userData._data));
    } catch (e) {
      console.log('handleSignin ==>', e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <View style={{width: 300}}>
        <Text style={{color: 'black', fontSize: 30, textAlign: 'center'}}>
          Sign In
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
          placeholder={'Enter Email'}
          onChangeText={text => handleTextChange(text, 'email')}
          value={userCreds.email}
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
          value={userCreds.password}
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
            onPress={handleSignin}
            disabled={!userCreds.email || !userCreds.password || loading}>
            {loading ? (
              <ActivityIndicator />
            ) : (
              <Text style={{color: '#ffffff', textAlign: 'center'}}>
                Sign In
              </Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Sign Up')}>
            <Text style={{color: '#1e90ff', fontSize: 16, marginTop: 10}}>
              SignUp
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Login;
