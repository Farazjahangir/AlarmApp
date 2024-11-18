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
import { setContacts } from '../../Redux/contacts/contactSlice';
import { useUpdateUserProfile } from '../../Hooks/reactQuery/useUpdateUserProfile';
import { useMessageBox } from '../../Context/MessageBoxContextProvider';
import { handleError } from '../../Utils/helpers';
import { useLogoutFirebase } from '../../Hooks/reactQuery/useLogoutFirebase';
import styles from './style';

const TabBar = ({state}: BottomTabBarProps) => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(state => state.user.data.user);
  const updateUserProfileMut = useUpdateUserProfile()
  const logoutFirebaseMut = useLogoutFirebase()
  const { openMessageBox } = useMessageBox()

  const onLogout = async () => {
    try {
      const payload = {
        data: {
          deviceToken: ''
        },
        uid: user?.uid as string,
      };
      updateUserProfileMut.mutateAsync(payload)
      dispatch(setContacts({
        contactsWithAccount: [],
        contactsWithoutAccount: []
      }))
      logoutFirebaseMut.mutateAsync()
      dispatch(logout());
    } catch (e) {
      const error = handleError(e)
      openMessageBox({
        title: "Error",
        message: error
      })
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
          screenName={ScreenNameConstants.PROFILE}
          title="Profile"
          selected={state.index === 1}
          icon={userGreyIcon}
          iconSelected={userIcon}
          image={user?.image}
        />
        <TabBarItem icon={logoutGreyIcon} title="Logout" onPress={onLogout} />
      </View>
    </View>
  );
};

export default TabBar;
