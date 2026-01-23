import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import Ionicons from '@react-native-vector-icons/ionicons'; // PAKAI IONICONS
import { ActivityLog, ActivityType } from '../../types/activity';
import { activityAPI } from '../../services/activityApi';
import { getActivityIcon, formatActivityTime } from '../../utils/activityHelper';
import ScreenHeader from '../../components/layout/ScreenHeader';

type ActivityStackParamList = {
  ActivityLog: undefined;
  ActivityDetail: { activityId: number };
};

type ActivityDetailScreenNavigationProp = StackNavigationProp<
  ActivityStackParamList,
  'ActivityDetail'
>;

type ActivityDetailScreenRouteProp = RouteProp<
  ActivityStackParamList,
  'ActivityDetail'
>;

interface Props {
  navigation: ActivityDetailScreenNavigationProp;
  route: ActivityDetailScreenRouteProp;
}

const ActivityDetailScreen: React.FC<Props> = ({ navigation, route }) => {
  const { activityId } = route.params;
  const [activity, setActivity] = useState<ActivityLog | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadActivity();
  }, []);

  const loadActivity = async () => {
    try {
      const response = await activityAPI.getById(activityId);
      setActivity(response.data);
    } catch (error) {
      Alert.alert('Error', 'Gagal memuat detail aktivitas');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const { name: iconName, color: iconColor } = getActivityIcon(activity?.type || 'SYSTEM');

  const getActivityTypeLabel = (type: ActivityType): string => {
    const labels: Record<ActivityType, string> = {
      'LOGIN': 'Login',
      'REGISTER': 'Registrasi',
      'TRANSACTION_CREATE': 'Tambah Transaksi',
      'TRANSACTION_UPDATE': 'Edit Transaksi',
      'TRANSACTION_DELETE': 'Hapus Transaksi',
      'WALLET_CREATE': 'Tambah Wallet',
      'WALLET_UPDATE': 'Edit Wallet',
      'WALLET_DELETE': 'Hapus Wallet',
      'CATEGORY_CREATE': 'Tambah Kategori',
      'CATEGORY_UPDATE': 'Edit Kategori',
      'CATEGORY_DELETE': 'Hapus Kategori',
      'PROFILE_UPDATE': 'Update Profil',
      'OTP_SENT': 'Kirim OTP',
      'PASSWORD_RESET': 'Reset Password',
      'SYSTEM': 'Sistem',
    };
    
    return labels[type] || 'Aktivitas';
  };

  const formatAmount = (amount?: number) => {
    if (!amount) return '';
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getTransactionDetails = () => {
    if (!activity?.metadata) return null;
    
    const { transactionId, description, amount, type, category, walletName } = activity.metadata;
    
    return (
      <View style={styles.detailsCard}>
        <Text style={styles.detailsTitle}>Detail Transaksi</Text>
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>ID Transaksi</Text>
          <Text style={styles.detailValue}>#{transactionId}</Text>
        </View>
        
        <View style={styles.separator} />
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Deskripsi</Text>
          <Text style={styles.detailValue}>{description}</Text>
        </View>
        
        <View style={styles.separator} />
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Jumlah</Text>
          <Text style={[
            styles.detailValue,
            type === 'INCOME' ? styles.incomeText : styles.expenseText
          ]}>
            {type === 'INCOME' ? '+' : '-'}{formatAmount(amount)}
          </Text>
        </View>
        
        <View style={styles.separator} />
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Kategori</Text>
          <Text style={styles.detailValue}>{category || '-'}</Text>
        </View>
        
        <View style={styles.separator} />
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Wallet</Text>
          <Text style={styles.detailValue}>{walletName || '-'}</Text>
        </View>
      </View>
    );
  };

  const getWalletDetails = () => {
    if (!activity?.metadata) return null;
    
    const { walletId, name, balance } = activity.metadata;
    
    return (
      <View style={styles.detailsCard}>
        <Text style={styles.detailsTitle}>Detail Wallet</Text>
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>ID Wallet</Text>
          <Text style={styles.detailValue}>#{walletId}</Text>
        </View>
        
        <View style={styles.separator} />
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Nama</Text>
          <Text style={styles.detailValue}>{name}</Text>
        </View>
        
        <View style={styles.separator} />
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Saldo Awal</Text>
          <Text style={[styles.detailValue, styles.incomeText]}>
            {formatAmount(balance)}
          </Text>
        </View>
      </View>
    );
  };

  const getCategoryDetails = () => {
    if (!activity?.metadata) return null;
    
    const { categoryId, name, type } = activity.metadata;
    
    return (
      <View style={styles.detailsCard}>
        <Text style={styles.detailsTitle}>Detail Kategori</Text>
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>ID Kategori</Text>
          <Text style={styles.detailValue}>#{categoryId}</Text>
        </View>
        
        <View style={styles.separator} />
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Nama</Text>
          <Text style={styles.detailValue}>{name}</Text>
        </View>
        
        <View style={styles.separator} />
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Tipe</Text>
          <Text style={styles.detailValue}>
            {type === 'INCOME' ? 'Pemasukan' : 'Pengeluaran'}
          </Text>
        </View>
      </View>
    );
  };

  const renderDetails = () => {
    if (!activity) return null;
    
    switch (activity.type) {
      case 'TRANSACTION_CREATE':
      case 'TRANSACTION_UPDATE':
      case 'TRANSACTION_DELETE':
        return getTransactionDetails();
        
      case 'WALLET_CREATE':
      case 'WALLET_UPDATE':
      case 'WALLET_DELETE':
        return getWalletDetails();
        
      case 'CATEGORY_CREATE':
      case 'CATEGORY_UPDATE':
      case 'CATEGORY_DELETE':
        return getCategoryDetails();
        
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  if (!activity) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Aktivitas tidak ditemukan</Text>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Kembali</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <ScreenHeader
        title="Detail Aktivitas"
        showBackButton
        onBackPress={() => navigation.goBack()}
      />

      {/* Activity Header */}
      <View style={styles.headerCard}>
        <View style={[styles.iconContainer, { backgroundColor: `${iconColor}20` }]}>
          <Ionicons name={iconName as any} size={32} color={iconColor} />
        </View>
        
        <View style={styles.headerContent}>
          <Text style={styles.activityType}>
            {getActivityTypeLabel(activity.type)}
          </Text>
          <Text style={styles.activityTitle}>{activity.title}</Text>
          <Text style={styles.timestamp}>
            {formatActivityTime(activity.timestamp)}
          </Text>
        </View>
      </View>

      {/* Description */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Deskripsi</Text>
        <Text style={styles.description}>{activity.description}</Text>
      </View>

      {/* Metadata Details */}
      {renderDetails()}

      {/* Activity Info */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Informasi Aktivitas</Text>
        
        <View style={styles.infoRow}>
          <Ionicons name="time" size={20} color="#666" />
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>Waktu</Text>
            <Text style={styles.infoValue}>
              {formatActivityTime(activity.timestamp)} WIB
            </Text>
          </View>
        </View>
        
        <View style={styles.separator} />
        
        <View style={styles.infoRow}>
          <Ionicons name="calendar" size={20} color="#666" />
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>Dicatat Pada</Text>
            <Text style={styles.infoValue}>
              {formatActivityTime(activity.createdAt)}
            </Text>
          </View>
        </View>
        
        {activity.device && (
          <>
            <View style={styles.separator} />
            <View style={styles.infoRow}>
              <Ionicons name="phone-portrait" size={20} color="#666" />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Perangkat</Text>
                <Text style={styles.infoValue}>{activity.device}</Text>
              </View>
            </View>
          </>
        )}
        
        {activity.ipAddress && (
          <>
            <View style={styles.separator} />
            <View style={styles.infoRow}>
              <Ionicons name="globe" size={20} color="#666" />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Alamat IP</Text>
                <Text style={styles.infoValue}>{activity.ipAddress}</Text>
              </View>
            </View>
          </>
        )}
      </View>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={20} color="#007bff" />
          <Text style={[styles.actionButtonText, { color: '#007bff' }]}>
            Kembali ke Log
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    paddingTop: 50
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: '#dc3545',
    marginBottom: 20,
    textAlign: 'center',
  },
  backButton: {
    backgroundColor: '#007bff',
    borderRadius: 8,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  headerCard: {
    backgroundColor: '#fff',
    margin: 20,
    borderRadius: 16,
    padding: 24,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
  },
  headerContent: {
    flex: 1,
  },
  activityType: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
    marginBottom: 4,
  },
  activityTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  timestamp: {
    fontSize: 14,
    color: '#999',
  },
  card: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  detailsCard: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  detailsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  detailValue: {
    fontSize: 16,
    color: '#1a1a1a',
    fontWeight: '500',
    flex: 1,
    textAlign: 'right',
  },
  incomeText: {
    color: '#28a745',
  },
  expenseText: {
    color: '#dc3545',
  },
  separator: {
    height: 1,
    backgroundColor: '#f0f0f0',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  infoContent: {
    flex: 1,
    marginLeft: 16,
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    color: '#1a1a1a',
    fontWeight: '500',
  },
  actionButtons: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingBottom: 40,
    marginTop: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    flex: 1,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default ActivityDetailScreen;