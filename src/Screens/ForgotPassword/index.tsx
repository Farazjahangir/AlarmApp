import {
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import {useState} from 'react';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';

import TextInput from '../../Components/TextInput';
import Button from '../../Components/Button';
import {RootStackParamList} from '../../Types/navigationTypes';
import {ScreenNameConstants} from '../../Constants/navigationConstants';
import {handleError} from '../../Utils/helpers';
import {useMessageBox} from '../../Context/MessageBoxContextProvider';
import { sendForgotPasswordEmailSchema, validate } from '../../Utils/yup';
import { useSendForgotPasswordEmail } from '../../Hooks/reactQuery/useSendForgotPasswordEmail';
import styles from './style';

const ForgotPassword = ({
  navigation,
}: NativeStackScreenProps<
  RootStackParamList,
  typeof ScreenNameConstants.FORGOT_PASSWORD
>) => {

  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState('')

  const { openMessageBox } = useMessageBox()
  const sendForgotPasswordEmailMut = useSendForgotPasswordEmail()

  const onChangeText = (val: string) => {
    setEmail(val);
    setEmailError('')
  }
  const handleSubmit = async () => {
    try {
      const errors = await validate(sendForgotPasswordEmailSchema, {email})
      if (Object.keys(errors).length) {
        setEmailError(errors.email)
        return
      }
      await sendForgotPasswordEmailMut.mutateAsync({ email })
      openMessageBox({
        title: "Success",
        message: "Check your email for reset flow"
      })
      navigation.navigate(ScreenNameConstants.LOGIN)
    } catch(e) {
      const error = handleError(e)
      openMessageBox({
        title: "Error",
        message: error
      })
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.contentBox}>
        <Text style={styles.title}>Forgot your password</Text>
        <Text style={styles.greetingText}>Don't worry you can reset from here</Text>
        <View style={styles.inputContainer}>
          <Text style={styles.inputTitle}>Account Information</Text>
          <View>
            <TextInput
              placeholder={'Enter Email'}
              onChangeText={onChangeText}
              value={email}
              error={emailError}
            />
          </View>
          <View style={styles.linksBox}>
            <TouchableOpacity
              onPress={() => navigation.navigate(ScreenNameConstants.LOGIN)}>
              <Text style={styles.signupText}>Log in now</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.btnBox}>
          <Button
            text="Submit"
            onPress={handleSubmit}
            disabled={sendForgotPasswordEmailMut.isPending}
            loading={sendForgotPasswordEmailMut.isPending}
          />
        </View>
      </View>
    </View>
  );
};

export default ForgotPassword;
