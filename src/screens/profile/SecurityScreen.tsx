import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import Ionicons from '@react-native-vector-icons/ionicons';
import ScreenHeader from '../../components/layout/ScreenHeader';

type SecurityStackParamList = {
  Security: undefined;
  ChangePassword: undefined;
};

type SecurityScreenNavigationProp = StackNavigationProp<SecurityStackParamList, 'Security'>;

interface Props {
  navigation: SecurityScreenNavigationProp;
}

const SecurityScreen: React.FC<Props> = ({ navigation }) => {
  const [securitySettings, setSecuritySettings] = useState({
    biometricLogin: true,
    twoFactorAuth: false,
    loginAlerts: true,
    autoLogout: false,
  });

  const [showBiometricModal, setShowBiometricModal] = useState(false);
  const [showTwoFactorModal, setShowTwoFactorModal] = useState(false);

  const handleBiometricToggle = () => {
    setShowBiometricModal(true);
  };

  const handleTwoFactorToggle = () => {
    if (!securitySettings.twoFactorAuth) {
      setShowTwoFactorModal(true);
    } else {
      // Show confirmation for disabling
      Alert.alert(
        'Nonaktifkan 2FA?',
        'Apakah Anda yakin ingin menonaktifkan Two-Factor Authentication?',
        [
          { text: 'Batal', style: 'cancel' },
          {
            text: 'Nonaktifkan',
            style: 'destructive',
            onPress: () => {
              setSecuritySettings(prev => ({ ...prev, twoFactorAuth: false }));
              Alert.alert('Success', '2FA berhasil dinonaktifkan');
            },
          },
        ]
      );
    }
  };

  const handleToggleSetting = (setting: keyof typeof securitySettings) => {
    setSecuritySettings(prev => ({
      ...prev,
      [setting]: !prev[setting],
    }));
  };

  const handleConfirmBiometric = () => {
    setSecuritySettings(prev => ({
      ...prev,
      biometricLogin: !prev.biometricLogin,
    }));
    setShowBiometricModal(false);
    
    const newStatus = !securitySettings.biometricLogin;
    Alert.alert(
      'Success',
      `Login biometric ${newStatus ? 'diaktifkan' : 'dinonaktifkan'}`
    );
  };

  const handleSetupTwoFactor = () => {
    // Simulate 2FA setup
    Alert.alert(
      'Setup 2FA',
      'Instruksi setup 2FA telah dikirim ke email Anda',
      [
        { text: 'OK', onPress: () => {
          setSecuritySettings(prev => ({ ...prev, twoFactorAuth: true }));
          setShowTwoFactorModal(false);
        }},
      ]
    );
  };

  const handleChangePassword = () => {
    navigation.navigate('ChangePassword');
  };

  return (
    <View style={styles.container}>
      <ScreenHeader
        title="Keamanan"
        showBackButton
        onBackPress={() => navigation.goBack()}
      />

      <ScrollView contentContainerStyle={styles.content}>
        
        {/* Security Features */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Fitur Keamanan</Text>
          
        {/* Change Password */}
         <View style={styles.section}>
          <Text style={styles.sectionTitle}>Password</Text>
          
          <TouchableOpacity 
            style={styles.securityItem}
            onPress={handleChangePassword}
          >
            <View style={styles.securityItemLeft}>
              <Ionicons name="lock-closed" size={22} color="#007bff" />
              <View style={styles.securityItemInfo}>
                <Text style={styles.securityItemTitle}>Ubah Password</Text>
                <Text style={styles.securityItemDescription}>
                  Ubah password akun Anda
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>
        </View>

        </View>

        {/* Security Info */}
        <View style={styles.infoBox}>
          <Ionicons name="shield-checkmark" size={24} color="#28a745" />
          <View style={styles.infoContent}>
            <Text style={styles.infoTitle}>Keamanan Aktif</Text>
            <Text style={styles.infoText}>
              Akun Anda saat ini terlindungi dengan enkripsi end-to-end.
              Pastikan untuk tidak membagikan password Anda kepada siapapun.
            </Text>
          </View>
        </View>

        {/* Last Login */}
        <View style={styles.lastLoginCard}>
          <Text style={styles.lastLoginTitle}>Login Terakhir</Text>
          <View style={styles.lastLoginInfo}>
            <Ionicons name="time" size={16} color="#666" />
            <Text style={styles.lastLoginText}>
              16 Januari 2026, 14:30
            </Text>
          </View>
          <View style={styles.lastLoginInfo}>
            <Ionicons name="location" size={16} color="#666" />
            <Text style={styles.lastLoginText}>
              Jakarta, Indonesia (IP: 192.168.1.1)
            </Text>
          </View>
          <View style={styles.lastLoginInfo}>
            <Ionicons name="phone-portrait" size={16} color="#666" />
            <Text style={styles.lastLoginText}>
              Android Mobile
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Biometric Modal */}
      <Modal
        visible={showBiometricModal}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Ionicons name="finger-print" size={32} color="#007bff" />
              <Text style={styles.modalTitle}>
                {securitySettings.biometricLogin ? 'Nonaktifkan' : 'Aktifkan'} Login Biometric
              </Text>
            </View>
            
            <Text style={styles.modalText}>
              {securitySettings.biometricLogin 
                ? 'Apakah Anda yakin ingin menonaktifkan login biometric?'
                : 'Gunakan fingerprint atau face ID untuk login yang lebih cepat dan aman.'
              }
            </Text>
            
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={styles.modalCancelButton}
                onPress={() => setShowBiometricModal(false)}
              >
                <Text style={styles.modalCancelButtonText}>Batal</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.modalConfirmButton}
                onPress={handleConfirmBiometric}
              >
                <Text style={styles.modalConfirmButtonText}>
                  {securitySettings.biometricLogin ? 'Nonaktifkan' : 'Aktifkan'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Two-Factor Modal */}
      <Modal
        visible={showTwoFactorModal}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Ionicons name="shield-checkmark" size={32} color="#007bff" />
              <Text style={styles.modalTitle}>Setup Two-Factor Authentication</Text>
            </View>
            
            <Text style={styles.modalText}>
              Two-Factor Authentication (2FA) menambahkan lapisan keamanan ekstra.
              Anda akan memerlukan kode dari aplikasi authenticator selain password.
            </Text>
            
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={styles.modalCancelButton}
                onPress={() => setShowTwoFactorModal(false)}
              >
                <Text style={styles.modalCancelButtonText}>Nanti Saja</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.modalConfirmButton}
                onPress={handleSetupTwoFactor}
              >
                <Text style={styles.modalConfirmButtonText}>Setup Sekarang</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    paddingTop: 50
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  securityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  securityItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  securityItemInfo: {
    marginLeft: 12,
    flex: 1,
  },
  securityItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 2,
  },
  securityItemDescription: {
    fontSize: 12,
    color: '#666',
  },
  toggle: {
    width: 50,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    padding: 2,
  },
  toggleOn: {
    backgroundColor: '#28a745',
  },
  toggleOff: {
    backgroundColor: '#ddd',
  },
  toggleCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#fff',
  },
  toggleCircleOn: {
    alignSelf: 'flex-end',
  },
  toggleCircleOff: {
    alignSelf: 'flex-start',
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#e7f3ff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    gap: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0066cc',
    marginBottom: 4,
  },
  infoText: {
    fontSize: 14,
    color: '#0066cc',
    lineHeight: 20,
  },
  lastLoginCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  lastLoginTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 12,
  },
  lastLoginInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  lastLoginText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginTop: 12,
    textAlign: 'center',
  },
  modalText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalCancelButton: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  modalCancelButtonText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '600',
  },
  modalConfirmButton: {
    flex: 1,
    backgroundColor: '#007bff',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  modalConfirmButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
});

export default SecurityScreen;