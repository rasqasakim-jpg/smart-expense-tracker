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
  SafeAreaView,
} from 'react-native';
import { Formik } from 'formik';
import { loginSchema } from '../../utils/validation';
import { authAPI, setDevApiBase } from '../../services/api';
import { AuthStackParamList } from '../../navigation/AuthNavigation';
import Ionicons from '@react-native-vector-icons/ionicons';
import { LoginRequest } from '../../types/auth';
import { StackNavigationProp } from '@react-navigation/stack';
import { useAuth } from '../../context/AuthContext';
import { useEffect, useState } from 'react';

type LoginScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Login'>;

interface Props {
  navigation: LoginScreenNavigationProp;
}

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const [loading, setLoading] = useState(false);

  const { signIn } = useAuth();

  const handleLogin = async (values: LoginRequest) => {
    try {
      setLoading(true);
      const response = await authAPI.login(values);
      console.log('Login success:', response);

      // response is { success, message, data }
      const token = response?.data?.accessToken || response?.data?.tokens?.accessToken;
      if (token) {
        await signIn(token);
        Alert.alert('Success', 'Login berhasil!');
        // navigation handled by AuthProvider/App root switch
        return;
      }

      Alert.alert('Error', 'Token not returned from server');
    } catch (error: any) {
      console.log('Login error:', error);

      const errorMessage = 
        error?.errors?.[Object.keys(error.errors || {})[0]]?.[0] ||
        error?.message ||
        'Login gagal, coba lagi';

      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const [devBase, setDevBase] = useState<string>('');

  useEffect(() => {
    let mounted = true;
    // Load current override if any
    (async () => {
      try {
        const v = await (await import('@react-native-async-storage/async-storage')).default.getItem('DEV_API_BASE');
        if (mounted && v) setDevBase(v);
      } catch (e) {
        // ignore
      }
    })();
    return () => { mounted = false; };
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#007AFF" barStyle="light-content" />
      
      {/* HEADER DENGAN BACKGROUND BIRU */}
      <View style={styles.header}>
        <Ionicons style={styles.headerIcon} name='wallet' size={50} color='#fff' />
        <Text style={styles.headerTitle}>Smart Expense</Text>
        <Text style={styles.title}>Masuk ke akun Anda</Text>
      </View>

      <ScrollView 
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <Formik
          initialValues={{ email: '', password: '' }}
          validationSchema={loginSchema}
          onSubmit={handleLogin}
        >
          {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
            <View style={styles.form}>
              {/* EMAIL INPUT */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                  style={[
                    styles.input, 
                    errors.email && touched.email && styles.inputError
                  ]}
                  placeholder="email@example.com"
                  placeholderTextColor="#999"
                  value={values.email}
                  onChangeText={handleChange('email')}
                  onBlur={handleBlur('email')}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  autoCorrect={false}
                />
                {errors.email && touched.email && (
                  <Text style={styles.errorText}>{errors.email}</Text>
                )}
              </View>

              {/* PASSWORD INPUT */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Password</Text>
                <TextInput
                  style={[
                    styles.input, 
                    errors.password && touched.password && styles.inputError
                  ]}
                  placeholder="......"
                  placeholderTextColor="#999"
                  value={values.password}
                  onChangeText={handleChange('password')}
                  onBlur={handleBlur('password')}
                  secureTextEntry
                  autoCorrect={false}
                />
                {errors.password && touched.password && (
                  <Text style={styles.errorText}>{errors.password}</Text>
                )}
              </View>

              {/* FORGOT PASSWORD LINK */}
              <TouchableOpacity 
                style={styles.forgotPasswordContainer}
                onPress={() => navigation.navigate('ForgotPassword')}
              >
                <Text style={styles.forgotPasswordText}>Lupa password?</Text>
              </TouchableOpacity>

              {/* LOGIN BUTTON */}
              <TouchableOpacity
                style={[styles.loginButton, loading && styles.buttonDisabled]}
                onPress={() => handleSubmit()}
                disabled={loading}
                activeOpacity={0.8}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text style={styles.loginButtonText}>Masuk</Text>
                )}
              </TouchableOpacity>
            </View>
          )}
        </Formik>

        {/* SIGN UP LINK */}
        <View style={styles.signupContainer}>
          <Text style={styles.signupText}>Belum punya akun? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={styles.signupLink}>Daftar sekarang</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  // HEADER STYLES
  header: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 80,
    width: '100%',
  },
  headerIcon: {
    top: 70
  },
  headerTitle: {
    color: '#fff',
    fontSize: 30,
    fontWeight: '600',
    textAlign: 'left',
    top: 25,
    left: 60
  },
  // MAIN CONTAINER
  container: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 30,
  },
  // TITLE SECTION
  titleSection: {
    marginBottom: 30,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: '#ffffffff',
    top: 45,
    textAlign: 'left',
  },
  // FORM STYLES
  form: {
    width: '100%',
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    backgroundColor: '#fff',
    color: '#333',
  },
  inputError: {
    borderColor: '#FF3B30',
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 14,
    marginTop: 6,
  },
  // FORGOT PASSWORD
  forgotPasswordContainer: {
    alignSelf: 'flex-start',
    marginBottom: 30,
  },
  forgotPasswordText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '500',
  },
  // LOGIN BUTTON
  loginButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
  },
  buttonDisabled: {
    backgroundColor: '#8E8E93',
    opacity: 0.7,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  // SIGN UP SECTION
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 'auto',
    paddingTop: 20,
    bottom: 100
  },
  signupText: {
    color: '#666',
    fontSize: 16,
  },
  signupLink: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default LoginScreen;