import {Text, TouchableOpacity} from 'react-native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useNavigation} from '@react-navigation/native';

import {ScreenNameConstants} from '../../../Constants/navigationConstants';
import {RootStackParamList} from '../../../Types/navigationTypes';

import styles from './style';

interface TabBarItemProps {
  screenName: ScreenNameConstants;
  selected?: boolean;
}

const TabBarItem = ({screenName, selected}: TabBarItemProps) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const navigateTo = () => {
    if (screenName) {
      navigation.navigate(screenName as keyof RootStackParamList)
    }
  };

  return (
    <TouchableOpacity onPress={navigateTo}>
      <Text style={[styles.screenName, selected && styles.selectedScreenName]}>
        {screenName}
      </Text>
    </TouchableOpacity>
  );
};

export default TabBarItem;
