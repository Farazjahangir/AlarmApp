import { Image, View, Text, StyleProp, TextStyle, ViewStyle } from 'react-native';
import {
  Switch as RNSwitch,
  SwitchProps as RNSwitchProps,
} from 'react-native-switch';

import tickIcon from "../../Assets/icons/switchTick.png"
import closeIcon from "../../Assets/icons/switchClose.png"
import COLORS from '../../Constants/colors';
import styles from './style';

interface SwitchProps {
  circleSize?: number;
  barHeight?: number;
  circleBorderWidth?: number;
  backgroundActive?: string;
  backgroundInactive?: string;
  circleActiveColor?: string;
  circleInActiveColor?: string;
  innerCircleStyle?: RNSwitchProps['innerCircleStyle'];
  value?: boolean;
  onValueChange?: RNSwitchProps['onValueChange'];
  labelStyle?: StyleProp<TextStyle>;
  label?: string;
  containerStyle?: StyleProp<ViewStyle>
}
const Switch = ({
  circleSize,
  barHeight,
  circleBorderWidth,
  backgroundActive,
  backgroundInactive,
  circleActiveColor,
  circleInActiveColor,
  innerCircleStyle,
  value,
  onValueChange,
  labelStyle,
  label,
  containerStyle
}: SwitchProps) => {

    const renderInsideCircle = () => (
        <Image source={value ? tickIcon : closeIcon} style={styles.icon} />
    )

  return (
    <View style={[styles.container, containerStyle]}>
        <RNSwitch
          value={value}
          circleSize={circleSize}
          barHeight={barHeight}
          circleBorderWidth={circleBorderWidth}
          backgroundActive={backgroundActive}
          backgroundInactive={backgroundInactive}
          circleActiveColor={circleActiveColor}
          circleInActiveColor={circleInActiveColor}
          renderActiveText={false}
          renderInActiveText={false}
          innerCircleStyle={[styles.circle, innerCircleStyle]}
          onValueChange={onValueChange}
          renderInsideCircle={renderInsideCircle}
        />
        <Text style={[styles.label, labelStyle]}>{label}</Text>
    </View>
  );
};

Switch.defaultProps = {
  circleSize: 25,
  barHeight: 24,
  circleBorderWidth: 0,
  backgroundActive: COLORS.lightGrey,
  backgroundInactive: COLORS.lightGrey,
  circleActiveColor: COLORS.switchActiveColor,
  circleInActiveColor: COLORS.switchInactiveColor,
  label: ''
};

export default Switch;
