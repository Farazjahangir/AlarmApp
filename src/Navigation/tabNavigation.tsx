import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import TabBar from '../Components/TabBar';
import { tabNavigationList } from '../Constants/navigationConstants';

const Tab = createBottomTabNavigator();

const TabNavigation = () => {
  return (
    <Tab.Navigator tabBar={(props) => <TabBar {...props} />}>
      {tabNavigationList.map(item => (
        <Tab.Screen
          key={item.name}
          name={item.name}
          component={item.component}
          options={item.options}
        />
      ))}
    </Tab.Navigator>
  );
};

export default TabNavigation;
