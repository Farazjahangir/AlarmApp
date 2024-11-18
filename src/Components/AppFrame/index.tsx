import {ReactNode} from 'react';
import {View, ViewStyle} from 'react-native';

import styles from './style';

interface AppFrameProps {
  children: ReactNode;
  containerStyle?: ViewStyle
}

const AppFrame = ({children, containerStyle}: AppFrameProps) => {
  return <View style={[styles.container, containerStyle]}>{children}</View>;
};
export default AppFrame;
