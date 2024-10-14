import {forwardRef} from 'react';
import RNPhoneInput from 'react-native-phone-number-input';

import styles from './style';

const PhoneInput = forwardRef(({
    onChangeText,
    onChangeFormattedText,
    onChangeCountry,
    value
}, ref) => {
  return (
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
  );
});

export default PhoneInput;
