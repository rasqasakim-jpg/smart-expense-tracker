import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons'; // PAKAI IONICONS
import { ActivityLog } from '../../types/activity';
import { formatActivityTime, getActivityIcon } from '../../utils/activityHelper';

interface ActivityItemProps {
  activity: ActivityLog;
  onPress?: () => void;
  showTime?: boolean;
}

const ActivityItem: React.FC<ActivityItemProps> = ({
  activity,
  onPress,
  showTime = true,
}) => {
  const { name: iconName, color: iconColor } = getActivityIcon(activity.type);
  
  const formatAmount = (amount?: number) => {
    if (!amount) return '';
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Check if activity has amount in metadata
  const amount = activity.metadata?.amount;
  const isIncome = activity.metadata?.type === 'INCOME';
  const isExpense = activity.metadata?.type === 'EXPENSE';

  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.iconContainer, { backgroundColor: `${iconColor}20` }]}>
        <Ionicons name={iconName as any} size={20} color={iconColor} />
      </View>
      
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title} numberOfLines={1}>
            {activity.title}
          </Text>
          
          {amount && (
            <Text style={[
              styles.amount,
              isIncome ? styles.incomeText : styles.expenseText
            ]}>
              {isIncome ? '+' : '-'}{formatAmount(amount)}
            </Text>
          )}
        </View>
        
        <Text style={styles.description} numberOfLines={2}>
          {activity.description}
        </Text>
        
        {showTime && (
          <View style={styles.footer}>
            <Text style={styles.time}>
              {formatActivityTime(activity.timestamp)}
            </Text>
            
            {activity.device && (
              <Text style={styles.device}>
                • {activity.device}
              </Text>
            )}
          </View>
        )}
      </View>
      
      {onPress && (
        <Ionicons name="chevron-forward" size={20} color="#ccc" />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    flex: 1,
    marginRight: 12,
  },
  amount: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  incomeText: {
    color: '#28a745',
  },
  expenseText: {
    color: '#dc3545',
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  time: {
    fontSize: 12,
    color: '#999',
  },
  device: {
    fontSize: 12,
    color: '#999',
    marginLeft: 8,
  },
});

export default ActivityItem;