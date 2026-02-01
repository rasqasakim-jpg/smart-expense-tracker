import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  ScrollView,
  SafeAreaView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  Animated,
} from 'react-native';
import { Formik } from 'formik';
import { registerSchema } from '../../utils/validation';
import { RegisterRequest } from '../../types/auth';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../../navigation/AuthNavigator';
import Ionicons from '@react-native-vector-icons/ionicons'; 

// Import components animation
import SuccessToast from '../../components/common/SuccesToast';
import LoadingOverlay from '../../components/common/LoadingOverlay';
import AnimatedButton from '../../components/common/AnimatedButton';

type RegisterScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Register'>;

interface Props {
  navigation: RegisterScreenNavigationProp;
}

const RegisterScreen: React.FC<Props> = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [showSuccess, setShowSuccess] = useState(false);
  
  // Animation values
  const headerSlideAnim = useRef(new Animated.Value(-50)).current;
  const formSlideAnim = useRef(new Animated.Value(30)).current;
  const formFadeAnim = useRef(new Animated.Value(0)).current;
  const buttonScaleAnim = useRef(new Animated.Value(1)).current;
  const errorShakeAnim = useRef(new Animated.Value(0)).current;
  
  // For error message animations
  const nameErrorAnim = useRef(new Animated.Value(0)).current;
  const emailErrorAnim = useRef(new Animated.Value(0)).current;
  const passwordErrorAnim = useRef(new Animated.Value(0)).current;
  const termsFadeAnim = useRef(new Animated.Value(0)).current;
  const loginFadeAnim = useRef(new Animated.Value(0)).current;
  const demoFadeAnim = useRef(new Animated.Value(0)).current;

  // Entry animations
  useEffect(() => {
    // Header slide in
    Animated.spring(headerSlideAnim, {
      toValue: 0,
      friction: 8,
      tension: 40,
      useNativeDriver: true,
    }).start();

    // Form slide up + fade in
    Animated.parallel([
      Animated.timing(formFadeAnim, {
        toValue: 1,
        duration: 500,
        delay: 200,
        useNativeDriver: true,
      }),
      Animated.spring(formSlideAnim, {
        toValue: 0,
        friction: 8,
        tension: 40,
        delay: 200,
        useNativeDriver: true,
      }),
    ]).start();
    
    // Staggered animations for other elements
    setTimeout(() => {
      Animated.timing(termsFadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }).start();
    }, 600);
    
    setTimeout(() => {
      Animated.timing(loginFadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }).start();
    }, 700);
    
    setTimeout(() => {
      Animated.timing(demoFadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }).start();
    }, 800);
  }, []);

  // Error shake animation
  const triggerErrorShake = () => {
    Animated.sequence([
      Animated.timing(errorShakeAnim, {
        toValue: 10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(errorShakeAnim, {
        toValue: -10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(errorShakeAnim, {
        toValue: 10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(errorShakeAnim, {
        toValue: 0,
        duration: 50,
        useNativeDriver: true,
      }),
    ]).start();
  };

  // Show error with animation
  const showErrorAnimation = (field: string) => {
    let animRef;
    switch (field) {
      case 'fullName':
        animRef = nameErrorAnim;
        break;
      case 'email':
        animRef = emailErrorAnim;
        break;
      case 'password':
        animRef = passwordErrorAnim;
        break;
      default:
        return;
    }
    
    Animated.sequence([
      Animated.timing(animRef, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };

  // Hide error with animation
  const hideErrorAnimation = (field: string) => {
    let animRef;
    switch (field) {
      case 'fullName':
        animRef = nameErrorAnim;
        break;
      case 'email':
        animRef = emailErrorAnim;
        break;
      case 'password':
        animRef = passwordErrorAnim;
        break;
      default:
        return;
    }
    
    Animated.timing(animRef, {
      toValue: 0,
      duration: 150,
      useNativeDriver: true,
    }).start();
  };

  const handleRegister = async (values: RegisterRequest) => {
    try {
      setLoading(true);
      setFormErrors({});
      
      // Button loading animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(buttonScaleAnim, {
            toValue: 1.05,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(buttonScaleAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      ).start();
      
      // Validate with Yup
      await registerSchema.validate(values, { abortEarly: false });
      
      console.log('Register attempt:', values);
      
      // SIMULASI API CALL - BERHASIL
      await new Promise<void>(resolve => setTimeout(resolve, 1500));
      
      // Stop loading animation
      buttonScaleAnim.stopAnimation();
      Animated.timing(buttonScaleAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
      
      // Show success toast
      setShowSuccess(true);
      
      // Navigate to OTP after 1.5 seconds
      setTimeout(() => {
        navigation.navigate('Otp', {
          email: values.email,
          userId: Date.now(), // Mock user ID
        });
      }, 1500);
      
    } catch (error: any) {
      console.log('Register error:', error);
      
      // Stop loading animation
      buttonScaleAnim.stopAnimation();
      Animated.timing(buttonScaleAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
      
      // Handle Yup validation errors
      if (error.name === 'ValidationError') {
        const errors: Record<string, string> = {};
        error.inner.forEach((err: any) => {
          errors[err.path] = err.message;
          showErrorAnimation(err.path);
        });
        setFormErrors(errors);
        triggerErrorShake(); // Trigger shake animation
        return;
      }
      
      // Handle API validation errors (422)
      if (error?.errors) {
        const errors: Record<string, string> = {};
        Object.keys(error.errors).forEach(key => {
          errors[key] = error.errors[key][0];
          showErrorAnimation(key);
        });
        setFormErrors(errors);
        triggerErrorShake(); // Trigger shake animation
        return;
      }
      
      // Handle duplicate email error
      if (values.email === 'existing@test.com') {
        setFormErrors({ email: 'Email sudah terdaftar' });
        showErrorAnimation('email');
        triggerErrorShake(); // Trigger shake animation
        return;
      }
      
      // Other errors
      triggerErrorShake(); // Trigger shake animation
      Alert.alert('Error', 'Registrasi gagal. Silakan coba lagi.');
      
    } finally {
      setLoading(false);
    }
  };

  // Clear error with animation
  const clearError = (field: string) => {
    if (formErrors[field]) {
      hideErrorAnimation(field);
      
      Animated.timing(formFadeAnim, {
        toValue: 0.5,
        duration: 150,
        useNativeDriver: true,
      }).start(() => {
        setFormErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[field];
          return newErrors;
        });
        
        Animated.timing(formFadeAnim, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }).start();
      });
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#007AFF" barStyle="light-content" />
      
      {/* Success Toast */}
      <SuccessToast
        message="Registrasi berhasil! Mengarahkan ke OTP..."
        visible={showSuccess}
        onHide={() => setShowSuccess(false)}
      />
      
      {/* Loading Overlay */}
      <LoadingOverlay 
        visible={loading} 
        message="Mendaftarkan akun Anda..." 
      />
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        <ScrollView 
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* HEADER WITH BACK BUTTON - ANIMATED */}
          <Animated.View 
            style={[
              styles.header,
              { transform: [{ translateY: headerSlideAnim }] }
            ]}
          >
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => navigation.goBack()}
              disabled={loading}
            >
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
            
            <View style={styles.headerContent}>
              <Ionicons name="person-add-outline" size={50} color="#fff" />
              <Text style={styles.headerTitle}>Daftar Akun Baru</Text>
              <Text style={styles.headerSubtitle}>Mulai kelola keuangan Anda</Text>
            </View>
          </Animated.View>

          {/* FORM - ANIMATED */}
          <Animated.View 
            style={[
              styles.formContainer,
              {
                opacity: formFadeAnim,
                transform: [
                  { translateY: formSlideAnim },
                  { translateX: errorShakeAnim }
                ]
              }
            ]}
          >
            <Formik
              initialValues={{ fullName: '', email: '', password: '' }}
              validationSchema={registerSchema}
              onSubmit={handleRegister}
            >
              {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                <>
                  {/* NAMA LENGKAP */}
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Nama Lengkap</Text>
                    <View style={[
                      styles.inputContainer,
                      (formErrors.fullName || (errors.fullName && touched.fullName)) && styles.inputContainerError
                    ]}>
                      <Ionicons
                        name="person-outline" 
                        size={20} 
                        color={(formErrors.fullName || errors.fullName) ? "#FF3B30" : "#999"} 
                        style={styles.inputIcon}
                      />
                      <TextInput
                        style={styles.input}
                        placeholder="Nama lengkap Anda"
                        placeholderTextColor="#999"
                        value={values.fullName}
                        onChangeText={(text) => {
                          handleChange('fullName')(text);
                          clearError('fullName');
                        }}
                        onBlur={handleBlur('fullName')}
                        autoCapitalize="words"
                        editable={!loading}
                      />
                    </View>
                    {(formErrors.fullName || (errors.fullName && touched.fullName)) && (
                      <Animated.View 
                        style={[
                          styles.errorContainer,
                          {
                            opacity: nameErrorAnim,
                            transform: [{
                              translateY: nameErrorAnim.interpolate({
                                inputRange: [0, 1],
                                outputRange: [10, 0]
                              })
                            }]
                          }
                        ]}
                      >
                        <Ionicons name="alert-circle" size={14} color="#FF3B30" />
                        <Text style={styles.errorText}>
                          {formErrors.fullName || errors.fullName}
                        </Text>
                      </Animated.View>
                    )}
                  </View>

                  {/* EMAIL */}
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Email</Text>
                    <View style={[
                      styles.inputContainer,
                      (formErrors.email || (errors.email && touched.email)) && styles.inputContainerError
                    ]}>
                      <Ionicons
                        name="mail-outline" 
                        size={20} 
                        color={(formErrors.email || errors.email) ? "#FF3B30" : "#999"} 
                        style={styles.inputIcon}
                      />
                      <TextInput
                        style={styles.input}
                        placeholder="email@example.com"
                        placeholderTextColor="#999"
                        value={values.email}
                        onChangeText={(text) => {
                          handleChange('email')(text);
                          clearError('email');
                        }}
                        onBlur={handleBlur('email')}
                        autoCapitalize="none"
                        keyboardType="email-address"
                        editable={!loading}
                      />
                    </View>
                    {(formErrors.email || (errors.email && touched.email)) && (
                      <Animated.View 
                        style={[
                          styles.errorContainer,
                          {
                            opacity: emailErrorAnim,
                            transform: [{
                              translateY: emailErrorAnim.interpolate({
                                inputRange: [0, 1],
                                outputRange: [10, 0]
                              })
                            }]
                          }
                        ]}
                      >
                        <Ionicons name="alert-circle" size={14} color="#FF3B30" />
                        <Text style={styles.errorText}>
                          {formErrors.email || errors.email}
                        </Text>
                      </Animated.View>
                    )}
                  </View>

                  {/* PASSWORD */}
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Password</Text>
                    <View style={[
                      styles.inputContainer,
                      (formErrors.password || (errors.password && touched.password)) && styles.inputContainerError
                    ]}>
                      <Ionicons
                        name="lock-closed-outline" 
                        size={20} 
                        color={(formErrors.password || errors.password) ? "#FF3B30" : "#999"} 
                        style={styles.inputIcon}
                      />
                      <TextInput
                        style={styles.input}
                        placeholder="Minimal 6 karakter"
                        placeholderTextColor="#999"
                        value={values.password}
                        onChangeText={(text) => {
                          handleChange('password')(text);
                          clearError('password');
                        }}
                        onBlur={handleBlur('password')}
                        secureTextEntry={!showPassword}
                        editable={!loading}
                      />
                      <TouchableOpacity
                        style={styles.eyeIcon}
                        onPress={() => setShowPassword(!showPassword)}
                        disabled={loading}
                      >
                        <Ionicons
                          name={showPassword ? "eye-outline" : "eye-off-outline"}
                          size={20}
                          color="#999"
                        />
                      </TouchableOpacity>
                    </View>
                    {(formErrors.password || (errors.password && touched.password)) && (
                      <Animated.View 
                        style={[
                          styles.errorContainer,
                          {
                            opacity: passwordErrorAnim,
                            transform: [{
                              translateY: passwordErrorAnim.interpolate({
                                inputRange: [0, 1],
                                outputRange: [10, 0]
                              })
                            }]
                          }
                        ]}
                      >
                        <Ionicons name="alert-circle" size={14} color="#FF3B30" />
                        <Text style={styles.errorText}>
                          {formErrors.password || errors.password}
                        </Text>
                      </Animated.View>
                    )}
                  </View>

                  {/* TERMS & CONDITIONS */}
                  <Animated.View 
                    style={[
                      styles.termsContainer,
                      { opacity: termsFadeAnim }
                    ]}
                  >
                    <Text style={styles.termsText}>
                      Dengan mendaftar, Anda menyetujui{' '}
                      <Text style={styles.termsLink}>Syarat & Ketentuan</Text>{' '}
                      dan{' '}
                      <Text style={styles.termsLink}>Kebijakan Privasi</Text>
                    </Text>
                  </Animated.View>

                  {/* REGISTER BUTTON - ANIMATED */}
                  <Animated.View
                    style={{ transform: [{ scale: buttonScaleAnim }] }}
                  >
                    <AnimatedButton
                      title="Daftar Sekarang"
                      onPress={handleSubmit}
                      loading={loading}
                      type="primary"
                      icon={<Ionicons name="person-add-outline" size={20} color="#fff" />}
                      style={styles.button}
                      disabled={loading}
                    />
                  </Animated.View>
                </>
              )}
            </Formik>

            {/* LOGIN LINK */}
            <Animated.View 
              style={[
                styles.loginContainer,
                { opacity: loginFadeAnim }
              ]}
            >
              <Text style={styles.loginText}>Sudah punya akun? </Text>
              <TouchableOpacity 
                onPress={() => navigation.navigate('Login', {})}
                disabled={loading}
              >
                <Text style={styles.loginLink}>Login sekarang</Text>
              </TouchableOpacity>
            </Animated.View>

          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

// Styles tetap sama...
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  keyboardAvoid: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
  },
  header: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },
  backButton: {
    position: 'absolute',
    top: 60,
    left: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContent: {
    alignItems: 'center',
    marginTop: 20,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 5,
  },
  headerSubtitle: {
    color: '#fff',
    fontSize: 14,
    opacity: 0.9,
  },
  formContainer: {
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 30,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  inputContainerError: {
    borderColor: '#FF3B30',
  },
  inputIcon: {
    marginLeft: 12,
  },
  input: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 14,
    fontSize: 16,
    color: '#333',
  },
  eyeIcon: {
    paddingHorizontal: 12,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 12,
    marginLeft: 4,
  },
  termsContainer: {
    marginBottom: 25,
    paddingHorizontal: 8,
  },
  termsText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    lineHeight: 18,
  },
  termsLink: {
    color: '#007AFF',
    fontWeight: '500',
  },
  button: {
    marginBottom: 20,
  },
  buttonDisabled: {
    backgroundColor: '#6c757d',
    opacity: 0.7,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  loginText: {
    color: '#666',
    fontSize: 14,
  },
  loginLink: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '600',
  },
  demoContainer: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 16,
    marginTop: 30,
    borderWidth: 1,
    borderColor: '#eaeaea',
  },
  demoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#495057',
    marginBottom: 8,
  },
  demoText: {
    fontSize: 12,
    color: '#6c757d',
    marginBottom: 4,
    lineHeight: 16,
  },
});

export default RegisterScreen;