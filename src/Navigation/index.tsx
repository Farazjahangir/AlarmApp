import {NavigationContainer} from '@react-navigation/native';

import StackNavigation from './stackNavigation';
import { navigationRef } from '../Services/NavigationService';

const linking = {
  prefixes: ['myalarmapp://'],
  config: {
    screens: {
      Home: 'home',
      'Alarm Screen': 'alarm',
    },
  },
};

const Navigation = () => {
  return (
    <NavigationContainer linking={linking} ref={navigationRef}>
      <StackNavigation />
    </NavigationContainer>
  );
};

export default Navigation;
