import RNCheckBox, { CheckBoxProps as RNCheckBoxProps } from '@react-native-community/checkbox';

import COLORS from '../../Constants/colors';

interface CheckBoxProps {
    value?: boolean;
    onValueChange?: RNCheckBoxProps['onValueChange']
}

const CheckBox = ({value, onValueChange}: CheckBoxProps) => {
  return (
    <RNCheckBox
      value={value}
      tintColors={{true: COLORS.primePurple, false: COLORS.inputBorder}}
      onValueChange={onValueChange}
    />
  );
};

export default CheckBox;
