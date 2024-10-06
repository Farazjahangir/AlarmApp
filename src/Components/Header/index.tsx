import {Text, View, TouchableOpacity} from 'react-native';

const Header = ({route}) => {
  return (
    <View style={{ backgroundColor: '#ffffff', flexDirection: 'row', justifyContent: 'space-between', padding: 14 }}>
      <Text style={{ color: 'black', fontSize: 20 }}>{route.name}</Text>
      <TouchableOpacity style={{ backgroundColor: '#ff4d4d', width: 60, borderRadius: 5, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ color: '#ffffff' }}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Header;
