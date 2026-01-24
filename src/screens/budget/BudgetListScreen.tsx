import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Alert,
  Modal,
  ScrollView,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import Ionicons from '@react-native-vector-icons/ionicons';
import { BudgetStackParamList, BudgetWithStatus } from '../../types/budget';
import { budgetAPI } from '../../services/budgetApi';
import BudgetCard from '../../components/budget/BudgetCard';
import ScreenHeader from '../../components/layout/ScreenHeader';
import { formatBudgetPeriod } from '../../utils/budgetHelper';

type BudgetListScreenNavigationProp = StackNavigationProp<
  BudgetStackParamList,
  'BudgetList'
>;

interface Props {
  navigation: BudgetListScreenNavigationProp;
}

const BudgetListScreen: React.FC<Props> = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [budgets, setBudgets] = useState<BudgetWithStatus[]>([]);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<'ALL' | 'MONTHLY' | 'WEEKLY' | 'YEARLY'>('ALL');
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  
  // Summary stats
  const [totalBudget, setTotalBudget] = useState(0);
  const [totalSpent, setTotalSpent] = useState(0);
  const [statusCount, setStatusCount] = useState({ hemat: 0, normal: 0, boros: 0 });

  useEffect(() => {
    loadBudgets();
  }, []);

  const loadBudgets = async () => {
    try {
      const filters: any = {};
      
      if (selectedPeriod !== 'ALL') {
        filters.period = selectedPeriod;
      }
      
      // Default filter untuk bulan ini jika monthly
      if (selectedPeriod === 'ALL' || selectedPeriod === 'MONTHLY') {
        filters.month = selectedMonth;
        filters.year = selectedYear;
      } else {
        filters.year = selectedYear;
      }
      
      const response = await budgetAPI.getAll(filters);
      const budgetsData = response.data;
      setBudgets(budgetsData);
      
      // Calculate summary
      calculateSummary(budgetsData);
    } catch (error) {
      console.error('Error loading budgets:', error);
      Alert.alert('Error', 'Gagal memuat data budget');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const calculateSummary = (budgetsData: BudgetWithStatus[]) => {
    let totalBud = 0;
    let totalSp = 0;
    const counts = { hemat: 0, normal: 0, boros: 0 };
    
    budgetsData.forEach(budget => {
      totalBud += budget.amount;
      totalSp += budget.currentSpent;
      
      switch (budget.status.status) {
        case 'HEMAT':
          counts.hemat++;
          break;
        case 'NORMAL':
          counts.normal++;
          break;
        case 'BOROS':
          counts.boros++;
          break;
      }
    });
    
    setTotalBudget(totalBud);
    setTotalSpent(totalSp);
    setStatusCount(counts);
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadBudgets();
  };

  const handleAddBudget = () => {
    navigation.navigate('BudgetForm', { budget: undefined });
  };

  const handleEditBudget = (budget: BudgetWithStatus) => {
    navigation.navigate('BudgetForm', { budget });
  };

  const handleDeleteBudget = (budget: BudgetWithStatus) => {
    Alert.alert(
      'Hapus Budget',
      `Apakah Anda yakin ingin menghapus budget ${budget.categoryName}?`,
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Hapus',
          style: 'destructive',
          onPress: async () => {
            try {
              await budgetAPI.delete(budget.id);
              Alert.alert('Success', 'Budget berhasil dihapus');
              loadBudgets();
            } catch (error) {
              Alert.alert('Error', 'Gagal menghapus budget');
            }
          },
        },
      ]
    );
  };

  const handleBudgetPress = (budget: BudgetWithStatus) => {
    navigation.navigate('BudgetDetail', { budgetId: budget.id });
  };

  const handleFilterApply = () => {
    setShowFilterModal(false);
    setLoading(true);
    loadBudgets();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const monthNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  const periodOptions = [
    { value: 'ALL' as const, label: 'Semua Periode' },
    { value: 'MONTHLY' as const, label: 'Bulanan' },
    { value: 'WEEKLY' as const, label: 'Mingguan' },
    { value: 'YEARLY' as const, label: 'Tahunan' },
  ];

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="pie-chart" size={64} color="#ccc" />
      <Text style={styles.emptyTitle}>Belum ada Budget</Text>
      <Text style={styles.emptyText}>
        Buat budget pertama Anda untuk mulai mengatur pengeluaran
      </Text>
      <TouchableOpacity style={styles.addFirstButton} onPress={handleAddBudget}>
        <Text style={styles.addFirstButtonText}>+ Buat Budget Pertama</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading && !refreshing) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={styles.loadingText}>Memuat budget...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScreenHeader 
        title="Budget Saya" 
        rightComponent={
          <TouchableOpacity onPress={handleAddBudget}>
            <Ionicons name="add" size={24} color="#007bff" />
          </TouchableOpacity>
        }
      />

      {/* Summary Card */}
      <View style={styles.summaryCard}>
        <View style={styles.summaryHeader}>
          <Text style={styles.summaryTitle}>Ringkasan Budget</Text>
          <TouchableOpacity 
            style={styles.filterButton}
            onPress={() => setShowFilterModal(true)}
          >
            <Ionicons name="filter-outline" size={20} color="#007bff" />
            <Text style={styles.filterButtonText}>Filter</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.summaryStats}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Total Budget</Text>
            <Text style={styles.statValue}>{formatCurrency(totalBudget)}</Text>
          </View>
          
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Total Terpakai</Text>
            <Text style={styles.statValue}>{formatCurrency(totalSpent)}</Text>
          </View>
          
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Sisa</Text>
            <Text style={[
              styles.statValue, 
              { color: totalBudget - totalSpent >= 0 ? '#28a745' : '#dc3545' }
            ]}>
              {formatCurrency(totalBudget - totalSpent)}
            </Text>
          </View>
        </View>
        
        {/* Status Indicators */}
        <View style={styles.statusIndicators}>
          <View style={styles.statusItem}>
            <View style={[styles.statusDot, { backgroundColor: '#28a745' }]} />
            <Text style={styles.statusText}>HEMAT: {statusCount.hemat}</Text>
          </View>
          
          <View style={styles.statusItem}>
            <View style={[styles.statusDot, { backgroundColor: '#ffc107' }]} />
            <Text style={styles.statusText}>NORMAL: {statusCount.normal}</Text>
          </View>
          
          <View style={styles.statusItem}>
            <View style={[styles.statusDot, { backgroundColor: '#dc3545' }]} />
            <Text style={styles.statusText}>BOROS: {statusCount.boros}</Text>
          </View>
        </View>
      </View>

      {/* Budget List */}
      <FlatList
        data={budgets}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <BudgetCard
            budget={item}
            onPress={() => handleBudgetPress(item)}
            onEdit={() => handleEditBudget(item)}
            onDelete={() => handleDeleteBudget(item)}
          />
        )}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#007bff']}
          />
        }
        ListEmptyComponent={renderEmptyState()}
        ListHeaderComponent={
          budgets.length > 0 ? (
            <Text style={styles.listTitle}>
              {selectedPeriod === 'ALL' 
                ? `Budget ${monthNames[selectedMonth - 1]} ${selectedYear}`
                : `${formatBudgetPeriod(selectedPeriod, selectedMonth)} ${selectedYear}`
              }
            </Text>
          ) : null
        }
      />

      {/* Filter Modal */}
      <Modal
        visible={showFilterModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowFilterModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filter Budget</Text>
              <TouchableOpacity onPress={() => setShowFilterModal(false)}>
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalBody}>
              {/* Period Selection */}
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>Periode</Text>
                <View style={styles.filterOptions}>
                  {periodOptions.map((option) => (
                    <TouchableOpacity
                      key={option.value}
                      style={[
                        styles.filterOption,
                        selectedPeriod === option.value && styles.filterOptionSelected,
                      ]}
                      onPress={() => setSelectedPeriod(option.value)}
                    >
                      <Text style={[
                        styles.filterOptionText,
                        selectedPeriod === option.value && styles.filterOptionTextSelected,
                      ]}>
                        {option.label}
                      </Text>
                      {selectedPeriod === option.value && (
                        <Ionicons name="checkmark" size={20} color="#fff" />
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              
              {/* Month Selection (for monthly) */}
              {(selectedPeriod === 'ALL' || selectedPeriod === 'MONTHLY') && (
                <View style={styles.filterSection}>
                  <Text style={styles.filterSectionTitle}>Bulan</Text>
                  <View style={styles.monthGrid}>
                    {monthNames.map((month, index) => (
                      <TouchableOpacity
                        key={index}
                        style={[
                          styles.monthOption,
                          selectedMonth === index + 1 && styles.monthOptionSelected,
                        ]}
                        onPress={() => setSelectedMonth(index + 1)}
                      >
                        <Text style={[
                          styles.monthOptionText,
                          selectedMonth === index + 1 && styles.monthOptionTextSelected,
                        ]}>
                          {month.substring(0, 3)}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              )}
              
              {/* Year Selection */}
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>Tahun</Text>
                <View style={styles.yearContainer}>
                  <TouchableOpacity 
                    style={styles.yearButton}
                    onPress={() => setSelectedYear(prev => prev - 1)}
                  >
                    <Ionicons name="chevron-back-circle-outline" size={24} color="#007bff" />
                  </TouchableOpacity>
                  
                  <Text style={styles.yearText}>{selectedYear}</Text>
                  
                  <TouchableOpacity 
                    style={styles.yearButton}
                    onPress={() => setSelectedYear(prev => prev + 1)}
                  >
                    <Ionicons name="chevron-forward-circle-outline" size={24} color="#007bff" />
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
            
            <View style={styles.modalFooter}>
              <TouchableOpacity 
                style={styles.modalCancelButton}
                onPress={() => setShowFilterModal(false)}
              >
                <Text style={styles.modalCancelButtonText}>Batal</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.modalApplyButton}
                onPress={handleFilterApply}
              >
                <Text style={styles.modalApplyButtonText}>Terapkan Filter</Text>
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
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    color: '#666',
  },
  summaryCard: {
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#f8f9fa',
  },
  filterButtonText: {
    fontSize: 12,
    color: '#007bff',
    fontWeight: '600',
    marginLeft: 4,
  },
  summaryStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  statusIndicators: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    color: '#666',
  },
  listContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  listTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    marginBottom: 12,
    marginLeft: 4,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#666',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  addFirstButton: {
    backgroundColor: '#007bff',
    borderRadius: 8,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  addFirstButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eaeaea',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  modalBody: {
    padding: 20,
  },
  modalFooter: {
    flexDirection: 'row',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#eaeaea',
    gap: 12,
  },
  filterSection: {
    marginBottom: 24,
  },
  filterSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  filterOptions: {
    gap: 8,
  },
  filterOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#eaeaea',
  },
  filterOptionSelected: {
    backgroundColor: '#007bff',
    borderColor: '#007bff',
  },
  filterOptionText: {
    fontSize: 16,
    color: '#1a1a1a',
  },
  filterOptionTextSelected: {
    color: '#fff',
  },
  monthGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  monthOption: {
    width: '23%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#eaeaea',
    backgroundColor: '#f8f9fa',
  },
  monthOptionSelected: {
    backgroundColor: '#007bff',
    borderColor: '#007bff',
  },
  monthOptionText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  monthOptionTextSelected: {
    color: '#fff',
  },
  yearContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
  },
  yearButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  yearText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a1a',
    minWidth: 80,
    textAlign: 'center',
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
  modalApplyButton: {
    flex: 1,
    backgroundColor: '#007bff',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  modalApplyButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
});

export default BudgetListScreen;