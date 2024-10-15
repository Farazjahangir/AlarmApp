import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {useState, useRef} from 'react';
import {useNavigation} from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import firestore, {Filter} from '@react-native-firebase/firestore';
import PhoneInput from '../../Components/PhoneInput';
import parsePhoneNumber from 'libphonenumber-js';
import axios from 'axios';

import {BASE_URL} from '../../Utils/constants';
import {removeSpaces} from '../../Utils';
import TextInput from '../../Components/TextInput';
import Button from '../../Components/Button';
import {validateEmail} from '../../Utils';
import styles from './style';

const Signup = () => {
  const [user, setUser] = useState({
    email: '',
    password: '',
    name: '',
    number: '',
  });

  const [errors, setErrors] = useState({
    email: '',
    password: '',
    name: '',
    number: '',
  });

  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const phoneInputRef = useRef(null);

  const handleTextChange = (text, key) => {
    const data = {...user};
    const errorsText = {...errors};

    data[key] = text;
    errorsText[key] = '';
    setUser(data);
    setErrors(errorsText);
  };

  const checkUser = async () => {
    try {
      const countryCode = phoneInputRef.current.getCountryCode();
      const num = parsePhoneNumber(user.number, countryCode);
      const internationalFormat = num.formatInternational();
      const nationalFormat = num.formatNational();
      const snapShot = await firestore()
        .collection('users')
        .where(
          Filter.or(
            Filter('number', '==', removeSpaces(internationalFormat)),
            Filter('number', '==', removeSpaces(nationalFormat)),
            Filter('number', '==', user.number),
          ),
        )
        .get();

      return snapShot;
    } catch (e) {
      Alert.alert('Error', e?.message || 'Something Went Wrong');
    }
  };

  const createAccountWithExistingUser = async uid =>
    await axios.post(`${BASE_URL}/user/create`, {
      ...user,
      uid,
      countryCode: phoneInputRef.current.getCountryCode(),
      email: user.email.trim(),
    });

  const createUser = async () => {
    try {
      const authUser = await auth().createUserWithEmailAndPassword(
        user.email.trim(),
        user.password,
      );
      await firestore().collection('users').doc(authUser.user.uid).set({
        name: user.name,
        email: user.email.trim(),
        number: user.number,
        isActive: true,
        countryCode: phoneInputRef.current.getCountryCode(),
      });
    } catch (e) {
      throw new Error(e);
    }
  };

  const validateInputs = () => {
    const errorText = {...errors};
    let isValid = true;

    if (!user.name) {
      errorText.name = 'Required';
      isValid = false;
    }
    if (!user.email) {
      errorText.email = 'Required';
      isValid = false;
    }
    if (user.email && !validateEmail(user.email)) {
      errorText.email = 'Email is not valid';
      isValid = false;
    }
    if (!user.number) {
      errorText.number = 'Required';
      isValid = false;
    }

    if (user.number) {
      if (
        user.number.startsWith('0') ||
        !phoneInputRef.current.isValidNumber(user.number)
      ) {
        errorText.number = 'Please enter valid number';
        isValid = false;
      }
    }

    if (!user.password) {
      errorText.password = 'Required';
      isValid = false;
    }

    setErrors(errorText);
    return isValid;
  };

  const handleSignup = async () => {
    try {
      if (!validateInputs()) return;
      setLoading(true);
      const userSnapshot = await checkUser();
      if (!userSnapshot.empty) {
        const uid = userSnapshot.docs[0].id;
        if (userSnapshot.docs[0].data().isActive) {
          throw new Error('Phone number Already Exist');
        }
        await createAccountWithExistingUser(uid);
      } else {
        await createUser();
      }

      Alert.alert('Success', 'User Created');
      navigation.navigate('Login');
    } catch (e) {
      console.log('e?.response?.data', e?.response);
      Alert.alert(
        'ERROR',
        e?.response?.data?.message || e?.message || 'Something went wrong',
      );
    } finally {
      setLoading(false);
    }
  };
  return (
    <View style={styles.container}>
      <View style={styles.contentBox}>
        <Text style={styles.title}>Sign Up</Text>
        <View style={styles.inputBox}>
          <TextInput
            placeholder={'Enter Name'}
            onChangeText={text => handleTextChange(text, 'name')}
            value={user.name}
            error={errors.name}
          />
        </View>
        <View style={styles.inputBox}>
          <PhoneInput
            ref={phoneInputRef}
            onChangeText={text => handleTextChange(text, 'number')}
            value={user.number}
            error={errors.number}
          />
        </View>
        <View style={styles.inputBox}>
          <TextInput
            placeholder={'Enter Email'}
            onChangeText={text => handleTextChange(text, 'email')}
            value={user.email}
            error={errors.email}
          />
        </View>
        <View style={styles.inputBox}>
          <TextInput
            placeholder={'Enter Password'}
            onChangeText={text => handleTextChange(text, 'password')}
            value={user.password}
            secureTextEntry
            error={errors.password}
          />
        </View>
        <View style={styles.btnBox}>
          <Button
            text={'Signup'}
            disabled={loading}
            onPress={handleSignup}
            loading={loading}
          />
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.linkText}>SignIn</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Signup;
