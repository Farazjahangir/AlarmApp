import {Text, View, TouchableOpacity} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';

import {logout} from '../../Redux/user/userSlice';

const Header = ({route}) => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.user.data.user)
  return (
    <View
      style={{
        backgroundColor: '#ffffff',
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 14,
        alignItems: 'center'
      }}>
      <Text style={{color: 'black', fontSize: 20}}>{route.name}</Text>
      <Text style={{color: 'black', fontSize: 16}}>Hi, {user.name}</Text>
      <TouchableOpacity
        style={{
          backgroundColor: '#ff4d4d',
          width: 60,
          borderRadius: 5,
          alignItems: 'center',
          justifyContent: 'center',
        }}
        onPress={() => dispatch(logout())}>
        <Text style={{color: '#ffffff'}}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Header;
