import {useEffect} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {
  fetchContacts,
  checkContactsWithFirestore,
  hasContactPermission,
} from '../Utils';
import {setContacts, setContactLoading} from '../Redux/contacts/contactSlice';
import Header from '../Components/Header';
import {registerDeviceForFCM, checkForBatteryOptimization} from '../Utils';
import {RootStackParamList} from '../Types/navigationTypes';
import {
  appNavigationList,
  authNavigationList,
  ScreenNameConstants,
} from '../Constants/navigationConstants';
import { useAppDispatch } from '../Hooks/useAppDispatch';
import { useAppSelector } from '../Hooks/useAppSelector';

const Stack = createNativeStackNavigator<RootStackParamList>();

const AuthStack = () => {
  return (
    <Stack.Navigator>
      {authNavigationList.map(item => (
        <Stack.Screen
          name={item.name}
          component={item.component}
          key={Date.now()}
          options={item.options}
        />
      ))}
    </Stack.Navigator>
  );
};

const AppStack = () => {
  const isUserProfileComplete = useAppSelector(state => state.user.data.user?.isProfileComplete);
  const initialRoute = isUserProfileComplete ? ScreenNameConstants.HOME : ScreenNameConstants.COMPLETE_PROFILE
  return (
    <Stack.Navigator initialRouteName={initialRoute}>
      {appNavigationList.map(item => (
        <Stack.Screen
          name={item.name}
          component={item.component}
          key={Date.now()}
          options={item.options}
        />
      ))}
    </Stack.Navigator>
  );
};

const StackNavigation = () => {
  const user = useAppSelector(state => state.user.data.user);
  const disptach = useAppDispatch();

  const getContacts = async () => {
    try {
      const hasPermission = await hasContactPermission();
      if (!hasPermission) return;
      disptach(setContactLoading(true));
      const contacts = await fetchContacts();
      const firestoreRes = await checkContactsWithFirestore(contacts, user);
      console.log("firestoreRes?.contactsWithAccount ========>", firestoreRes?.contactsWithAccount)
      disptach(
        setContacts({
          contactsWithAccount: firestoreRes?.contactsWithAccount || [],
          contactsWithoutAccount: firestoreRes?.contactsWithoutAccount || [],
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
  };

  useEffect(() => {
    if (user) {
      getContacts();
      // checkBatteryOptimization();
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
