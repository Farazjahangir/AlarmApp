import {useEffect} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useSelector, useDispatch} from 'react-redux';

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
} from '../Constants/navigationConstants';

const Stack = createNativeStackNavigator<RootStackParamList>();

const AuthStack = () => {
  return (
    <Stack.Navigator>
      {authNavigationList.map(item => (
        <Stack.Screen
          name={item.name}
          component={item.component}
          key={Date.now()}
        />
      ))}
    </Stack.Navigator>
  );
};

const AppStack = () => {
  return (
    <Stack.Navigator screenOptions={{header: props => <Header {...props} />}}>
      {appNavigationList.map(item => (
        <Stack.Screen
          name={item.name}
          component={item.component}
          key={Date.now()}
        />
      ))}
    </Stack.Navigator>
  );
};

const StackNavigation = () => {
  const user = useSelector(state => state.user.data.user);
  const disptach = useDispatch();

  const getContacts = async () => {
    try {
      const hasPermission = await hasContactPermission();
      if (!hasPermission) return;
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
  };

  useEffect(() => {
    if (user) {
      getContacts();
      checkBatteryOptimization();
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
