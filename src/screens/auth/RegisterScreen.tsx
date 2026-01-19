import React, { useState } from 'react';
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
} from 'react-native';
import { Formik } from 'formik';
import { registerSchema } from '../../utils/validation';
import { RegisterRequest } from '../../types/auth';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../../navigation/AuthNavigator';
import Ionicons from '@react-native-vector-icons/ionicons'; // ← FIX IMPORT

type RegisterScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Register'>;

interface Props {
  navigation: RegisterScreenNavigationProp;
}

const RegisterScreen: React.FC<Props> = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const handleRegister = async (values: RegisterRequest) => {
    try {
      setLoading(true);
      setFormErrors({});
      
      // Validate with Yup
      await registerSchema.validate(values, { abortEarly: false });
      
      console.log('Register attempt:', values);
      
      // SIMULASI API CALL - BERHASIL
      await new Promise<void>(resolve => setTimeout(resolve, 1500));
      
      // Langsung navigasi ke OTP Screen setelah registrasi berhasil
      navigation.navigate('Otp', {
        email: values.email,
        userId: Date.now(), // Mock user ID
      });
      
    } catch (error: any) {
      console.log('Register error:', error);
      
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
      
      // Handle duplicate email error
      if (values.email === 'existing@test.com') {
        setFormErrors({ email: 'Email sudah terdaftar' });
        return;
      }
      
      Alert.alert('Error', 'Registrasi gagal. Silakan coba lagi.');
      
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
          {/* HEADER WITH BACK BUTTON */}
          <View style={styles.header}>
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
          </View>

          {/* FORM */}
          <View style={styles.formContainer}>
            <Formik
              initialValues={{ fullName: '', email: '', password: '' }}
              validationSchema={registerSchema} // ← TAMBAH INI untuk client-side validation
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
                      <View style={styles.errorContainer}>
                        <Ionicons name="alert-circle" size={14} color="#FF3B30" />
                        <Text style={styles.errorText}>
                          {formErrors.fullName || errors.fullName}
                        </Text>
                      </View>
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
                      <View style={styles.errorContainer}>
                        <Ionicons name="alert-circle" size={14} color="#FF3B30" />
                        <Text style={styles.errorText}>
                          {formErrors.email || errors.email}
                        </Text>
                      </View>
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
                      <View style={styles.errorContainer}>
                        <Ionicons name="alert-circle" size={14} color="#FF3B30" />
                        <Text style={styles.errorText}>
                          {formErrors.password || errors.password}
                        </Text>
                      </View>
                    )}
                  </View>

                  {/* TERMS & CONDITIONS */}
                  <View style={styles.termsContainer}>
                    <Text style={styles.termsText}>
                      Dengan mendaftar, Anda menyetujui{' '}
                      <Text style={styles.termsLink}>Syarat & Ketentuan</Text>{' '}
                      dan{' '}
                      <Text style={styles.termsLink}>Kebijakan Privasi</Text>
                    </Text>
                  </View>

                  {/* REGISTER BUTTON - FIXED! */}
                  <TouchableOpacity
                    style={[styles.button, loading && styles.buttonDisabled]}
                    onPress={handleSubmit} // ← INI YANG DIPERBAIKI!
                    disabled={loading}
                  >
                    {loading ? (
                      <ActivityIndicator color="#fff" />
                    ) : (
                      <>
                        <Ionicons name="person-add-outline" size={20} color="#fff" />
                        <Text style={styles.buttonText}>  Daftar Sekarang</Text>
                      </>
                    )}
                  </TouchableOpacity>
                </>
              )}
            </Formik>

            {/* LOGIN LINK */}
            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>Sudah punya akun? </Text>
              <TouchableOpacity 
                onPress={() => navigation.navigate('Login', {})}
                disabled={loading}
              >
                <Text style={styles.loginLink}>Login sekarang</Text>
              </TouchableOpacity>
            </View>

            {/* DEMO CREDENTIALS */}
            <View style={styles.demoContainer}>
              <Text style={styles.demoTitle}>Demo Testing:</Text>
              <Text style={styles.demoText}>• Email: existing@test.com → Error "Email sudah terdaftar"</Text>
              <Text style={styles.demoText}>• Email lain → Success → OTP Screen</Text>
              <Text style={styles.demoText}>• OTP Code: 123456 → Success → Login</Text>
            </View>
          </View>
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