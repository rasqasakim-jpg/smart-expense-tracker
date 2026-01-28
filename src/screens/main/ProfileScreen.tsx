import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

// ✅ FIX: Define local param list
type ProfileStackParamList = {
  ProfileMain: undefined;
  ActivityLog: undefined;
  Budget: undefined;
  BudgetForm: undefined;
  BudgetDetail: undefined;
  Language: undefined;
  Security: undefined;
  Settings: undefined;
};

type ProfileScreenNavigationProp = StackNavigationProp<ProfileStackParamList, 'ProfileMain'>;

const ProfileScreen = () => {
  const navigation = useNavigation<ProfileScreenNavigationProp>();

  // Fungsi untuk navigasi
  const navigateToActivityLog = () => {
    navigation.navigate('ActivityLog');
  };

  const navigateToBudget = () => {
    navigation.navigate('Budget');
  };

  const navigateToLanguage = () => {
    navigation.navigate('Language');
  };

  const navigateToSecurity = () => {
    navigation.navigate('Security');
  };

  const navigateToSettings = () => {
    navigation.navigate('Settings');
  };

  // Fungsi untuk logout
  const handleLogout = () => {
    console.log('Logout pressed');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header - Nama dan Email */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <TouchableOpacity style={styles.avatar}>
              <Ionicons name='person-outline' size={30} color={'#000000'}/>  
            </TouchableOpacity>
          </View>
          <Text style={styles.userName}>Ucup Sanjaya</Text>
          <Text style={styles.userEmail}>ucup@example.com</Text>
        </View>

        {/* Pengaturan Akun Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pengaturan Akun</Text>
          
          {/* Menu Items */}
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <Ionicons name="person-outline" size={22} color="#4A6FA5" />
              <Text style={styles.menuItemText}>Edit Profil</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>

          {/* Security */}
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={navigateToSecurity}
          >
            <View style={styles.menuItemLeft}>
              <Ionicons name="shield-checkmark-outline" size={22} color="#4A6FA5" />
              <View style={styles.menuTextContainer}>
                <Text style={styles.menuItemText}>Keamanan</Text>
                <Text style={styles.menuItemDescription}>
                  Kelola kata sandi dan keamanan akun
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>

          {/* Language */}
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={navigateToLanguage}
          >
            <View style={styles.menuItemLeft}>
              <Ionicons name="language-outline" size={22} color="#4A6FA5" />
              <View style={styles.menuTextContainer}>
                <Text style={styles.menuItemText}>Bahasa</Text>
                <Text style={styles.menuItemDescription}>
                  Pilih bahasa aplikasi
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>

          {/* Activity Log */}
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={navigateToActivityLog}
          >
            <View style={styles.menuItemLeft}>
              <Ionicons name="time-outline" size={22} color="#4A6FA5" />
              <View style={styles.menuTextContainer}>
                <Text style={styles.menuItemText}>Activity Log</Text>
                <Text style={styles.menuItemDescription}>
                  Riwayat aktivitas Anda
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>

          {/* Budget */}
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={navigateToBudget}
          >
            <View style={styles.menuItemLeft}>
              <Ionicons name="pie-chart-outline" size={22} color="#4A6FA5" />
              <View style={styles.menuTextContainer}>
                <Text style={styles.menuItemText}>Budget</Text>
                <Text style={styles.menuItemDescription}>
                  Atur batas pengeluaran per Kategori
                </Text>
             </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>

          {/* Settings - NEW */}
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={navigateToSettings}
          >
            <View style={styles.menuItemLeft}>
              <Ionicons name="settings-outline" size={22} color="#4A6FA5" />
              <View style={styles.menuTextContainer}>
                <Text style={styles.menuItemText}>Pengaturan Aplikasi</Text>
                <Text style={styles.menuItemDescription}>
                  Atur tampilan, notifikasi, dan data
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>
        </View>

        {/* Aplikasi Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Aplikasi</Text>
          
          {/* Versi Aplikasi */}
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Versi Aplikasi</Text>
            <View style={styles.infoValueContainer}>
              <Text style={styles.infoValue}>1.0.0</Text>
            </View>
          </View>

          {/* Build Number */}
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Build Number</Text>
            <View style={styles.infoValueContainer}>
              <Text style={styles.infoValue}>2026.01.16</Text>
            </View>
          </View>

          {/* Team Info */}
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Tim Pengembang</Text>
            <View style={styles.infoValueContainer}>
              <Text style={styles.infoValue}>Bubble Code Team</Text>
            </View>
          </View>
        </View>

        {/* Logout Button */}
        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <Ionicons name="log-out-outline" size={22} color="#fff" />
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>

        {/* Spacer untuk bottom navigation */}
        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  // Profile Header
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 30,
    backgroundColor: '#007bff',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    marginBottom: 20,
  },
  avatarContainer: {
    marginBottom: 15,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#007bff',
  },
  avatarText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#fff',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 16,
    color: '#ffffff',
    marginBottom: 20,
  },
  userStats: {
    flexDirection: 'row',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    width: '90%',
    justifyContent: 'space-around',
  },
  // Section
  section: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 15,
    paddingHorizontal: 20,
    paddingVertical: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4A6FA5',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    marginBottom: 5,
  },
  // Menu Items
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuTextContainer: {
    marginLeft: 15,
    flex: 1,
  },
  menuItemText: {
    fontSize: 16,
    color: '#333',
  },
  menuItemDescription: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  // Info Items (Versi Aplikasi, Build Number)
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  infoLabel: {
    fontSize: 16,
    color: '#333',
  },
  infoValueContainer: {
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  infoValue: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  // Logout Button
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF6B6B',
    marginHorizontal: 20,
    marginTop: 10,
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 10,
  },
  // Bottom Spacer
  bottomSpacer: {
    height: 80, // Untuk memberi space agar tidak tertutup bottom navigation
  },
});

export default ProfileScreen;