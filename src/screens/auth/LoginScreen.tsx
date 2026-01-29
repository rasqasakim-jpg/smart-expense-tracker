import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  ScrollView,
  StatusBar,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Animated,
} from 'react-native';
import { Formik } from 'formik';
import { loginSchema } from '../../utils/validation';
import { LoginRequest } from '../../types/auth';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { AuthStackParamList } from '../../navigation/AuthNavigator';
import Ionicons from '@react-native-vector-icons/ionicons';
import { colors, typography, spacing, borderRadius, shadows } from '../../styles/designSystem';

// Import components animation yang sudah dibuat
import SuccessToast from '../../components/common/SuccesToast';
import LoadingOverlay from '../../components/common/LoadingOverlay';
import AnimatedButton from '../../components/common/AnimatedButton';

type LoginScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Login'>;
type LoginScreenRouteProp = RouteProp<AuthStackParamList, 'Login'>;

interface Props {
  navigation: LoginScreenNavigationProp;
  route: LoginScreenRouteProp;
  onLoginSuccess?: () => void;
}

const LoginScreen: React.FC<Props> = ({ navigation, route, onLoginSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  
  // Animation values
  const headerSlideAnim = useRef(new Animated.Value(-100)).current;
  const formFadeAnim = useRef(new Animated.Value(0)).current;
  const formSlideAnim = useRef(new Animated.Value(50)).current;
  const buttonScaleAnim = useRef(new Animated.Value(1)).current;
  const emailErrorAnim = useRef(new Animated.Value(0)).current;
  const passwordErrorAnim = useRef(new Animated.Value(0)).current;

  // Animasi saat screen pertama load
  useEffect(() => {
    // Header slide in dari atas
    Animated.spring(headerSlideAnim, {
      toValue: 0,
      friction: 8,
      tension: 40,
      useNativeDriver: true,
    }).start();

    // Form fade in dengan delay
    Animated.parallel([
      Animated.timing(formFadeAnim, {
        toValue: 1,
        duration: 500,
        delay: 300,
        useNativeDriver: true,
      }),
      Animated.spring(formSlideAnim, {
        toValue: 0,
        friction: 8,
        tension: 40,
        delay: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Handle success message dari OTP verification atau route params
  useEffect(() => {
    if (route.params?.message) {
      setSuccessMessage(route.params.message);
      setShowSuccessToast(true);
      
      // Auto hide toast setelah 3 detik
      const timer = setTimeout(() => {
        setShowSuccessToast(false);
      }, 3000);
      
      // Clear params setelah ditampilkan
      navigation.setParams({ message: undefined });
      return () => clearTimeout(timer);
    }
  }, [route.params?.message, navigation]);

  // Animate error messages when they appear
  useEffect(() => {
    if (formErrors.email) {
      Animated.timing(emailErrorAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      emailErrorAnim.setValue(0);
    }
  }, [formErrors.email]);

  useEffect(() => {
    if (formErrors.password) {
      Animated.timing(passwordErrorAnim, {
        toValue: 1,
        duration: 300,
        delay: 50,
        useNativeDriver: true,
      }).start();
    } else {
      passwordErrorAnim.setValue(0);
    }
  }, [formErrors.password]);

  const handleLogin = async (values: LoginRequest) => {
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
      await loginSchema.validate(values, { abortEarly: false });
      
      // Simulasi API call
      await new Promise<void>(resolve => setTimeout(resolve, 1500));
      
      // Stop loading animation
      buttonScaleAnim.stopAnimation();
      Animated.timing(buttonScaleAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
      
      // Demo credentials untuk testing
      if (values.email === 'demo@test.com' && values.password === 'demo123') {
        // Success toast
        setSuccessMessage('Login berhasil! Selamat datang.');
        setShowSuccessToast(true);
        
        // Navigate setelah 1.5 detik
        setTimeout(() => {
          if (onLoginSuccess) {
            onLoginSuccess();
          }
        }, 1500);
        
      } else if (values.email === 'error@test.com') {
        // Simulate API validation error
        throw {
          success: false,
          message: 'Validation failed',
          errors: {
            email: ['Email tidak terdaftar'],
            password: ['Password salah'],
          },
        };
      } else {
        // Default success
        setSuccessMessage('Login berhasil!');
        setShowSuccessToast(true);
        
        setTimeout(() => {
          if (onLoginSuccess) {
            onLoginSuccess();
          }
        }, 1500);
      }
      
    } catch (error: any) {
      console.log('Login error:', error);
      
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
        });
        setFormErrors(errors);
        
        // Shake animation untuk form error
        Animated.sequence([
          Animated.timing(formSlideAnim, {
            toValue: 10,
            duration: 50,
            useNativeDriver: true,
          }),
          Animated.timing(formSlideAnim, {
            toValue: -10,
            duration: 50,
            useNativeDriver: true,
          }),
          Animated.timing(formSlideAnim, {
            toValue: 0,
            duration: 50,
            useNativeDriver: true,
          }),
        ]).start();
        
        return;
      }
      
      // Handle API validation errors (422)
      if (error?.errors) {
        const errors: Record<string, string> = {};
        Object.keys(error.errors).forEach(key => {
          errors[key] = error.errors[key][0];
        });
        setFormErrors(errors);
        
        // Shake animation
        Animated.sequence([
          Animated.timing(formSlideAnim, {
            toValue: 10,
            duration: 50,
            useNativeDriver: true,
          }),
          Animated.timing(formSlideAnim, {
            toValue: -10,
            duration: 50,
            useNativeDriver: true,
          }),
          Animated.timing(formSlideAnim, {
            toValue: 0,
            duration: 50,
            useNativeDriver: true,
          }),
        ]).start();
        
        return;
      }
      
      // Handle other errors
      Alert.alert(
        'Login Gagal',
        error?.message || 'Email atau password salah. Coba lagi.',
        [{ text: 'OK' }]
      );
      
    } finally {
      setLoading(false);
    }
  };

  // Clear error when user starts typing dengan animation
  const clearError = (field: string) => {
    if (formErrors[field]) {
      // Fade out animation untuk error message
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
        message={successMessage || ''}
        visible={showSuccessToast}
        onHide={() => setShowSuccessToast(false)}
      />
      
      {/* Loading Overlay */}
      <LoadingOverlay 
        visible={loading} 
        message="Memproses login..." 
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
          {/* HEADER dengan animation */}
          <Animated.View 
            style={[
              styles.header,
              { transform: [{ translateY: headerSlideAnim }] }
            ]}
          >
            <Ionicons name="wallet" size={50} color="#fff" />
            <Text style={styles.headerTitle}>Smart Expense Tracker</Text>
            <Text style={styles.subtitle}>Kelola keuangan dengan mudah</Text>
          </Animated.View>

          {/* FORM dengan animation */}
          <Animated.View 
            style={[
              styles.formContainer,
              {
                opacity: formFadeAnim,
                transform: [{ translateY: formSlideAnim }]
              }
            ]}
          >
            <Text style={styles.formTitle}>Masuk ke Akun Anda</Text>
            
            <Formik
              initialValues={{ email: '', password: '' }}
              onSubmit={handleLogin}
            >
              {({ handleChange, handleBlur, handleSubmit, values }) => (
                <>
                  {/* EMAIL */}
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Email</Text>
                    <View style={[
                      styles.inputContainer,
                      formErrors.email && styles.inputContainerError
                    ]}>
                      <Ionicons
                        name="mail-outline" 
                        size={20} 
                        color={formErrors.email ? "#FF3B30" : "#999"} 
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
                    {formErrors.email && (
                      <Animated.View 
                        style={[
                          styles.errorContainer,
                          { 
                            opacity: emailErrorAnim,
                            transform: [{
                              translateY: emailErrorAnim.interpolate({
                                inputRange: [0, 1],
                                outputRange: [-10, 0],
                              })
                            }]
                          }
                        ]}
                      >
                        <Ionicons name="alert-circle" size={14} color="#FF3B30" />
                        <Text style={styles.errorText}>{formErrors.email}</Text>
                      </Animated.View>
                    )}
                  </View>

                  {/* PASSWORD */}
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Password</Text>
                    <View style={[
                      styles.inputContainer,
                      formErrors.password && styles.inputContainerError
                    ]}>
                      <Ionicons
                        name="lock-closed-outline" 
                        size={20} 
                        color={formErrors.password ? "#FF3B30" : "#999"} 
                        style={styles.inputIcon}
                      />
                      <TextInput
                        style={styles.input}
                        placeholder="Masukkan password"
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
                    {formErrors.password && (
                      <Animated.View 
                        style={[
                          styles.errorContainer,
                          { 
                            opacity: passwordErrorAnim,
                            transform: [{
                              translateY: passwordErrorAnim.interpolate({
                                inputRange: [0, 1],
                                outputRange: [-10, 0],
                              })
                            }]
                          }
                        ]}
                      >
                        <Ionicons name="alert-circle" size={14} color="#FF3B30" />
                        <Text style={styles.errorText}>{formErrors.password}</Text>
                      </Animated.View>
                    )}
                  </View>

                  {/* FORGOT PASSWORD */}
                  <TouchableOpacity 
                    style={styles.forgotPassword}
                    onPress={() => navigation.navigate('ForgotPassword')}
                    disabled={loading}
                  >
                    <Text style={styles.forgotPasswordText}>Lupa password?</Text>
                  </TouchableOpacity>

                  {/* LOGIN BUTTON dengan AnimatedButton */}
                  <Animated.View
                    style={{ transform: [{ scale: buttonScaleAnim }] }}
                  >
                    <AnimatedButton
                      title="Masuk ke Aplikasi"
                      onPress={() => handleSubmit()}
                      loading={loading}
                      type="primary"
                      icon={<Ionicons name="log-in-outline" size={20} color="#fff" />}
                      style={styles.button}
                      disabled={loading}
                    />
                  </Animated.View>
                </>
              )}
            </Formik>

            {/* SIGN UP LINK */}
            <View style={styles.signupContainer}>
              <Text style={styles.signupText}>Belum punya akun? </Text>
              <TouchableOpacity 
                onPress={() => navigation.navigate('Register')}
                disabled={loading}
              >
                <Text style={styles.signupLink}>Daftar sekarang</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardAvoid: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
  },
  header: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xxl,
    paddingBottom: spacing.xl,
    alignItems: 'center',
  },
  headerTitle: {
    color: colors.textLight,
    fontSize: typography.h3,
    fontWeight: typography.bold,
    marginTop: spacing.sm,
    marginBottom: spacing.xs,
  },
  subtitle: {
    color: colors.textLight,
    fontSize: typography.body,
    opacity: 0.9,
  },
  formContainer: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.lg,
  },
  formTitle: {
    fontSize: typography.h4,
    fontWeight: typography.semiBold,
    color: colors.textPrimary,
    marginBottom: spacing.xl,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: spacing.lg,
  },
  label: {
    fontSize: typography.body,
    fontWeight: typography.medium,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    backgroundColor: colors.white,
  },
  inputContainerError: {
    borderColor: colors.danger,
  },
  inputIcon: {
    marginLeft: spacing.md,
  },
  input: {
    flex: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    fontSize: typography.h6,
    color: colors.textPrimary,
  },
  eyeIcon: {
    paddingHorizontal: spacing.md,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  errorText: {
    color: colors.danger,
    fontSize: typography.small,
    marginLeft: spacing.xs,
  },
  forgotPassword: {
    alignSelf: 'flex-start',
    marginBottom: spacing.xl,
  },
  forgotPasswordText: {
    color: colors.primary,
    fontSize: typography.body,
    fontWeight: typography.medium,
  },
  button: {
    marginBottom: spacing.lg,
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  signupText: {
    color: colors.textSecondary,
    fontSize: typography.body,
  },
  signupLink: {
    color: colors.primary,
    fontSize: typography.body,
    fontWeight: typography.semiBold,
    marginLeft: spacing.xs,
  },
  demoContainer: {
    backgroundColor: colors.light,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    marginTop: spacing.lg,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  demoTitle: {
    fontSize: typography.body,
    fontWeight: typography.semiBold,
    color: colors.dark,
    marginBottom: spacing.sm,
  },
  demoText: {
    fontSize: typography.small,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
    lineHeight: typography.lineHeightNormal,
  },
});

export default LoginScreen;