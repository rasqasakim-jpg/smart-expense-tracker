import React from 'react';
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
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Formik } from 'formik';
import { loginSchema } from '../../utils/validation';
import { authAPI } from '../../services/api';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../../navigation/AuthNavigation';
import Ionicons from '@react-native-vector-icons/ionicons';
import { useNavigation } from '@react-navigation/native';
import AppContainer from '../../components/layout/AppContainer';
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

type LoginScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Login'>;

interface Props {
  onLoginSuccess?: () => void;
}

export default function LoginScreen({ onLoginSuccess }: Props) {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const auth = useAuth();

  const handleLogin = async (values: LoginRequest) => {
    try {
      setLoading(true);
      setFormErrors({});

      console.log('Login attempt:', values);

      // Validate with Yup
      await loginSchema.validate(values, { abortEarly: false });

      // Call API
      const data = await authAPI.login(values);

      // Save token
      await auth.signIn(data.data.accessToken);

      console.log('Login success!');

      if (onLoginSuccess) {
        onLoginSuccess();
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

      // Handle API errors
      Alert.alert(
        'Login Gagal',
        error?.message || 'Terjadi kesalahan. Coba lagi.',
        [{ text: 'OK' }]
      );

    } finally {
      setLoading(false);
    }
  };

  const [_devBase, setDevBase] = useState<string>('');

  useEffect(() => {
    let mounted = true;
    // Load current override if any
    (async () => {
      try {
        const v = await (await import('@react-native-async-storage/async-storage')).default.getItem('DEV_API_BASE');
        if (mounted && v) setDevBase(v);
      } catch (_) {
        // ignore
      }
    })();
    return () => { mounted = false; };
  }, []);

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
      <AppContainer backgroundColor="#ffffff">
        {/* Keep status bar consistent */}
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
                <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                  <Text style={styles.signupLink}>Daftar sekarang</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </AppContainer>
  );
}

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
    alignItems: 'center',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
  },
  subtitle: {
    color: '#fff',
    fontSize: 14,
    opacity: 0.9,
  },
  formContainer: {
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 30,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 25,
    textAlign: 'center',
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
  forgotPassword: {
    alignSelf: 'flex-start',
    marginBottom: 25,
  },
  forgotPasswordText: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '500',
  },
  button: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#6c757d',
    opacity: 0.7,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  signupText: {
    color: '#666',
    fontSize: 14,
  },
  signupLink: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '600',
  },
});

