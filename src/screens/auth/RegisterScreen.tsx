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
} from 'react-native';
import { Formik } from 'formik';
import { registerSchema } from '../../utils/validation';
import { authAPI } from '../../services/api';
import AuthHeader from '../../components/auth/AuthHeader';
import { RegisterRequest } from '../../types/auth';
import { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
  Login: undefined;
  Register: undefined;
};

type RegisterScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Register'>;

interface Props {
  navigation: RegisterScreenNavigationProp;
}

const RegisterScreen: React.FC<Props> = ({ navigation }) => {
  const [loading, setLoading] = useState(false);

  const handleRegister = async (values: RegisterRequest) => {
    try {
      setLoading(true);
      const response = await authAPI.register(values);
      console.log('Register success:', response);
      Alert.alert('Success', 'Registrasi berhasil! Silakan login.');
      navigation.navigate('Login');
    } catch (error: any) {
      console.log('Register error:', error);
      
       if (error?.errors && typeof error.errors === 'object') {
      const errorValues = Object.values(error.errors);
      if (Array.isArray(errorValues) && errorValues.length > 0) {
        const firstErrorArray = errorValues[0];
        if (Array.isArray(firstErrorArray) && firstErrorArray.length > 0) {
          const firstError = firstErrorArray[0];
          Alert.alert('Error', firstError || 'Terjadi kesalahan');
        } else {
          Alert.alert('Error', 'Terjadi kesalahan validasi');
        }
      } else {
        Alert.alert('Error', error.message || 'Registrasi gagal');
      }
    } else if (error?.message) {
      Alert.alert('Error', error.message);
    } else {
      Alert.alert('Error', 'Registrasi gagal, coba lagi');
    }
  } finally {
    setLoading(false);
  }
};

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <AuthHeader
        title="Daftar Akun Baru"
        subtitle="Mulai kelola keuanganmu"
      />

      <Formik
        initialValues={{ fullName: '', email: '', password: '' }}
        validationSchema={registerSchema}
        onSubmit={handleRegister}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nama Lengkap</Text>
              <TextInput
                style={[styles.input, 
                    errors.fullName && touched.fullName ? styles.inputError : null
                ]}
                placeholder="John Doe"
                value={values.fullName}
                onChangeText={handleChange('fullName')}
                onBlur={handleBlur('fullName')}
              />
              {errors.fullName && touched.fullName && (
                <Text style={styles.errorText}>{errors.fullName}</Text>
              )}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={[styles.input, 
                    errors.email && touched.email ? styles.inputError : undefined]}
                placeholder="email@example.com"
                value={values.email}
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
                autoCapitalize="none"
                keyboardType="email-address"
              />
              {errors.email && touched.email && (
                <Text style={styles.errorText}>{errors.email}</Text>
              )}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password</Text>
              <TextInput
                style={[styles.input, 
                    errors.password && touched.password ? styles.inputError : undefined]}
                placeholder="Minimal 6 karakter"
                value={values.password}
                onChangeText={handleChange('password')}
                onBlur={handleBlur('password')}
                secureTextEntry
              />
              {errors.password && touched.password && (
                <Text style={styles.errorText}>{errors.password}</Text>
              )}
            </View>

            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={() => handleSubmit()}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Daftar</Text>
              )}
            </TouchableOpacity>
          </View>
        )}
      </Formik>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Sudah punya akun? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.footerLink}>Login Sekarang</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

// Gunakan styles yang sama dengan LoginScreen (atau duplikat)
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#f8f9fa',
  },
  form: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fafafa',
  },
  inputError: {
    borderColor: '#dc3545',
  },
  errorText: {
    color: '#dc3545',
    fontSize: 12,
    marginTop: 4,
  },
  button: {
    backgroundColor: '#28a745',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  buttonDisabled: {
    backgroundColor: '#6c757d',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 30,
  },
  footerText: {
    color: '#666',
    fontSize: 14,
  },
  footerLink: {
    color: '#007bff',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default RegisterScreen;