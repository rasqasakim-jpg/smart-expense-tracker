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
} from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../../navigation/AuthNavigation';
import Ionicons from '@react-native-vector-icons/ionicons';

type ForgotPasswordScreenNavigationProp = StackNavigationProp<
  AuthStackParamList,
  'ForgotPassword'
>;

interface Props {
  navigation: ForgotPasswordScreenNavigationProp;
}

const forgotPasswordSchema = Yup.object().shape({
  email: Yup.string()
    .email('Email tidak valid')
    .required('Email harus diisi'),
});

const ForgotPasswordScreen: React.FC<Props> = ({ navigation }) => {
  const [loading, setLoading] = useState(false);

  const handleForgotPassword = async (values: { email: string }) => {
    try {
      setLoading(true);
      // TODO: Integrasi API forgot password
      console.log('Request reset password untuk:', values.email);
      
      // Simulasi API call
      await new Promise(resolve => setTimeout(() => resolve(undefined), 1500));
      
      Alert.alert(
        'Email Terkirim',
        'Instruksi reset password telah dikirim ke email Anda',
        [{ text: 'OK', onPress: () => navigation.navigate('Login', {onLoginSuccess: undefined}) }]
      );
    } catch (error) {
      Alert.alert('Error', 'Gagal mengirim email reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#007AFF" barStyle="light-content" />
      
      {/* HEADER DENGAN BACK BUTTON */}
      <View style={styles.header}>
        {/* Back Button */}
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={28} color="#fff" />
        </TouchableOpacity>
        
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Lupa Password</Text>
          <Text style={styles.headerSubtitle}>Masukkan email Anda untuk reset password</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <Formik
          initialValues={{ email: '' }}
          validationSchema={forgotPasswordSchema}
          onSubmit={handleForgotPassword}
        >
          {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
            <View style={styles.form}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Email</Text>
                <View style={[
                  styles.inputContainer,
                  errors.email && touched.email ? styles.inputContainerError : null
                ]}>
                  <Ionicons
                    name='mail-outline'
                    size={20}
                    color='#6b6b6b'
                    style={styles.inputIcon}
                  />
                <TextInput
                  style={[styles.input, errors.email && touched.email ? styles.inputError : null]}
                  placeholder="email@example.com"
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
              
              <Text style={styles.infoText}>
                Kami akan mengirimkan link reset password ke email Anda
              </Text>

              <TouchableOpacity
                style={[styles.button, loading && styles.buttonDisabled]}
                onPress={() => handleSubmit()}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Kirim Instruksi Reset</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.backToLoginButton}
                onPress={() => navigation.navigate('Login', {onLoginSuccess: undefined})}
              >
                <Text style={styles.backToLoginText}>Kembali ke Login</Text>
              </TouchableOpacity>
            </View>
          )}
        </Formik>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingTop: 60, // Kurangi padding atas untuk memberi ruang back button
    paddingBottom: 30,
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    top: 60, // Sesuaikan dengan paddingTop header
    left: 20,
    zIndex: 10,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContent: {
    marginTop: 30, // Beri ruang untuk back button
  },
  headerTitle: {
    color: '#fff',
    fontSize: 25,
    fontWeight: '600',
    textAlign: 'left',
    top: 25
  },
  headerSubtitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#ffffffff',
    marginTop: 8,
    textAlign: 'left',
    top: 23
  },
  container: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 30,
  },
  form: {
    width: '100%',
  },
  inputGroup: {
    marginBottom: 25,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  inputContainer: {
     flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#ffffff',
    paddingHorizontal: 12,
    paddingVertical: 10
  },
   inputContainerError: {
    borderColor: '#dc3545',
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
  },
  inputError: {
    borderColor: '#dc3545',
  },
  errorText: {
    color: '#dc3545',
    fontSize: 12,
    marginTop: 4,
  },
  infoText: {
    fontSize: 13,
    marginTop: -10,
    marginBottom: 25,
    color: '#6b6b6b',
  },
  button: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonDisabled: {
    backgroundColor: '#6c757d',
  },
  buttonText: {
    color: '#ffffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  backToLoginButton: {
    padding: 12,
    alignItems: 'center',
  },
  backToLoginText: {
    color: '#6c757d',
    fontSize: 14,
  },
});

export default ForgotPasswordScreen;