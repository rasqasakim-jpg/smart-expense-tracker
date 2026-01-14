import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
} from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';

interface FilterOptions {
  type?: 'INCOME' | 'EXPENSE' | 'ALL';
  categoryId?: number;
  walletId?: number;
  startDate?: string;
  endDate?: string;
}

interface TransactionFilterModalProps {
  visible: boolean;
  onClose: () => void;
  onApply: (filters: FilterOptions) => void;
  categories: Array<{ id: number; name: string }>;
  wallets: Array<{ id: number; name: string }>;
}

const TransactionFilterModal: React.FC<TransactionFilterModalProps> = ({
  visible,
  onClose,
  onApply,
  categories,
  wallets,
}) => {
  const [filters, setFilters] = useState<FilterOptions>({
    type: 'ALL',
  });

  const handleApply = () => {
    onApply(filters);
    onClose();
  };

  const handleReset = () => {
    setFilters({ type: 'ALL' });
    onApply({});
    onClose();
  };

  const dateOptions = [
    { label: 'Hari Ini', value: 'today' },
    { label: 'Minggu Ini', value: 'week' },
    { label: 'Bulan Ini', value: 'month' },
    { label: 'Semua', value: 'all' },
  ];

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Filter Transaksi</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content}>
            {/* Type Filter */}
            <View style={styles.filterSection}>
              <Text style={styles.sectionTitle}>Tipe Transaksi</Text>
              <View style={styles.typeButtons}>
                <TouchableOpacity
                  style={[
                    styles.filterButton,
                    filters.type === 'ALL' && styles.filterButtonActive,
                  ]}
                  onPress={() => setFilters({ ...filters, type: 'ALL' })}
                >
                  <Text
                    style={[
                      styles.filterButtonText,
                      filters.type === 'ALL' && styles.filterButtonTextActive,
                    ]}
                  >
                    Semua
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.filterButton,
                    filters.type === 'INCOME' && styles.filterButtonActive,
                  ]}
                  onPress={() => setFilters({ ...filters, type: 'INCOME' })}
                >
                  <Text
                    style={[
                      styles.filterButtonText,
                      filters.type === 'INCOME' && styles.filterButtonTextActive,
                    ]}
                  >
                    Pemasukan
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.filterButton,
                    filters.type === 'EXPENSE' && styles.filterButtonActive,
                  ]}
                  onPress={() => setFilters({ ...filters, type: 'EXPENSE' })}
                >
                  <Text
                    style={[
                      styles.filterButtonText,
                      filters.type === 'EXPENSE' && styles.filterButtonTextActive,
                    ]}
                  >
                    Pengeluaran
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Category Filter */}
            <View style={styles.filterSection}>
              <Text style={styles.sectionTitle}>Kategori</Text>
              <View style={styles.chipContainer}>
                <TouchableOpacity
                  style={[
                    styles.chip,
                    !filters.categoryId && styles.chipActive,
                  ]}
                  onPress={() => setFilters({ ...filters, categoryId: undefined })}
                >
                  <Text
                    style={[
                      styles.chipText,
                      !filters.categoryId && styles.chipTextActive,
                    ]}
                  >
                    Semua
                  </Text>
                </TouchableOpacity>
                {categories.map(category => (
                  <TouchableOpacity
                    key={category.id}
                    style={[
                      styles.chip,
                      filters.categoryId === category.id && styles.chipActive,
                    ]}
                    onPress={() => setFilters({ 
                      ...filters, 
                      categoryId: category.id 
                    })}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        filters.categoryId === category.id && styles.chipTextActive,
                      ]}
                    >
                      {category.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Wallet Filter */}
            <View style={styles.filterSection}>
              <Text style={styles.sectionTitle}>Wallet</Text>
              <View style={styles.chipContainer}>
                <TouchableOpacity
                  style={[
                    styles.chip,
                    !filters.walletId && styles.chipActive,
                  ]}
                  onPress={() => setFilters({ ...filters, walletId: undefined })}
                >
                  <Text
                    style={[
                      styles.chipText,
                      !filters.walletId && styles.chipTextActive,
                    ]}
                  >
                    Semua
                  </Text>
                </TouchableOpacity>
                {wallets.map(wallet => (
                  <TouchableOpacity
                    key={wallet.id}
                    style={[
                      styles.chip,
                      filters.walletId === wallet.id && styles.chipActive,
                    ]}
                    onPress={() => setFilters({ 
                      ...filters, 
                      walletId: wallet.id 
                    })}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        filters.walletId === wallet.id && styles.chipTextActive,
                      ]}
                    >
                      {wallet.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Date Filter */}
            <View style={styles.filterSection}>
              <Text style={styles.sectionTitle}>Periode</Text>
              <View style={styles.chipContainer}>
                {dateOptions.map(option => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.chip,
                      filters.startDate === option.value && styles.chipActive,
                    ]}
                    onPress={() => {
                      // Simpan filter berdasarkan periode
                      setFilters({ ...filters, startDate: option.value });
                    }}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        filters.startDate === option.value && styles.chipTextActive,
                      ]}
                    >
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
              <Text style={styles.resetButtonText}>Reset Filter</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
              <Text style={styles.applyButtonText}>Terapkan Filter</Text>
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
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eaeaea',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  content: {
    padding: 16,
  },
  filterSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  typeButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  filterButton: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  filterButtonActive: {
    backgroundColor: '#007bff',
    borderColor: '#007bff',
  },
  filterButtonText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  filterButtonTextActive: {
    color: '#fff',
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  chipActive: {
    backgroundColor: '#007bff',
    borderColor: '#007bff',
  },
  chipText: {
    fontSize: 14,
    color: '#666',
  },
  chipTextActive: {
    color: '#fff',
  },
  footer: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eaeaea',
    gap: 12,
  },
  resetButton: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  resetButtonText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '600',
  },
  applyButton: {
    flex: 1,
    backgroundColor: '#007bff',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  applyButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
});

export default TransactionFilterModal;