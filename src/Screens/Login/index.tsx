import {View, Text, TextInput, TouchableOpacity} from 'react-native';

const Login = () => {
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
          inputMode="numeric"
        />
        <View style={{width: '100%', alignItems: 'flex-end'}}>
          <TouchableOpacity
            style={{backgroundColor: '#ee5253', width: 100, marginTop: 10, padding: 4, borderRadius: 5}}>
            <Text style={{color: '#ffffff', textAlign: 'center'}}>Next</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Login;
