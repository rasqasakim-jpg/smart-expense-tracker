import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Ioncons from '@react-native-vector-icons/ionicons';

interface ScreenHeaderProps {
  title: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
  rightComponent?: React.ReactNode;
}

const ScreenHeader: React.FC<ScreenHeaderProps> = ({
  title,
  showBackButton = false,
  onBackPress,
  rightComponent,
}) => {
  return (
    <View style={styles.header}>
      <View style={styles.leftSection}>
        {showBackButton && (
          <TouchableOpacity 
            onPress={onBackPress} 
            style={styles.backButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ioncons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
        )}
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
      </View>
      
      {rightComponent && (
        <View style={styles.rightSection}>
          {rightComponent}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eaeaea',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  backButton: {
    marginRight: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    flex: 1,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default ScreenHeader;