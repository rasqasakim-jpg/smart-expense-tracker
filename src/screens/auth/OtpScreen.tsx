import React, { useState, useEffect } from 'react'; // HAPUS useRef
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import OTPTextInput from 'react-native-otp-textinput';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import Ionicons from '@react-native-vector-icons/ionicons';
import { AuthStackParamList } from '../../navigation/AuthNavigator';
import ScreenHeader from '../../components/layout/ScreenHeader';

type OtpScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Otp'>;
type OtpScreenRouteProp = RouteProp<AuthStackParamList, 'Otp'>;

interface Props {
  navigation: OtpScreenNavigationProp;
  route: OtpScreenRouteProp;
}

const OtpScreen: React.FC<Props> = ({ navigation, route }) => {
  const { email } = route.params;
  
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  // Timer untuk resend OTP
  useEffect(() => {
    let interval: ReturnType<typeof setTimeout>;
    
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
    } else {
      setCanResend(true);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timer]);

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) {
      Alert.alert('Error', 'Masukkan 6 digit kode OTP');
      return;
    }

    try {
      setLoading(true);
      
      // Mock API call untuk OTP verification
      console.log('Verifying OTP:', { email, otp });
      
      await new Promise<void>(resolve => setTimeout(resolve, 1500));
      
      // Simulasi: OTP 123456 adalah success, lainnya error
      if (otp === '123456') {
        Alert.alert(
          'Success',
          'Verifikasi berhasil! Anda akan diarahkan ke halaman login.',
          [
            {
              text: 'OK',
              onPress: () => navigation.navigate('Login', { 
                message: 'Registrasi berhasil! Silakan login.' 
              }),
            },
          ]
        );
      } else {
        throw {
          success: false,
          message: 'Kode OTP salah',
        };
      }
      
    } catch (error: any) {
      console.log('OTP verification error:', error);
      
      // Clear OTP input
      setOtp('');
      
      Alert.alert(
        'Verifikasi Gagal',
        error?.message || 'Kode OTP salah atau telah kadaluarsa',
        [{ text: 'OK' }]
      );
      
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!canResend) return;

    try {
      setResendLoading(true);
      
      // Mock API call untuk resend OTP
      console.log('Resending OTP to:', email);
      
      await new Promise<void>(resolve => setTimeout(resolve, 1000));
      
      // Reset timer
      setTimer(60);
      setCanResend(false);
      
      Alert.alert(
        'OTP Dikirim Ulang',
        'Kode OTP baru telah dikirim ke email Anda.',
        [{ text: 'OK' }]
      );
      
    } catch (error) {
      Alert.alert('Error', 'Gagal mengirim ulang OTP');
    } finally {
      setResendLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScreenHeader
        title="Verifikasi OTP"
        showBackButton
        onBackPress={() => navigation.goBack()}
      />

      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Ionicons name="checkmark-circle-outline" size={80} color="#007bff" />
        </View>

        <Text style={styles.title}>Verifikasi Email</Text>
        
        <Text style={styles.subtitle}>
          Kami telah mengirimkan kode OTP ke:
        </Text>
        
        <Text style={styles.email}>{email}</Text>

        <View style={styles.otpContainer}>
          <OTPTextInput
            inputCount={6}
            handleTextChange={setOtp}
            containerStyle={styles.otpInputContainer}
            textInputStyle={styles.otpInput}
            tintColor="#007bff"
            offTintColor="#ddd"
            autoFocus={true}
          />
        </View>

        <Text style={styles.instruction}>
          Masukkan 6 digit kode yang Anda terima
        </Text>

        <TouchableOpacity
          style={[styles.verifyButton, loading && styles.buttonDisabled]}
          onPress={handleVerifyOtp}
          disabled={loading || otp.length !== 6}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.verifyButtonText}>Verifikasi</Text>
          )}
        </TouchableOpacity>

        <View style={styles.resendContainer}>
          <Text style={styles.resendText}>Tidak menerima kode? </Text>
          
          {canResend ? (
            <TouchableOpacity onPress={handleResendOtp} disabled={resendLoading}>
              <Text style={styles.resendLink}>
                {resendLoading ? 'Mengirim...' : 'Kirim Ulang'}
              </Text>
            </TouchableOpacity>
          ) : (
            <Text style={styles.timerText}>
              Kirim ulang dalam {formatTime(timer)}
            </Text>
          )}
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

// Styles tetap sama...
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    paddingTop: 50
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 8,
  },
  email: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007bff',
    textAlign: 'center',
    marginBottom: 32,
  },
  otpContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  otpInputContainer: {
    marginHorizontal: -4,
  },
  otpInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#fff',
    width: 45,
    height: 55,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  instruction: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginBottom: 32,
  },
  verifyButton: {
    backgroundColor: '#007bff',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginBottom: 24,
  },
  buttonDisabled: {
    backgroundColor: '#6c757d',
  },
  verifyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  resendText: {
    fontSize: 14,
    color: '#666',
  },
  resendLink: {
    fontSize: 14,
    color: '#007bff',
    fontWeight: '600',
  },
  timerText: {
    fontSize: 14,
    color: '#dc3545',
    fontWeight: '500',
  },
  demoContainer: {
    backgroundColor: '#e9ecef',
    borderRadius: 8,
    padding: 16,
    marginTop: 24,
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
    marginBottom: 2,
  },
});

export default OtpScreen;