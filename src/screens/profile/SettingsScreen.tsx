import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  SafeAreaView,
  Alert,
} from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import { StackNavigationProp } from '@react-navigation/stack';
import ScreenHeader from '../../components/layout/ScreenHeader';

// ✅ FIX: Define local param list untuk Settings
type SettingsStackParamList = {
  Settings: undefined;
  ProfileMain: undefined;
};

type SettingsScreenNavigationProp = StackNavigationProp<SettingsStackParamList, 'Settings'>;

interface Props {
  navigation: SettingsScreenNavigationProp;
}

const SettingsScreen: React.FC<Props> = ({ navigation }) => {
  const [settings, setSettings] = useState({
    darkMode: false,
    notifications: true,
    soundEffects: true,
    vibration: true,
    autoSync: true,
    dataSaver: false,
    currency: 'IDR',
    dateFormat: 'DD/MM/YYYY',
    backupEnabled: true,
  });

  const handleToggleSetting = (setting: keyof typeof settings) => {
    if (setting === 'darkMode' || setting === 'currency' || setting === 'dateFormat') {
      // These need special handling
      return;
    }
    
    setSettings(prev => ({
      ...prev,
      [setting]: !prev[setting],
    }));
  };

  const handleDarkModeToggle = () => {
    Alert.alert(
      'Mode Gelap',
      'Fitur mode gelap akan tersedia di versi berikutnya.',
      [{ text: 'OK' }]
    );
  };

  const handleCurrencyChange = () => {
    Alert.alert(
      'Mata Uang',
      'Pilih mata uang:',
      [
        { text: 'IDR - Rupiah', onPress: () => setSettings(prev => ({ ...prev, currency: 'IDR' })) },
        { text: 'USD - Dolar', onPress: () => setSettings(prev => ({ ...prev, currency: 'USD' })) },
        { text: 'Batal', style: 'cancel' },
      ]
    );
  };

  const handleDateFormatChange = () => {
    Alert.alert(
      'Format Tanggal',
      'Pilih format tanggal:',
      [
        { text: 'DD/MM/YYYY', onPress: () => setSettings(prev => ({ ...prev, dateFormat: 'DD/MM/YYYY' })) },
        { text: 'MM/DD/YYYY', onPress: () => setSettings(prev => ({ ...prev, dateFormat: 'MM/DD/YYYY' })) },
        { text: 'YYYY-MM-DD', onPress: () => setSettings(prev => ({ ...prev, dateFormat: 'YYYY-MM-DD' })) },
        { text: 'Batal', style: 'cancel' },
      ]
    );
  };

  const handleClearCache = () => {
    Alert.alert(
      'Hapus Cache',
      'Apakah Anda yakin ingin menghapus cache aplikasi?',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Hapus',
          style: 'destructive',
          onPress: () => {
            Alert.alert('Success', 'Cache berhasil dihapus');
          },
        },
      ]
    );
  };

  const handleResetSettings = () => {
    Alert.alert(
      'Reset Pengaturan',
      'Semua pengaturan akan dikembalikan ke nilai default. Lanjutkan?',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            setSettings({
              darkMode: false,
              notifications: true,
              soundEffects: true,
              vibration: true,
              autoSync: true,
              dataSaver: false,
              currency: 'IDR',
              dateFormat: 'DD/MM/YYYY',
              backupEnabled: true,
            });
            Alert.alert('Success', 'Pengaturan berhasil direset');
          },
        },
      ]
    );
  };

  const handleBackupRestore = () => {
    Alert.alert(
      'Backup & Restore',
      'Pilih aksi:',
      [
        { 
          text: 'Backup Data', 
          onPress: () => Alert.alert('Backup', 'Data berhasil dibackup ke cloud') 
        },
        { 
          text: 'Restore Data', 
          onPress: () => Alert.alert('Restore', 'Pilih file backup untuk restore') 
        },
        { text: 'Batal', style: 'cancel' },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScreenHeader
        title="Pengaturan Aplikasi"
        showBackButton
        onBackPress={() => navigation.goBack()}
      />

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Tampilan */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tampilan</Text>
          
          <TouchableOpacity 
            style={styles.settingItem}
            onPress={handleDarkModeToggle}
          >
            <View style={styles.settingLeft}>
              <Ionicons name="moon-outline" size={22} color="#4A6FA5" />
              <Text style={styles.settingText}>Mode Gelap</Text>
            </View>
            <Switch
              value={settings.darkMode}
              onValueChange={handleDarkModeToggle}
              trackColor={{ false: '#ddd', true: '#007bff' }}
              thumbColor="#fff"
            />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.settingItem}
            onPress={handleCurrencyChange}
          >
            <View style={styles.settingLeft}>
              <Ionicons name="cash-outline" size={22} color="#4A6FA5" />
              <Text style={styles.settingText}>Mata Uang</Text>
            </View>
            <View style={styles.settingRight}>
              <Text style={styles.settingValue}>{settings.currency}</Text>
              <Ionicons name="chevron-forward" size={20} color="#999" />
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.settingItem}
            onPress={handleDateFormatChange}
          >
            <View style={styles.settingLeft}>
              <Ionicons name="calendar-outline" size={22} color="#4A6FA5" />
              <Text style={styles.settingText}>Format Tanggal</Text>
            </View>
            <View style={styles.settingRight}>
              <Text style={styles.settingValue}>{settings.dateFormat}</Text>
              <Ionicons name="chevron-forward" size={20} color="#999" />
            </View>
          </TouchableOpacity>
        </View>

        {/* Notifikasi & Suara */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifikasi & Suara</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Ionicons name="notifications-outline" size={22} color="#4A6FA5" />
              <Text style={styles.settingText}>Notifikasi</Text>
            </View>
            <Switch
              value={settings.notifications}
              onValueChange={() => handleToggleSetting('notifications')}
              trackColor={{ false: '#ddd', true: '#007bff' }}
              thumbColor="#fff"
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Ionicons name="volume-high-outline" size={22} color="#4A6FA5" />
              <Text style={styles.settingText}>Efek Suara</Text>
            </View>
            <Switch
              value={settings.soundEffects}
              onValueChange={() => handleToggleSetting('soundEffects')}
              trackColor={{ false: '#ddd', true: '#007bff' }}
              thumbColor="#fff"
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Ionicons name="phone-portrait-outline" size={22} color="#4A6FA5" />
              <Text style={styles.settingText}>Getar</Text>
            </View>
            <Switch
              value={settings.vibration}
              onValueChange={() => handleToggleSetting('vibration')}
              trackColor={{ false: '#ddd', true: '#007bff' }}
              thumbColor="#fff"
            />
          </View>
        </View>

        {/* Data & Sinkronisasi */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data & Sinkronisasi</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Ionicons name="sync-outline" size={22} color="#4A6FA5" />
              <Text style={styles.settingText}>Sinkronisasi Otomatis</Text>
            </View>
            <Switch
              value={settings.autoSync}
              onValueChange={() => handleToggleSetting('autoSync')}
              trackColor={{ false: '#ddd', true: '#007bff' }}
              thumbColor="#fff"
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Ionicons name="cloud-upload-outline" size={22} color="#4A6FA5" />
              <Text style={styles.settingText}>Backup Otomatis</Text>
            </View>
            <Switch
              value={settings.backupEnabled}
              onValueChange={() => handleToggleSetting('backupEnabled')}
              trackColor={{ false: '#ddd', true: '#007bff' }}
              thumbColor="#fff"
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Ionicons name="save-outline" size={22} color="#4A6FA5" />
              <Text style={styles.settingText}>Hemat Data</Text>
            </View>
            <Switch
              value={settings.dataSaver}
              onValueChange={() => handleToggleSetting('dataSaver')}
              trackColor={{ false: '#ddd', true: '#007bff' }}
              thumbColor="#fff"
            />
          </View>

          <TouchableOpacity 
            style={styles.settingItem}
            onPress={handleBackupRestore}
          >
            <View style={styles.settingLeft}>
              <Ionicons name="cloud-done-outline" size={22} color="#4A6FA5" />
              <Text style={styles.settingText}>Backup & Restore</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>
        </View>

        {/* Maintenance */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pemeliharaan</Text>
          
          <TouchableOpacity 
            style={styles.settingItem}
            onPress={handleClearCache}
          >
            <View style={styles.settingLeft}>
              <Ionicons name="trash-outline" size={22} color="#4A6FA5" />
              <Text style={styles.settingText}>Hapus Cache</Text>
            </View>
            <View style={styles.settingRight}>
              <Text style={styles.cacheSize}>≈ 12.5 MB</Text>
              <Ionicons name="chevron-forward" size={20} color="#999" />
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.settingItem}
            onPress={() => Alert.alert('Export Data', 'Fitur export data ke CSV/Excel')}
          >
            <View style={styles.settingLeft}>
              <Ionicons name="download-outline" size={22} color="#4A6FA5" />
              <Text style={styles.settingText}>Export Data</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.settingItem}
            onPress={handleResetSettings}
          >
            <View style={styles.settingLeft}>
              <Ionicons name="refresh-outline" size={22} color="#FF6B6B" />
              <Text style={[styles.settingText, { color: '#FF6B6B' }]}>Reset Pengaturan</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#FF6B6B" />
          </TouchableOpacity>
        </View>

        {/* Info Aplikasi */}
        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>Smart Expense Tracker</Text>
          <Text style={styles.infoVersion}>Versi 1.0.0 (Build 2026.01.16)</Text>
          <Text style={styles.infoTeam}>Bubble Code Team © 2026</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    paddingTop: 50
  },
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 20,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 15,
    paddingHorizontal: 20,
    paddingVertical: 5,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4A6FA5',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    marginBottom: 5,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 15,
  },
  settingRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingValue: {
    fontSize: 14,
    color: '#666',
    marginRight: 8,
  },
  cacheSize: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
    marginRight: 8,
  },
  infoSection: {
    alignItems: 'center',
    paddingVertical: 30,
    marginBottom: 40,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4A6FA5',
    marginBottom: 8,
  },
  infoVersion: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  infoTeam: {
    fontSize: 12,
    color: '#999',
  },
});

export default SettingsScreen;