import {Text, View, Image, TouchableOpacity} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../Types/navigationTypes';
import firestore from '@react-native-firebase/firestore';

import {logout} from '../../Redux/user/userSlice';
import Button from '../Button';
import backIcon from '../../Assets/icons/back.png';
import { useAppSelector } from '../../Hooks/useAppSelector';
import { useAppDispatch } from '../../Hooks/useAppDispatch';
import styles from './style';

interface HeaderProps {
  route: RouteProp<RootStackParamList, keyof RootStackParamList>;
  navigation: NativeStackNavigationProp<RootStackParamList>;
}
const Header = ({route, navigation}: HeaderProps) => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(state => state.user.data.user);

  const onLogout = async () => {
    try {
        const userDocRef = firestore().collection('users').doc(user?.uid);
        await userDocRef.update({
            deviceToken: ''
        });
        dispatch(logout())
    } catch(e) {
      console.log("ERR", e.message)
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.leftSide}>
        {navigation.canGoBack() && (
          <TouchableOpacity
            style={styles.backIconBox}
            onPress={() => navigation.goBack()}>
            <Image source={backIcon} style={styles.backIcon} />
          </TouchableOpacity>
        )}
        <Text style={styles.screenName}>{route.name} hello</Text>
      </View>
      <Button text="Logout" onPress={onLogout} />
    </View>
  );
};

export default Header;
