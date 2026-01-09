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
import { RegisterRequest } from '../../types/auth';
import { StackNavigationProp } from '@react-navigation/stack';
import Ionicons from '@react-native-vector-icons/ionicons';

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
      console.log('Register attempt:', values);
      
      // SIMULASI API CALL DULU (Backend Fairuuz belum ready)
      await new Promise<void>(resolve => setTimeout(resolve, 1500));
      
      // SIMULASI RESPONSE BERHASIL
      console.log('Register success!');
      
      Alert.alert(
        'Success', 
        'Registrasi berhasil! Silakan login.',
        [{ text: 'OK', onPress: () => navigation.navigate('Login') }]
      );
      
    } catch (error: any) {
      console.log('Register error:', error);
      Alert.alert('Error', 'Registrasi gagal, coba lagi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* HEADER DENGAN BACK BUTTON */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={28} color="#fff" />
        </TouchableOpacity>
        
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Daftar Akun</Text>
          <Text style={styles.headerSubtitle}>Buat Akun Baru Anda</Text>
        </View>
      </View>

      <View style={styles.content}>
        <Formik
          initialValues={{ fullName: '', email: '', password: '' }}
          validationSchema={registerSchema}
          onSubmit={handleRegister}
        >
          {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
            <View style={styles.form}>
              {/* NAMA LENGKAP */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Nama Lengkap</Text>
                <View style={styles.inputContainer}>
                  <Ionicons
                    name="person-outline" 
                    size={20} 
                    color="#999" 
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={[
                      styles.input, 
                      errors.fullName && touched.fullName && styles.inputError
                    ]}
                    placeholder="Nama Anda"
                    placeholderTextColor="#999"
                    value={values.fullName}
                    onChangeText={handleChange('fullName')}
                    onBlur={handleBlur('fullName')}
                    autoCapitalize="words"
                  />
                </View>
                {errors.fullName && touched.fullName && (
                  <Text style={styles.errorText}>{errors.fullName}</Text>
                )}
              </View>

              {/* EMAIL */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Email</Text>
                <View style={styles.inputContainer}>
                  <Ionicons 
                    name="mail-outline" 
                    size={20} 
                    color="#999" 
                    style={styles.inputIcon}
                  />
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
                  />
                </View>
                {errors.email && touched.email && (
                  <Text style={styles.errorText}>{errors.email}</Text>
                )}
              </View>

              {/* PASSWORD */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Password</Text>
                <View style={styles.inputContainer}>
                  <Ionicons 
                    name="lock-closed-outline" 
                    size={20} 
                    color="#999" 
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={[
                      styles.input, 
                      errors.password && touched.password && styles.inputError
                    ]}
                    placeholder="Minimal 6 karakter"
                    placeholderTextColor="#999"
                    value={values.password}
                    onChangeText={handleChange('password')}
                    onBlur={handleBlur('password')}
                    secureTextEntry
                  />
                </View>
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
                  <>
                    <Ionicons name="person-add" size={20} color="#fff" />
                    <Text style={styles.buttonText}>  Daftar Sekarang</Text>
                  </>
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
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#007bff',
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  backButton: {
    position: 'absolute',
    top: 60,
    left: 20,
    zIndex: 10,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContent: {
    alignItems: 'center',
    marginTop: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#e0e0e0',
  },
  content: {
    padding: 20,
    paddingTop: 30,
  },
  form: {},
  inputGroup: {
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputIcon: {
    position: 'absolute',
    left: 12,
    zIndex: 1,
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
    paddingHorizontal: 40,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#fff',
    flex: 1,
    color: '#333',
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
    backgroundColor: '#007bff',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'center',
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
    marginTop: 20,
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