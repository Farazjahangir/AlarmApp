import {View, Text} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Home from '../Screens/Home';
import AlarmScreen from '../Screens/AlarmScreen';

const Stack = createNativeStackNavigator();

const AppStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Alarm Screen" component={AlarmScreen} />
    </Stack.Navigator>
  );
};

const StackNavigation = () => {
  return <AppStack />;
};

export default StackNavigation
