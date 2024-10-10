import {Text, View, Image, TouchableOpacity} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';

import {logout} from '../../Redux/user/userSlice';
import Button from '../Button';
import backIcon from '../../Assets/icons/back.png';
import styles from './style';

const Header = ({route, navigation}) => {
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
      <Text style={styles.username}>Hi, {user.name}</Text>
      <Button text="Logout" onPress={() => dispatch(logout())} />
    </View>
  );
};

export default Header;
