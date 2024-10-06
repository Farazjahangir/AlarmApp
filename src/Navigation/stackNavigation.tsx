import {useEffect} from 'react';
import {View, Text} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useSelector, useDispatch} from 'react-redux';
import firestore from '@react-native-firebase/firestore';

import Home from '../Screens/Home';
import AlarmScreen from '../Screens/AlarmScreen';
import Contacts from '../Screens/Contacts';
import Login from '../Screens/Login';
import Signup from '../Screens/Signup';
import {fetchContacts, checkContactsWithFirestore} from '../Utils';
import {setContacts, setContactLoading} from '../Redux/contacts/contactSlice';
import {fetchDeviceToken} from '../Utils';
import Header from '../Components/Header';
import { registerDeviceForFCM } from '../Utils';

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
      console.log('FETCHING CONTACTS...');
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

 

  useEffect(() => {
    if (user) {
      getContacts();
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
