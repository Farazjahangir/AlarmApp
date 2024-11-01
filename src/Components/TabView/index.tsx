import {useState} from 'react';
import {View, useWindowDimensions, Text} from 'react-native';
import {TabView as RNTabView, SceneMap} from 'react-native-tab-view';

import CustomTabBar from './CustomTabBar';

interface TabRoute {
  key: string;
  title: string;
  component: React.ComponentType<any>;
  props?: Record<string, any>;
}

interface TabViewComponentProps {
    routes: TabRoute[]; // Dynamic list of routes
  }

const TabView = ({routes}: TabViewComponentProps) => {
  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);

  // Create scenes for each route
  const renderScene = SceneMap(
    routes.reduce((scenes, route) => {
      scenes[route.key] = () => <route.component {...route.props} />;
      return scenes;
    }, {} as {[key: string]: React.ComponentType<any>}),
  );
  return (
    <RNTabView
      navigationState={{index, routes}}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{width: layout.width}}
      renderTabBar={props => <CustomTabBar {...props} setIndex={setIndex} />}
    />
  );
};

export default TabView;
