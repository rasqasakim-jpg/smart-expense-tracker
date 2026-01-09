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
        [{ text: 'OK', onPress: () => navigation.navigate('Login') }]
      );
    } catch (error) {
      Alert.alert('Error', 'Gagal mengirim email reset password', [{ text: error instanceof Error ? error.message : 'Unknown error' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#007AFF" barStyle="light-content" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Lupa Password</Text>
        <Text style={styles.headerSubtitle}>Masukkan email Anda untuk reset password</Text>
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
              <TextInput
                style={[styles.input, errors.email && touched.email ? styles.inputError : null]}
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
            <Text style={{fontSize: 13, bottom: 18, color: '#6b6b6bff'}}>
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
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.backButtonText}>Kembali ke Login</Text>
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
    paddingVertical: 80,
    width: '100%',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 25,
    fontWeight: '600',
    textAlign: 'left',
    top: 35,
  },
  headerSubtitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#ffffffff',
    top: 50,
    textAlign: 'left',
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
  backButton: {
    padding: 12,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#6c757d',
    fontSize: 14,
  },
});

export default ForgotPasswordScreen;