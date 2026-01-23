import { ActivityLog, ActivitySection, ActivityType } from '../types/activity';

// Format timestamp ke readable format (tanpa date-fns)
export const formatActivityTime = (timestamp: string): string => {
  const date = new Date(timestamp);
  const now = new Date();
  
  // Set time to 00:00:00 for date comparison
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const thisWeek = new Date(today);
  thisWeek.setDate(thisWeek.getDate() - 7);
  
  const activityDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  
  // Month names in Indonesian
  const monthNames = [
    'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
    'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'
  ];
  
  if (isSameDay(activityDate, today)) {
    // Today - show time only
    return formatTime(date);
  } else if (isSameDay(activityDate, yesterday)) {
    // Yesterday
    return `Kemarin, ${formatTime(date)}`;
  } else if (activityDate >= thisWeek) {
    // This week - show day and time
    const dayNames = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const dayName = dayNames[date.getDay()];
    return `${dayName}, ${formatTime(date)}`;
  } else {
    // Other dates
    const day = date.getDate();
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
    return `${day} ${month} ${year}, ${formatTime(date)}`;
  }
};

// Helper untuk format waktu HH:mm
const formatTime = (date: Date): string => {
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
};

// Helper untuk format tanggal d MMM yyyy
const formatDate = (date: Date): string => {
  const monthNames = [
    'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
    'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'
  ];
  const day = date.getDate();
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
};

// Group activities by date
export const groupActivitiesByDate = (activities: ActivityLog[]): ActivitySection[] => {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  const thisWeek = new Date(today);
  thisWeek.setDate(thisWeek.getDate() - 7);
  
  const thisMonth = new Date(today);
  thisMonth.setMonth(thisMonth.getMonth() - 1);
  
  const todayActivities: ActivityLog[] = [];
  const yesterdayActivities: ActivityLog[] = [];
  const weekActivities: ActivityLog[] = [];
  const monthActivities: ActivityLog[] = [];
  const olderActivities: ActivityLog[] = [];
  
  activities.forEach(activity => {
    const activityDate = new Date(activity.timestamp);
    const normalizedDate = new Date(activityDate.getFullYear(), activityDate.getMonth(), activityDate.getDate());
    
    if (isSameDay(normalizedDate, today)) {
      todayActivities.push(activity);
    } else if (isSameDay(normalizedDate, yesterday)) {
      yesterdayActivities.push(activity);
    } else if (normalizedDate >= thisWeek && normalizedDate < yesterday) {
      weekActivities.push(activity);
    } else if (normalizedDate >= thisMonth && normalizedDate < thisWeek) {
      monthActivities.push(activity);
    } else {
      olderActivities.push(activity);
    }
  });
  
  const sections: ActivitySection[] = [];
  
  if (todayActivities.length > 0) {
    sections.push({
      title: 'Hari Ini',
      data: todayActivities,
    });
  }
  
  if (yesterdayActivities.length > 0) {
    sections.push({
      title: 'Kemarin',
      data: yesterdayActivities,
    });
  }
  
  if (weekActivities.length > 0) {
    sections.push({
      title: 'Minggu Ini',
      data: weekActivities,
    });
  }
  
  if (monthActivities.length > 0) {
    sections.push({
      title: 'Bulan Ini',
      data: monthActivities,
    });
  }
  
  if (olderActivities.length > 0) {
    sections.push({
      title: 'Lebih Lama',
      data: olderActivities,
    });
  }
  
  return sections;
};

// Helper untuk cek apakah tanggal sama
const isSameDay = (date1: Date, date2: Date): boolean => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};

// Get icon berdasarkan activity type (gunakan react-native-vector-icons/Feather)
export const getActivityIcon = (type: ActivityType): { name: string; color: string } => {
  switch (type) {
    case 'LOGIN':
      return { name: 'log-in', color: '#28a745' }; // Green
    case 'REGISTER':
      return { name: 'user-plus', color: '#007bff' }; // Blue
    case 'TRANSACTION_CREATE':
      return { name: 'plus-circle', color: '#6f42c1' }; // Purple
    case 'TRANSACTION_UPDATE':
      return { name: 'edit-2', color: '#ffc107' }; // Yellow
    case 'TRANSACTION_DELETE':
      return { name: 'trash-2', color: '#dc3545' }; // Red
    case 'WALLET_CREATE':
      return { name: 'credit-card', color: '#17a2b8' }; // Cyan
    case 'WALLET_UPDATE':
      return { name: 'refresh-cw', color: '#fd7e14' }; // Orange
    case 'WALLET_DELETE':
      return { name: 'x-circle', color: '#dc3545' }; // Red
    case 'CATEGORY_CREATE':
      return { name: 'folder-plus', color: '#20c997' }; // Teal
    case 'CATEGORY_UPDATE':
      return { name: 'folder', color: '#6c757d' }; // Gray
    case 'CATEGORY_DELETE':
      return { name: 'folder-minus', color: '#dc3545' }; // Red
    case 'PROFILE_UPDATE':
      return { name: 'user', color: '#e83e8c' }; // Pink
    case 'OTP_SENT':
      return { name: 'mail', color: '#007bff' }; // Blue
    case 'PASSWORD_RESET':
      return { name: 'lock', color: '#28a745' }; // Green
    case 'SYSTEM':
      return { name: 'settings', color: '#6c757d' }; // Gray
    default:
      return { name: 'activity', color: '#007bff' };
  }
};

// Get readable title berdasarkan type
export const getActivityTitle = (type: ActivityType, metadata?: Record<string, any>): string => {
  switch (type) {
    case 'LOGIN':
      return 'Login berhasil';
    case 'REGISTER':
      return 'Registrasi akun baru';
    case 'TRANSACTION_CREATE':
      return `Tambah transaksi: ${metadata?.description || 'Transaksi baru'}`;
    case 'TRANSACTION_UPDATE':
      return `Update transaksi: ${metadata?.description || 'Transaksi'}`;
    case 'TRANSACTION_DELETE':
      return `Hapus transaksi: ${metadata?.description || 'Transaksi'}`;
    case 'WALLET_CREATE':
      return `Buat wallet: ${metadata?.name || 'Wallet baru'}`;
    case 'WALLET_UPDATE':
      return `Update wallet: ${metadata?.name || 'Wallet'}`;
    case 'WALLET_DELETE':
      return `Hapus wallet: ${metadata?.name || 'Wallet'}`;
    case 'CATEGORY_CREATE':
      return `Buat kategori: ${metadata?.name || 'Kategori baru'}`;
    case 'CATEGORY_UPDATE':
      return `Update kategori: ${metadata?.name || 'Kategori'}`;
    case 'CATEGORY_DELETE':
      return `Hapus kategori: ${metadata?.name || 'Kategori'}`;
    case 'PROFILE_UPDATE':
      return 'Update profil';
    case 'OTP_SENT':
      return 'OTP dikirim ke email';
    case 'PASSWORD_RESET':
      return 'Reset password';
    case 'SYSTEM':
      return 'Aktivitas sistem';
    default:
      return 'Aktivitas';
  }
};