import {forwardRef, Ref} from 'react';
import { View, Text } from 'react-native';
import RNPhoneInput, { PhoneInputProps as RNPhoneInputProps} from 'react-native-phone-number-input';

import styles from './style';

interface PhoneInputProps {
  onChangeText?: RNPhoneInputProps['onChangeText'];
  onChangeFormattedText?: RNPhoneInputProps['onChangeFormattedText'];
  onChangeCountry?: RNPhoneInputProps['onChangeCountry'];
  value: RNPhoneInputProps['value'];
  error?: string
}

const PhoneInput = forwardRef<RNPhoneInput, PhoneInputProps>(({
    onChangeText,
    onChangeFormattedText,
    onChangeCountry,
    value,
    error
}: PhoneInputProps, ref: Ref<RNPhoneInput>) => {
  return (
    <View>
      <RNPhoneInput
        ref={ref}
        defaultCode="PK"
        layout="first"
        onChangeText={onChangeText}
        onChangeFormattedText={onChangeFormattedText}
        onChangeCountry={onChangeCountry}
        // withDarkTheme
        // withShadow
        // autoFocus
        textContainerStyle={styles.textContainer}
        containerStyle={styles.container}
        textInputStyle={styles.textInput}
        codeTextStyle={styles.codeText}
        value={value}
      />
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
});

export default PhoneInput;
