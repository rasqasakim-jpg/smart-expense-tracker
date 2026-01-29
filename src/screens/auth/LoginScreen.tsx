import React, { useState, useEffect } from 'react'; // ← TAMBAH useEffect
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
} from 'react-native';
import { Formik } from 'formik';
import { loginSchema } from '../../utils/validation';
import { LoginRequest } from '../../types/auth';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native'; // ← IMPORT INI
import { AuthStackParamList } from '../../navigation/AuthNavigator';
import Ionicons from '@react-native-vector-icons/ionicons';
import { colors, typography, spacing, borderRadius, shadows } from '../../styles/designSysttem';

type LoginScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Login'>;
type LoginScreenRouteProp = RouteProp<AuthStackParamList, 'Login'>; // ← TAMBAH INI

interface Props {
  navigation: LoginScreenNavigationProp;
  route: LoginScreenRouteProp; // ← TAMBAH INI
  onLoginSuccess?: () => void;
}

const LoginScreen: React.FC<Props> = ({ navigation, route, onLoginSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Handle success message dari OTP verification atau route params
  useEffect(() => {
    if (route.params?.message) {
      setSuccessMessage(route.params.message);
      // Clear params setelah ditampilkan
      navigation.setParams({ message: undefined });
    }
  }, [route.params?.message, navigation]);

  // Tampilkan success message jika ada
  useEffect(() => {
    if (successMessage) {
      Alert.alert('Success', successMessage);
      setSuccessMessage(null);
    }
  }, [successMessage]);

  const handleLogin = async (values: LoginRequest) => {
    try {
      setLoading(true);
      setFormErrors({});
      
      // Validate with Yup
      await loginSchema.validate(values, { abortEarly: false });
      
      // Simulasi API call
      await new Promise<void>(resolve => setTimeout(resolve, 1000));
      
      // Demo credentials untuk testing
      if (values.email === 'demo@test.com' && values.password === 'demo123') {
        Alert.alert(
          'Login Berhasil',
          'Selamat datang di Smart Expense Tracker!',
          [
            {
              text: 'Lanjutkan',
              onPress: () => {
                if (onLoginSuccess) {
                  onLoginSuccess();
                }
              },
            },
          ]
        );
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
        if (onLoginSuccess) {
          onLoginSuccess();
        }
      }
      
    } catch (error: any) {
      console.log('Login error:', error);
      
      // Handle Yup validation errors
      if (error.name === 'ValidationError') {
        const errors: Record<string, string> = {};
        error.inner.forEach((err: any) => {
          errors[err.path] = err.message;
        });
        setFormErrors(errors);
        return;
      }
      
      // Handle API validation errors (422)
      if (error?.errors) {
        const errors: Record<string, string> = {};
        Object.keys(error.errors).forEach(key => {
          errors[key] = error.errors[key][0];
        });
        setFormErrors(errors);
        return;
      }
      
      // Handle network/server errors
      Alert.alert(
        'Login Gagal',
        error?.message || 'Email atau password salah. Coba lagi.',
        [{ text: 'OK' }]
      );
      
    } finally {
      setLoading(false);
    }
  };

  // Clear error when user starts typing
  const clearError = (field: string) => {
    if (formErrors[field]) {
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#007AFF" barStyle="light-content" />
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        <ScrollView 
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* HEADER */}
          <View style={styles.header}>
            <Ionicons name="wallet" size={50} color="#fff" />
            <Text style={styles.headerTitle}>Smart Expense Tracker</Text>
            <Text style={styles.subtitle}>Kelola keuangan dengan mudah</Text>
          </View>

          {/* FORM */}
          <View style={styles.formContainer}>
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
                      <View style={styles.errorContainer}>
                        <Ionicons name="alert-circle" size={14} color="#FF3B30" />
                        <Text style={styles.errorText}>{formErrors.email}</Text>
                      </View>
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
                      <View style={styles.errorContainer}>
                        <Ionicons name="alert-circle" size={14} color="#FF3B30" />
                        <Text style={styles.errorText}>{formErrors.password}</Text>
                      </View>
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

                  {/* LOGIN BUTTON */}
                  <TouchableOpacity
                    style={[styles.button, loading && styles.buttonDisabled]}
                    onPress={() => handleSubmit()}
                    disabled={loading}
                  >
                    {loading ? (
                      <ActivityIndicator color="#fff" />
                    ) : (
                      <>
                        <Ionicons name="log-in-outline" size={20} color="#fff" />
                        <Text style={styles.buttonText}>  Masuk ke Aplikasi</Text>
                      </>
                    )}
                  </TouchableOpacity>
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
          </View>
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
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    alignItems: 'center',
    marginBottom: spacing.lg,
    flexDirection: 'row',
    justifyContent: 'center',
    ...shadows.sm,
  },
  buttonDisabled: {
    backgroundColor: colors.secondary,
    opacity: 0.7,
  },
  buttonText: {
    color: colors.textLight,
    fontSize: typography.h6,
    fontWeight: typography.semiBold,
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