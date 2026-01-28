import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import Ionicons from '@react-native-vector-icons/ionicons';
import ScreenHeader from '../../components/layout/ScreenHeader';

type ProfileStackParamList = {
  Language: undefined;
};

type LanguageScreenNavigationProp = StackNavigationProp<
  ProfileStackParamList,
  'Language'
>;

interface Props {
  navigation: LanguageScreenNavigationProp;
}

interface LanguageOption {
  id: string;
  name: string;
  nativeName: string;
  code: string;
  available: boolean;
}

const LanguageScreen: React.FC<Props> = ({ navigation }) => {
  const [selectedLanguage, setSelectedLanguage] = useState('id-ID');

  const languageOptions: LanguageOption[] = [
    {
      id: 'id-ID',
      name: 'Indonesian',
      nativeName: 'Bahasa Indonesia',
      code: 'ID',
      available: true,
    },
    {
      id: 'en-US',
      name: 'English',
      nativeName: 'English (US)',
      code: 'EN',
      available: false, // Coming soon
    },
    {
      id: 'es-ES',
      name: 'Spanish',
      nativeName: 'Español',
      code: 'ES',
      available: false,
    },
    {
      id: 'ar-SA',
      name: 'Arabic',
      nativeName: 'العربية',
      code: 'AR',
      available: false,
    },
    {
      id: 'zh-CN',
      name: 'Chinese',
      nativeName: '中文',
      code: 'ZH',
      available: false,
    },
    {
      id: 'ja-JP',
      name: 'Japanese',
      nativeName: '日本語',
      code: 'JA',
      available: false,
    },
  ];

  const handleLanguageSelect = (languageId: string) => {
    const language = languageOptions.find(lang => lang.id === languageId);
    
    if (!language?.available) {
      Alert.alert(
        'Coming Soon',
        'Fitur bahasa ini akan segera hadir dalam update berikutnya',
        [{ text: 'OK' }]
      );
      return;
    }
    
    setSelectedLanguage(languageId);
    Alert.alert(
      'Bahasa Diubah',
      `Bahasa aplikasi diubah ke ${language.nativeName}`,
      [{ text: 'OK' }]
    );
  };

  const getCurrentLanguage = () => {
    return languageOptions.find(lang => lang.id === selectedLanguage);
  };

  const currentLanguage = getCurrentLanguage();

  return (
    <View style={styles.container}>
      <ScreenHeader
        title="Bahasa"
        showBackButton
        onBackPress={() => navigation.goBack()}
      />

      <ScrollView contentContainerStyle={styles.content}>
        {/* Current Language Info */}
        <View style={styles.currentLanguageCard}>
          <View style={styles.currentLanguageHeader}>
            <Ionicons name="language" size={24} color="#007bff" />
            <Text style={styles.currentLanguageTitle}>Bahasa Saat Ini</Text>
          </View>
          
          <View style={styles.currentLanguageInfo}>
            <View style={styles.currentLanguageFlag}>
              <Text style={styles.flagText}>🇮🇩</Text>
            </View>
            <View style={styles.currentLanguageDetails}>
              <Text style={styles.currentLanguageName}>
                {currentLanguage?.nativeName}
              </Text>
              <Text style={styles.currentLanguageDesc}>
                Aplikasi saat ini menggunakan {currentLanguage?.nativeName}
              </Text>
            </View>
          </View>
        </View>

        {/* Language Options */}
        <View style={styles.languageList}>
          <Text style={styles.sectionTitle}>Pilih Bahasa Lain</Text>
          
          {languageOptions
            .filter(lang => lang.id !== selectedLanguage)
            .map(language => (
              <TouchableOpacity
                key={language.id}
                style={[
                  styles.languageItem,
                  !language.available && styles.languageItemDisabled,
                ]}
                onPress={() => handleLanguageSelect(language.id)}
                disabled={!language.available}
              >
                <View style={styles.languageItemLeft}>
                  <View style={styles.languageFlag}>
                    <Text style={styles.flagText}>
                      {language.code === 'ID' ? '🇮🇩' :
                       language.code === 'EN' ? '🇺🇸' :
                       language.code === 'ES' ? '🇪🇸' :
                       language.code === 'AR' ? '🇸🇦' :
                       language.code === 'ZH' ? '🇨🇳' : '🇯🇵'}
                    </Text>
                  </View>
                  <View style={styles.languageInfo}>
                    <Text style={styles.languageName}>{language.nativeName}</Text>
                    <Text style={styles.languageEnglish}>{language.name}</Text>
                  </View>
                </View>
                
                <View style={styles.languageItemRight}>
                  {!language.available && (
                    <View style={styles.comingSoonBadge}>
                      <Text style={styles.comingSoonText}>Coming Soon</Text>
                    </View>
                  )}
                  {language.available && selectedLanguage === language.id && (
                    <Ionicons name="checkmark-circle" size={24} color="#007bff" />
                  )}
                </View>
              </TouchableOpacity>
            ))}
        </View>

        {/* Info Box */}
        <View style={styles.infoBox}>
          <Ionicons name="information-outline" size={20} color="#666" />
          <Text style={styles.infoText}>
            Bahasa Indonesia adalah satu-satunya bahasa yang tersedia saat ini.
            Bahasa lain akan ditambahkan dalam update berikutnya.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    paddingTop: 50
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  currentLanguageCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  currentLanguageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  currentLanguageTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginLeft: 12,
  },
  currentLanguageInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  currentLanguageFlag: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  flagText: {
    fontSize: 28,
  },
  currentLanguageDetails: {
    flex: 1,
  },
  currentLanguageName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  currentLanguageDesc: {
    fontSize: 14,
    color: '#666',
  },
  languageList: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    marginBottom: 16,
  },
  languageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  languageItemDisabled: {
    opacity: 0.6,
  },
  languageItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  languageFlag: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  languageInfo: {
    flex: 1,
  },
  languageName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 2,
  },
  languageEnglish: {
    fontSize: 14,
    color: '#666',
  },
  languageItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  comingSoonBadge: {
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  comingSoonText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});

export default LanguageScreen;