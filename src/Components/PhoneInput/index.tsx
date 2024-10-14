import {forwardRef} from 'react';
import { View, Text } from 'react-native';
import RNPhoneInput from 'react-native-phone-number-input';

import styles from './style';

const PhoneInput = forwardRef(({
    onChangeText,
    onChangeFormattedText,
    onChangeCountry,
    value,
    error
}, ref) => {
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
