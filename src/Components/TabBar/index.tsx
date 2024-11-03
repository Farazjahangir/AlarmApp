import {View, Text} from 'react-native';
import {BottomTabBarProps} from '@react-navigation/bottom-tabs';
import firestore from '@react-native-firebase/firestore';

import TabBarItem from './TabBarItem';
import {ScreenNameConstants} from '../../Constants/navigationConstants';
import logoutIcon from '../../Assets/icons/logout.png';
import logoutGreyIcon from '../../Assets/icons/logoutGrey.png';
import homeIcon from '../../Assets/icons/home.png';
import homeGreyIcon from '../../Assets/icons/homeGrey.png';
import userIcon from '../../Assets/icons/user.png';
import userGreyIcon from '../../Assets/icons/userGrey.png';
import { useAppDispatch } from '../../Hooks/useAppDispatch';
import {logout} from '../../Redux/user/userSlice';
import { useAppSelector } from '../../Hooks/useAppSelector';
import styles from './style';

const TabBar = ({state}: BottomTabBarProps) => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(state => state.user.data.user);

  const onLogout = async () => {
    try {
      const userDocRef = firestore().collection('users').doc(user?.uid);
      await userDocRef.update({
        deviceToken: '',
      });
      dispatch(logout());
    } catch (e) {
      console.log('ERR', e.message);
    }
  };
  return (
    <View style={styles.container}>
      <View style={styles.contentBox}>
        <TabBarItem
          screenName={ScreenNameConstants.HOME}
          selected={state.index === 0}
          icon={homeGreyIcon}
          iconSelected={homeIcon}
          title="Home"
        />
        <TabBarItem
          // screenName={ScreenNameConstants.CONTACTS}
          title="Profile"
          selected={state.index === 1}
          icon={userGreyIcon}
          iconSelected={userIcon}
        />
        <TabBarItem icon={logoutGreyIcon} title="Logout" onPress={onLogout} />
      </View>
    </View>
  );
};

export default TabBar;
