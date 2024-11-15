import {
  Text,
  TouchableOpacity,
  ImageSourcePropType,
  Image,
  TouchableOpacityProps,
} from 'react-native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useNavigation} from '@react-navigation/native';
import {ParamListBase} from '@react-navigation/native';

import {ScreenNameConstants} from '../../../Constants/navigationConstants';
import {RootStackParamList} from '../../../Types/navigationTypes';

import styles from './style';

interface TabBarItemProps {
  screenName?: ScreenNameConstants;
  selected?: boolean;
  icon: ImageSourcePropType;
  iconSelected?: ImageSourcePropType;
  title: string;
  onPress?: TouchableOpacityProps['onPress'];
  image?: string;
}

const TabBarItem = ({
  screenName,
  selected,
  icon,
  iconSelected,
  title,
  onPress,
  image
}: TabBarItemProps) => {
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();

  const navigateTo = () => {
    if (screenName) {
      navigation.navigate(screenName);
    }
  };

  return (
    <TouchableOpacity onPress={onPress || navigateTo} style={styles.container}>
      <Image source={image ? {uri: image} : selected ? iconSelected : icon} style={[styles.icon, image && styles.image]} />
      <Text style={[styles.screenName, selected && styles.selectedScreenName]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default TabBarItem;
