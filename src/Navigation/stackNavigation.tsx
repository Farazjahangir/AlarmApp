import {View, Text} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import { useSelector } from 'react-redux';

import Home from '../Screens/Home';
import AlarmScreen from '../Screens/AlarmScreen';
import Contacts from '../Screens/Contacts';
import Login from '../Screens/Login';
import Signup from '../Screens/Signup';

const Stack = createNativeStackNavigator();

const AuthStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Sign Up" component={Signup} />
    </Stack.Navigator>
  );
};

const AppStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Contacts" component={Contacts} />
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Alarm Screen" component={AlarmScreen} />
    </Stack.Navigator>
  );
};

const StackNavigation = () => {
  const user = useSelector(state => state.user.data.user)
  return user ? <AppStack /> : <AuthStack />
};

export default StackNavigation
