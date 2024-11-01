import {View, Text} from 'react-native';
import {BottomTabBarProps} from '@react-navigation/bottom-tabs';

import TabBarItem from './TabBarItem';
import styles from './style';
import {ScreenNameConstants} from '../../Constants/navigationConstants';

const TabBar = ({state}: BottomTabBarProps) => {
  console.log("state ======>", state)
  return (
    <View style={styles.container}>
      <View style={styles.contentBox}>
        <TabBarItem
          screenName={ScreenNameConstants.HOME}
          selected={state.index === 0}
        />
        <TabBarItem
          screenName={ScreenNameConstants.CONTACTS}
          selected={state.index === 1}
        />
      </View>
    </View>
  );
};

export default TabBar;
