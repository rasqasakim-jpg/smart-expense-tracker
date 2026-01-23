import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
} from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons'; // PAKAI IONICONS
import { ActivityType } from '../../types/activity';
import { getActivityIcon } from '../../utils/activityHelper';

interface ActivityFilterProps {
  visible: boolean;
  onClose: () => void;
  onFilterSelect: (type: ActivityType | 'ALL') => void;
  selectedType: ActivityType | 'ALL';
}

const ActivityFilter: React.FC<ActivityFilterProps> = ({
  visible,
  onClose,
  onFilterSelect,
  selectedType,
}) => {
  const activityTypes: Array<{ type: ActivityType | 'ALL'; label: string; icon: string }> = [
    { type: 'ALL', label: 'Semua Aktivitas', icon: 'pulse' },
    { type: 'LOGIN', label: 'Login', icon: 'log-in' },
    { type: 'REGISTER', label: 'Registrasi', icon: 'person-add-outline' },
    { type: 'TRANSACTION_CREATE', label: 'Tambah Transaksi', icon: 'add-circle-outline' },
    { type: 'TRANSACTION_UPDATE', label: 'Edit Transaksi', icon: 'create-outline' },
    { type: 'TRANSACTION_DELETE', label: 'Hapus Transaksi', icon: 'trash-outline' },
    { type: 'WALLET_CREATE', label: 'Tambah Wallet', icon: 'wallet-outline' },
    { type: 'WALLET_UPDATE', label: 'Edit Wallet', icon: 'refresh-circle-outline' },
    { type: 'WALLET_DELETE', label: 'Hapus Wallet', icon: 'close-circle-outline' },
    { type: 'CATEGORY_CREATE', label: 'Tambah Kategori', icon: 'folder-open-outline' },
    { type: 'CATEGORY_UPDATE', label: 'Edit Kategori', icon: 'folder-outline' },
    { type: 'CATEGORY_DELETE', label: 'Hapus Kategori', icon: 'remove-circle-outline' },
    { type: 'PROFILE_UPDATE', label: 'Update Profil', icon: 'person-outline' },
    { type: 'OTP_SENT', label: 'Kirim OTP', icon: 'mail-outline' },
    { type: 'PASSWORD_RESET', label: 'Reset Password', icon: 'lock-closed-outline' },
    { type: 'SYSTEM', label: 'Sistem', icon: 'settings-outline' },
  ];

  const handleSelect = (type: ActivityType | 'ALL') => {
    onFilterSelect(type);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Filter Aktivitas</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content}>
            <View style={styles.filterGroups}>
              {/* All Activities */}
              <TouchableOpacity
                style={[
                  styles.filterItem,
                  selectedType === 'ALL' && styles.filterItemSelected,
                ]}
                onPress={() => handleSelect('ALL')}
              >
                <View style={styles.filterItemContent}>
                  <Ionicons name="pulse" size={20} color={selectedType === 'ALL' ? '#fff' : '#007bff'} />
                  <Text style={[
                    styles.filterItemText,
                    selectedType === 'ALL' && styles.filterItemTextSelected,
                  ]}>
                    Semua Aktivitas
                  </Text>
                </View>
                {selectedType === 'ALL' && (
                  <Ionicons name="checkmark" size={20} color="#fff" />
                )}
              </TouchableOpacity>

              {/* Authentication */}
              <View style={styles.filterGroup}>
                <Text style={styles.groupTitle}>Autentikasi</Text>
                {activityTypes
                  .filter(t => ['LOGIN', 'REGISTER', 'OTP_SENT', 'PASSWORD_RESET'].includes(t.type))
                  .map((item) => {
                    const { color: iconColor } = getActivityIcon(item.type as ActivityType);
                    
                    return (
                      <TouchableOpacity
                        key={item.type}
                        style={[
                          styles.filterItem,
                          selectedType === item.type && styles.filterItemSelected,
                        ]}
                        onPress={() => handleSelect(item.type)}
                      >
                        <View style={styles.filterItemContent}>
                          <Ionicons 
                            name={item.icon as any} 
                            size={20} 
                            color={selectedType === item.type ? '#fff' : iconColor} 
                          />
                          <Text style={[
                            styles.filterItemText,
                            selectedType === item.type && styles.filterItemTextSelected,
                          ]}>
                            {item.label}
                          </Text>
                        </View>
                        {selectedType === item.type && (
                          <Ionicons name="checkmark" size={20} color="#fff" />
                        )}
                      </TouchableOpacity>
                    );
                  })}
              </View>

              {/* Transactions */}
              <View style={styles.filterGroup}>
                <Text style={styles.groupTitle}>Transaksi</Text>
                {activityTypes
                  .filter(t => t.type.includes('TRANSACTION'))
                  .map((item) => {
                    const { color: iconColor } = getActivityIcon(item.type as ActivityType);
                    
                    return (
                      <TouchableOpacity
                        key={item.type}
                        style={[
                          styles.filterItem,
                          selectedType === item.type && styles.filterItemSelected,
                        ]}
                        onPress={() => handleSelect(item.type)}
                      >
                        <View style={styles.filterItemContent}>
                          <Ionicons 
                            name={item.icon as any} 
                            size={20} 
                            color={selectedType === item.type ? '#fff' : iconColor} 
                          />
                          <Text style={[
                            styles.filterItemText,
                            selectedType === item.type && styles.filterItemTextSelected,
                          ]}>
                            {item.label}
                          </Text>
                        </View>
                        {selectedType === item.type && (
                          <Ionicons name="checkmark" size={20} color="#fff" />
                        )}
                      </TouchableOpacity>
                    );
                  })}
              </View>

              {/* Wallets */}
              <View style={styles.filterGroup}>
                <Text style={styles.groupTitle}>Wallet</Text>
                {activityTypes
                  .filter(t => t.type.includes('WALLET'))
                  .map((item) => {
                    const { color: iconColor } = getActivityIcon(item.type as ActivityType);
                    
                    return (
                      <TouchableOpacity
                        key={item.type}
                        style={[
                          styles.filterItem,
                          selectedType === item.type && styles.filterItemSelected,
                        ]}
                        onPress={() => handleSelect(item.type)}
                      >
                        <View style={styles.filterItemContent}>
                          <Ionicons 
                            name={item.icon as any} 
                            size={20} 
                            color={selectedType === item.type ? '#fff' : iconColor} 
                          />
                          <Text style={[
                            styles.filterItemText,
                            selectedType === item.type && styles.filterItemTextSelected,
                          ]}>
                            {item.label}
                          </Text>
                        </View>
                        {selectedType === item.type && (
                          <Ionicons name="checkmark" size={20} color="#fff" />
                        )}
                      </TouchableOpacity>
                    );
                  })}
              </View>

              {/* Categories */}
              <View style={styles.filterGroup}>
                <Text style={styles.groupTitle}>Kategori</Text>
                {activityTypes
                  .filter(t => t.type.includes('CATEGORY'))
                  .map((item) => {
                    const { color: iconColor } = getActivityIcon(item.type as ActivityType);
                    
                    return (
                      <TouchableOpacity
                        key={item.type}
                        style={[
                          styles.filterItem,
                          selectedType === item.type && styles.filterItemSelected,
                        ]}
                        onPress={() => handleSelect(item.type)}
                      >
                        <View style={styles.filterItemContent}>
                          <Ionicons 
                            name={item.icon as any} 
                            size={20} 
                            color={selectedType === item.type ? '#fff' : iconColor} 
                          />
                          <Text style={[
                            styles.filterItemText,
                            selectedType === item.type && styles.filterItemTextSelected,
                          ]}>
                            {item.label}
                          </Text>
                        </View>
                        {selectedType === item.type && (
                          <Ionicons name="checkmark" size={20} color="#fff" />
                        )}
                      </TouchableOpacity>
                    );
                  })}
              </View>

              {/* Others */}
              <View style={styles.filterGroup}>
                <Text style={styles.groupTitle}>Lainnya</Text>
                {activityTypes
                  .filter(t => ['PROFILE_UPDATE', 'SYSTEM'].includes(t.type))
                  .map((item) => {
                    const { color: iconColor } = getActivityIcon(item.type as ActivityType);
                    
                    return (
                      <TouchableOpacity
                        key={item.type}
                        style={[
                          styles.filterItem,
                          selectedType === item.type && styles.filterItemSelected,
                        ]}
                        onPress={() => handleSelect(item.type)}
                      >
                        <View style={styles.filterItemContent}>
                          <Ionicons 
                            name={item.icon as any} 
                            size={20} 
                            color={selectedType === item.type ? '#fff' : iconColor} 
                          />
                          <Text style={[
                            styles.filterItemText,
                            selectedType === item.type && styles.filterItemTextSelected,
                          ]}>
                            {item.label}
                          </Text>
                        </View>
                        {selectedType === item.type && (
                          <Ionicons name="checkmark" size={20} color="#fff" />
                        )}
                      </TouchableOpacity>
                    );
                  })}
              </View>
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity 
              style={styles.applyButton}
              onPress={() => onClose()}
            >
              <Text style={styles.applyButtonText}>Tutup</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eaeaea',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  closeButton: {
    padding: 4,
  },
  content: {
    padding: 20,
  },
  filterGroups: {
    marginBottom: 20,
  },
  filterGroup: {
    marginBottom: 24,
  },
  groupTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
    paddingLeft: 4,
  },
  filterItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#eaeaea',
  },
  filterItemSelected: {
    backgroundColor: '#007bff',
    borderColor: '#007bff',
  },
  filterItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  filterItemText: {
    flex: 1,
    fontSize: 16,
    color: '#1a1a1a',
    marginLeft: 12,
  },
  filterItemTextSelected: {
    color: '#fff',
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#eaeaea',
  },
  applyButton: {
    backgroundColor: '#007bff',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  applyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ActivityFilter;