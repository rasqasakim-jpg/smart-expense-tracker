import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  RefreshControl,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import Ionicons from '@react-native-vector-icons/ionicons'; // PAKAI IONICONS
import { activityAPI } from '../../services/activityApi';
import { ActivityLog, ActivitySection, ActivityType } from '../../types/activity';
import { groupActivitiesByDate, getActivityIcon } from '../../utils/activityHelper';
import ActivityItem from '../../components/activity/ActivityItem';
import ActivityFilter from '../../components/activity/ActivityFilter';
import ScreenHeader from '../../components/layout/ScreenHeader';

type ActivityStackParamList = {
  ActivityLog: undefined;
  ActivityDetail: { activityId: number };
};

type ActivityLogScreenNavigationProp = StackNavigationProp<
  ActivityStackParamList,
  'ActivityLog'
>;

interface Props {
  navigation: ActivityLogScreenNavigationProp;
}

const ActivityLogScreen: React.FC<Props> = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [selectedType, setSelectedType] = useState<ActivityType | 'ALL'>('ALL');
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [sections, setSections] = useState<ActivitySection[]>([]);

  useEffect(() => {
    loadActivities();
  }, []);

  const loadActivities = async (filters?: any) => {
    try {
      const response = await activityAPI.getAll({
        ...filters,
        search: searchQuery,
        type: selectedType === 'ALL' ? undefined : selectedType,
      });
      
      const activitiesData = response.data;
      setActivities(activitiesData);
      
      // Group activities by date
      const grouped = groupActivitiesByDate(activitiesData);
      setSections(grouped);
    } catch (error) {
      console.error('Error loading activities:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadActivities();
  };

  const handleSearch = () => {
    setLoading(true);
    loadActivities();
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setSelectedType('ALL');
    setLoading(true);
    loadActivities();
  };

  const handleActivityPress = (activity: ActivityLog) => {
    navigation.navigate('ActivityDetail', { activityId: activity.id });
  };

  const handleFilterSelect = (type: ActivityType | 'ALL') => {
    setSelectedType(type);
    setShowFilterModal(false);
    setLoading(true);
    loadActivities();
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={styles.loadingText}>Memuat aktivitas...</Text>
      </View>
    );
  }

  const renderSectionHeader = (title: string) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
  );

  const renderActivityItem = ({ item }: { item: ActivityLog }) => (
    <ActivityItem
      activity={item}
      onPress={() => handleActivityPress(item)}
    />
  );

  return (
    <View style={styles.container}>
      <ScreenHeader title="Activity Log" />
      
      {/* Search and Filter Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Cari aktivitas..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
          {(searchQuery.length > 0 || selectedType !== 'ALL') && (
            <TouchableOpacity onPress={handleClearSearch}>
              <Ionicons name="close" size={20} color="#999" />
            </TouchableOpacity>
          )}
        </View>
        
        <TouchableOpacity 
          style={[styles.filterButton, selectedType !== 'ALL' && styles.filterButtonActive]}
          onPress={() => setShowFilterModal(true)}
        >
          <Ionicons name="funnel-outline" size={24} color={selectedType !== 'ALL' ? '#fff' : '#007bff'} />
        </TouchableOpacity>
      </View>

      {/* Filter Indicator */}
      {selectedType !== 'ALL' && (
        <View style={styles.filterIndicator}>
          <Text style={styles.filterIndicatorText}>
            Filter: {selectedType.replace('_', ' ')}
          </Text>
          <TouchableOpacity onPress={() => handleFilterSelect('ALL')}>
            <Text style={styles.clearFilterText}>Hapus</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Activities List */}
      {activities.length > 0 ? (
        <FlatList
          data={sections}
          keyExtractor={(item, index) => `${item.title}-${index}`}
          renderItem={({ item: section }) => (
            <View>
              {renderSectionHeader(section.title)}
              <FlatList
                data={section.data}
                renderItem={renderActivityItem}
                keyExtractor={(item) => item.id.toString()}
                scrollEnabled={false}
              />
            </View>
          )}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={['#007bff']}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="document-text" size={64} color="#ccc" />
              <Text style={styles.emptyText}>Tidak ada aktivitas</Text>
              <Text style={styles.emptySubtext}>
                {searchQuery ? 'Coba kata kunci lain' : 'Aktivitas akan muncul di sini'}
              </Text>
            </View>
          }
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons name="document-text" size={64} color="#ccc" />
          <Text style={styles.emptyText}>Tidak ada aktivitas</Text>
          <Text style={styles.emptySubtext}>
            Aktivitas akan muncul di sini
          </Text>
        </View>
      )}

      {/* Filter Modal Component */}
      <ActivityFilter
        visible={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        onFilterSelect={handleFilterSelect}
        selectedType={selectedType}
      />
    </View>
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
  },
  loadingText: {
    marginTop: 12,
    color: '#666',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eaeaea',
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginRight: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
    color: '#333',
  },
  filterButton: {
    width: 44,
    height: 44,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#007bff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterButtonActive: {
    backgroundColor: '#007bff',
  },
  filterIndicator: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#e9ecef',
  },
  filterIndicatorText: {
    fontSize: 14,
    color: '#495057',
    fontWeight: '500',
  },
  clearFilterText: {
    fontSize: 14,
    color: '#007bff',
    fontWeight: '600',
  },
  listContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  sectionHeader: {
    marginTop: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
    textAlign: 'center',
  },
});

export default ActivityLogScreen;