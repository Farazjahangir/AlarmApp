import {useEffect} from 'react';
import {View, Text} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useSelector, useDispatch} from 'react-redux';
import firestore from '@react-native-firebase/firestore';
import { request, PERMISSIONS, check, RESULTS } from 'react-native-permissions';

import Home from '../Screens/Home';
import AlarmScreen from '../Screens/AlarmScreen';
import Contacts from '../Screens/Contacts';
import Login from '../Screens/Login';
import Signup from '../Screens/Signup';
import {fetchContacts, checkContactsWithFirestore, hasContactPermission} from '../Utils';
import {setContacts, setContactLoading} from '../Redux/contacts/contactSlice';
import Header from '../Components/Header';
import { registerDeviceForFCM, checkForBatteryOptimization } from '../Utils';

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
    <Stack.Navigator screenOptions={{ header: (props) => <Header {...props} /> }}>
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Contacts" component={Contacts} />
      <Stack.Screen name="Alarm Screen" component={AlarmScreen} />
    </Stack.Navigator>
  );
};

const StackNavigation = () => {
  const user = useSelector(state => state.user.data.user);
  const disptach = useDispatch();

  const getContacts = async () => {
    try {
      const hasPermission = await hasContactPermission()
      if (!hasPermission) return
      disptach(setContactLoading(true));
      const contacts = await fetchContacts();
      const firestoreRes = await checkContactsWithFirestore(contacts, user);
      disptach(
        setContacts({
          contactsWithAccount: firestoreRes?.contactsWithAccount,
          contactsWithoutAccount: firestoreRes?.contactsWithoutAccount,
        }),
      );
    } catch (e) {
      console.log('getContacts ERRR', e?.message);
    } finally {
      disptach(setContactLoading(false));
    }
  };

  const checkBatteryOptimization = async () => {
    await checkForBatteryOptimization();
  }
 

  useEffect(() => {
    if (user) {
      getContacts();
      checkBatteryOptimization()
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      registerDeviceForFCM(user.uid);
    }
  }, []);
  return user ? <AppStack /> : <AuthStack />;
};

export default StackNavigation;
