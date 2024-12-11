import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Modal,
  Image,
  Platform,
} from 'react-native';
import {Colors, FontFamily, FontSize, hp, wp} from '../../theme';
import {
  RNContainer,
  RNImage,
  RNText,
  RNLoader,
  RNStyles,
  RNKeyboardAvoid,
} from '../../common';
import {useRef, useState} from 'react';
import Validation from '../../utils/Validation';
import FetchMethod from '../../api/FetchMethod';
import Toast from 'react-native-toast-notifications';
import {useTheme} from '../../common/RNThemeContext';
import {useTranslation} from 'react-i18next';
import { Images } from '../../constants';

const ResetPassword = ({navigation, route}) => {
  const {t} = useTranslation();
  const {component} = route.params;
  const toastRef = useRef();
  const {colorScheme} = useTheme();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [newPasswordError, setNewPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [matchPassword, setMatchPassword] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [Successmodel, setSuccessmodel] = useState(false);

  const ResetPasswordSubmit = async () => {
    if (newPassword === '') {
      setNewPasswordError(t('errors.Password'));
      setConfirmPasswordError('');
      setMatchPassword(false);
    } else if (newPassword.length < 8 && newPassword.length > 0) {
      setNewPasswordError(t('errors.passLength'));
    } else if (!Validation.isPasswordValid(newPassword)) {
      setNewPasswordError(t('errors.errPasswordValidation'));
      setConfirmPasswordError('');
      setMatchPassword(false);
    } else if (confirmPassword === '') {
      setConfirmPasswordError('Please Enter Your Password');
      setMatchPassword(false);
      setNewPasswordError('');
    } else if (newPassword !== confirmPassword) {
      setMatchPassword(true);
      setNewPasswordError('');
      setConfirmPasswordError('');
    } else {
      setLoading(true);
      console.log('submit');
      setMatchPassword(false);
      setNewPasswordError('');
      setConfirmPasswordError('');
      try {
        const response = await FetchMethod.POST({
          EndPoint: `Forgotpass/ResetPassword`,
          Params: {
            email: component,
            password: confirmPassword,
          },
        });
        if (response.responseCode == 0) {
          setLoading(false);
          setSuccessmodel(true);
        }
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.log('ResetPassword Error', error);
      }
    }
  };

  return (
    <RNContainer
      style={{
        backgroundColor: colorScheme === 'dark' ? Colors.BgBlack : Colors.White,
      }}>
      <RNKeyboardAvoid offSet={Platform.OS === 'ios' ? hp(5) : hp(10)}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="interactive">
          <View style={{height: hp(42), marginBottom: hp(4)}}>
            <RNImage
              source={
                colorScheme === 'dark'
                  ? require('../../assets/images/ScreenIcone/Dark_reset.png')
                  : require('../../assets/images/ScreenIcone/Light_reset.png')
              }
              style={styles(colorScheme).ImageView}
            />
            <View style={{paddingHorizontal: wp(6)}}>
              <Text style={styles(colorScheme).ContenText}>
                {t('resetPass.resetpassDesc')}
              </Text>
            </View>
          </View>
          <View style={{height: hp(42), paddingHorizontal: wp(6), gap: 50}}>
            <View style={{gap: 20}}>
              {/* New password */}
              <View style={styles(colorScheme).PasswordView}>
                <Text
                  style={{
                    color: colorScheme === 'dark' ? Colors.White : Colors.Black,
                    fontFamily: FontFamily.Medium,
                  }}>
                  {t('resetPass.NewPass')}
                </Text>
                <View
                  style={[
                    styles(colorScheme).passwordContainer,
                    {
                      borderBottomColor:
                        colorScheme === 'dark' ? Colors.White : Colors.Black,
                    },
                  ]}>
                  <TextInput
                    style={[styles(colorScheme).PasswordInputView]}
                    secureTextEntry={!showNewPassword}
                    value={newPassword}
                    onChangeText={setNewPassword}
                  />
                  <TouchableOpacity
                    onPress={() => setShowNewPassword(!showNewPassword)}>
                    <RNImage
                      style={{width: wp(5), height: wp(5)}}
                      source={
                        showNewPassword
                          ? colorScheme === 'dark'
                            ? require('../../assets/images/eye-on.png')
                            : require('../../assets/images/eye-on1.png')
                          : colorScheme === 'dark'
                          ? require('../../assets/images/eye-off.png')
                          : require('../../assets/images/eye-off1.png')
                      }
                    />
                  </TouchableOpacity>
                </View>
                <RNText
                  size={FontSize.font12}
                  pBottom={hp(1)}
                  pTop={hp(newPasswordError ? 0.5 : 0)}
                  color="red">
                  {newPasswordError || ''}
                </RNText>
              </View>

              {/* Confirm password */}
              <View style={styles(colorScheme).PasswordView}>
                <Text
                  style={{
                    color: colorScheme === 'dark' ? Colors.White : Colors.Black,
                    fontFamily: FontFamily.Medium,
                  }}>
                  {t('resetPass.ConfirmPass')}
                </Text>
                <View
                  style={[
                    styles(colorScheme).passwordContainer,
                    {
                      borderBottomColor:
                        colorScheme === 'dark' ? Colors.White : Colors.Black,
                    },
                  ]}>
                  <TextInput
                    style={styles(colorScheme).PasswordInputView}
                    secureTextEntry={!showConfirmPassword}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                  />
                  <TouchableOpacity
                    onPress={() =>
                      setShowConfirmPassword(!showConfirmPassword)
                    }>
                    <RNImage
                      style={{width: wp(5), height: wp(5)}}
                      source={
                        showConfirmPassword
                          ? colorScheme === 'dark'
                            ? require('../../assets/images/eye-on.png')
                            : require('../../assets/images/eye-on1.png')
                          : colorScheme === 'dark'
                          ? require('../../assets/images/eye-off.png')
                          : require('../../assets/images/eye-off1.png')
                      }
                    />
                  </TouchableOpacity>
                </View>
                <RNText
                  size={FontSize.font12}
                  pBottom={hp(1)}
                  pTop={hp(confirmPasswordError || matchPassword ? 0.5 : 0)}
                  color="red">
                  {confirmPasswordError ||
                    (matchPassword ? t('errors.notmatch') : '')}
                </RNText>
              </View>
            </View>

            <View style={{flex: 1}}>
              <View style={{justifyContent: 'flex-end'}}>
                <TouchableOpacity
                  style={styles(colorScheme).SubmitButton}
                  onPress={() => ResetPasswordSubmit()}>
                  <RNText style={styles(colorScheme).SubmitText}>
                    {t('resetPass.Submit')}
                  </RNText>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <Modal visible={Successmodel} transparent={true}>
            <View
              style={[
                RNStyles.flexCenter,
                {
                  backgroundColor:
                    colorScheme === 'dark'
                      ? 'rgba(35, 55, 67, 0.8)'
                      : 'rgba(0 ,0 , 0, 0.5)',
                },
              ]}>
              <View style={styles(colorScheme).successView}>
                <View style={{alignItems: 'center'}}>
                  <Image
                    source={Images.Success}
                    style={styles(colorScheme).IconeView}
                  />
                  <View style={{paddingTop: hp(3)}}>
                    <Text
                      style={[
                        styles(colorScheme).ModelTitalText,
                        {fontSize: FontSize.font24},
                      ]}>
                      {t('resetPass.Success')}
                    </Text>
                    <Text
                      style={[
                        styles(colorScheme).ModelTitalText,
                        {fontSize: FontSize.font13},
                      ]}>
                      {t('resetPass.SuccessMessage')}
                    </Text>
                  </View>
                  <View style={{paddingVertical: hp(5)}}>
                    <TouchableOpacity
                      style={[
                        styles(colorScheme).SubmitButton,
                        {width: wp(50)},
                      ]}
                      onPress={() => {
                        setSuccessmodel(false), navigation.navigate('Login');
                      }}>
                      <RNText style={styles(colorScheme).SubmitText}>
                        {t('resetPass.Done')}
                      </RNText>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          </Modal>
        </ScrollView>
      </RNKeyboardAvoid>
      <Toast ref={toastRef} />
    </RNContainer>
  );
};

const styles = colorScheme =>
  StyleSheet.create({
    ImageView: {
      height: wp(70),
      width: wp(100),
    },
    ContenText: {
      fontSize: FontSize.font16,
      color: colorScheme === 'dark' ? Colors.White : Colors.Black,
      textAlign: 'center',
      fontFamily: FontFamily.SemiBold,
      marginHorizontal: wp(3)
    },
    passwordContainer: {
      borderBottomWidth: 1,

      height: hp(5),
      ...RNStyles.flexRowBetween,
    },
    PasswordInputView: {
      height: hp(6),
      width: wp(80),
      color: colorScheme === 'dark' ? Colors.White : Colors.Black,
      fontSize: FontSize.font14,
      fontFamily: FontFamily.SemiBold,
    },
    SubmitButton: {
      backgroundColor: Colors.Orange,
      borderRadius: 5,
      padding: hp(1),
    },
    SubmitText: {
      color: Colors.White,
      fontSize: FontSize.font18,
      fontFamily: FontFamily.GilroySemiBold,
      textAlign: 'center',
    },
    successView: {
      backgroundColor: colorScheme === 'dark' ? Colors.BgBlack : Colors.White,
      width: wp(85),
      paddingHorizontal: wp(10),
      paddingTop: hp(5),
      borderRadius: 20,
      gap: hp(1),
      justifyContent: 'center',
      alignItems: 'center',
    },
    IconeView: {
      height: hp(15),
      width: wp(40),
    },
    ModelTitalText: {
      fontFamily: FontFamily.SemiBold,
      color: colorScheme === 'dark' ? Colors.LightGrey : Colors.Black,
      textAlign: 'center',
    },
  });

export default ResetPassword;
