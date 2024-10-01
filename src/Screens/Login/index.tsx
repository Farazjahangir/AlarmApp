import {View, Text, TextInput, TouchableOpacity} from 'react-native';
import {useState} from 'react';
import { useNavigation } from '@react-navigation/native';
import { useSelector, UseSelector } from 'react-redux';

const Login = () => {
  const [userCreds, setUserCreds] = useState({
    email: '',
    password: '',
  });

  const navigation = useNavigation()
  console.log("USER", useSelector(state => state.user))

    const handleTextChange = (text, key) => {
      data = {...userCreds}
      data[key] = text
      setUserCreds(data)
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
            }}>
            <Text style={{color: '#ffffff', textAlign: 'center'}}>Sign In</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Sign Up')}>
            <Text style={{ color: '#1e90ff', fontSize: 16, marginTop: 10 }}>SignUp</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Login;
