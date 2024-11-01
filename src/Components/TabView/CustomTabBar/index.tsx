import {View, Text, TouchableOpacity} from 'react-native';
import {TabBarProps as RNTabBarProps, Route} from 'react-native-tab-view';

import styles from './style';

interface CustomTabBar extends RNTabBarProps<Route> {
  setIndex: (index: number) => void;
}

const CustomTabBar = ({navigationState, setIndex}: CustomTabBar) => {
  return (
    <View style={styles.container}>
      {navigationState.routes.map((route: any, i: number) => (
        <TouchableOpacity
          key={route.key}
          onPress={() => setIndex(i)}
          style={styles.tabItem}>
          <Text
            style={[
              styles.title,
              navigationState.index === i && styles.activeTabText,
            ]}>
            {route.title}
          </Text>
          {navigationState.index === i && <View style={styles.underline} />}
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default CustomTabBar;
