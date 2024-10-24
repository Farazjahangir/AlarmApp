import {Text, View, Image, TouchableOpacity} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../Types/navigationTypes';

import {logout} from '../../Redux/user/userSlice';
import Button from '../Button';
import backIcon from '../../Assets/icons/back.png';
import styles from './style';

interface HeaderProps {
  route: RouteProp<RootStackParamList, keyof RootStackParamList>;
  navigation: NativeStackNavigationProp<RootStackParamList>;
}
const Header = ({route, navigation}: HeaderProps) => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.user.data.user);
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
        <Text style={styles.screenName}>{route.name}</Text>
      </View>
      <Button text="Logout" onPress={() => dispatch(logout())} />
    </View>
  );
};

export default Header;
