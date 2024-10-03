import {Text, View, TouchableOpacity} from 'react-native';

const Home = () => {
  return (
    <View style={{paddingHorizontal: 15}}>
      <Text style={{ fontSize: 25, color: 'black', marginTop: 10 }}>Groups</Text>
      <View
        style={{
          flexDirection: 'row',
          backgroundColor: '#ffffff',
          padding: 10,
          borderRadius: 5,
          alignItems: 'center'
        }}>
        <View style={{flex: 1}}>
          <Text style={{color: 'black', fontSize: 18}}>Group 1</Text>
          <Text style={{color: 'black', fontSize: 12}}>Member Count: </Text>
        </View>
        <TouchableOpacity
          style={{
            backgroundColor: '#ff4d4d',
            height: 35,
            justifyContent: 'center',
            width: 35,
            alignItems: 'center',
            borderRadius: 5,
          }}>
          <Text style={{color: 'black', fontSize: 14, color: '#ffffff'}}>
            Ring
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Home;
