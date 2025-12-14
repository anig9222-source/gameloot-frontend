import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLanguage } from '../../contexts/LanguageContext';
import LanguageSelectorButton from '../../components/LanguageSelectorButton';
import AdSenseBanner from '../../components/AdSenseBanner';
import AdSenseInFeed from '../../components/AdSenseInFeed';
import AdSenseMultiplex from '../../components/AdSenseMultiplex';

// Platform data structure
interface Platform {
  id: string;
  name: string;
  category: string;
  description_en: string;
  description_sq: string;
  payRange_en: string;
  payRange_sq: string;
  requirements_en: string[];
  requirements_sq: string[];
  url: string;
  icon: keyof typeof Ionicons.glyphMap;
  bgColor: string;
  bestFor: 'albania' | 'diaspora' | 'both';
}

const PLATFORMS: Platform[] = [
  // SHKRIM & PËRKTHIM
  {
    id: 'fiverr',
    name: 'Fiverr',
    category: 'writing',
    description_en: 'Freelance marketplace for writing, translation, and creative services',
    description_sq: 'Platforma freelance për shkrim, përkthim dhe shërbime kreative',
    payRange_en: '$5 - $500+ per project',
    payRange_sq: '$5 - $500+ për projekt',
    requirements_en: ['Portfolio', 'Good English', 'Creativity'],
    requirements_sq: ['Portfolio', 'Anglisht i mirë', 'Kreativitet'],
    url: 'https://www.fiverr.com/?utm_source=gameloot',
    icon: 'briefcase',
    bgColor: '#1DBF73',
    bestFor: 'both',
  },
  {
    id: 'upwork',
    name: 'Upwork',
    category: 'writing',
    description_en: 'Top freelance platform for writing, translation, and professional services',
    description_sq: 'Platforma kryesore freelance për shkrim, përkthim dhe shërbime profesionale',
    payRange_en: '$10 - $100+/hour',
    payRange_sq: '$10 - $100+/orë',
    requirements_en: ['Professional profile', 'Portfolio', 'English fluency'],
    requirements_sq: ['Profil profesional', 'Portfolio', 'Anglisht të lirshëm'],
    url: 'https://www.upwork.com/',
    icon: 'document-text',
    bgColor: '#6FDA44',
    bestFor: 'diaspora',
  },
  {
    id: 'rev',
    name: 'Rev',
    category: 'writing',
    description_en: 'Transcription and caption services - get paid per audio/video minute',
    description_sq: 'Shërbime transkriptimi dhe titra - paguaj për çdo minutë audio/video',
    payRange_en: '$0.30 - $1.10 per minute',
    payRange_sq: '$0.30 - $1.10 për minutë',
    requirements_en: ['English typing', 'Good grammar', 'Attention to detail'],
    requirements_sq: ['Typing në anglisht', 'Gramatikë e mirë', 'Vëmendje për detaje'],
    url: 'https://www.rev.com/freelancers',
    icon: 'mic',
    bgColor: '#FF6B6B',
    bestFor: 'both',
  },
  {
    id: 'scribie',
    name: 'Scribie',
    category: 'writing',
    description_en: 'Audio transcription - flexible hours, work from anywhere',
    description_sq: 'Transkriptim audio - orë fleksibël, puno nga kudo',
    payRange_en: '$5 - $25 per audio hour',
    payRange_sq: '$5 - $25 për orë audio',
    requirements_en: ['Fast typing', 'English', 'Headphones'],
    requirements_sq: ['Typing i shpejtë', 'Anglisht', 'Kufje'],
    url: 'https://scribie.com/freelance-transcription',
    icon: 'headset',
    bgColor: '#4ECDC4',
    bestFor: 'both',
  },

  // DESIGN & KREATIV
  {
    id: '99designs',
    name: '99designs',
    category: 'design',
    description_en: 'Design contests and projects - logos, graphics, web design',
    description_sq: 'Konkurse dhe projekte dizajni - logo, grafika, web design',
    payRange_en: '$100 - $1000+ per project',
    payRange_sq: '$100 - $1000+ për projekt',
    requirements_en: ['Design portfolio', 'Adobe/Figma skills', 'Creativity'],
    requirements_sq: ['Portfolio dizajni', 'Adobe/Figma skills', 'Kreativitet'],
    url: 'https://99designs.com/designers',
    icon: 'color-palette',
    bgColor: '#FF6600',
    bestFor: 'both',
  },
  {
    id: 'designcrowd',
    name: 'DesignCrowd',
    category: 'design',
    description_en: 'Crowdsourced design platform - compete for projects',
    description_sq: 'Platforma dizajni crowdsourced - garojë për projekte',
    payRange_en: '$50 - $500+ per project',
    payRange_sq: '$50 - $500+ për projekt',
    requirements_en: ['Design skills', 'Portfolio', 'Fast turnaround'],
    requirements_sq: ['Skills dizajni', 'Portfolio', 'Dorëzim i shpejtë'],
    url: 'https://www.designcrowd.com/designer',
    icon: 'brush',
    bgColor: '#9B59B6',
    bestFor: 'both',
  },
  {
    id: 'canva',
    name: 'Canva',
    category: 'design',
    description_en: 'Create and sell design templates on Canva marketplace',
    description_sq: 'Krijo dhe shit templates dizajni në Canva marketplace',
    payRange_en: '$1 - $10 per template sale',
    payRange_sq: '$1 - $10 për shitje template',
    requirements_en: ['Canva Pro', 'Design sense', 'Market research'],
    requirements_sq: ['Canva Pro', 'Sens dizajni', 'Kërkimi i tregut'],
    url: 'https://www.canva.com/creators/',
    icon: 'images',
    bgColor: '#00C4CC',
    bestFor: 'both',
  },

  // VIDEO & AUDIO
  {
    id: 'voices',
    name: 'Voices.com',
    category: 'video',
    description_en: 'Voice-over work - audiobooks, commercials, videos',
    description_sq: 'Punë voice-over - audiobooks, reklama, video',
    payRange_en: '$100 - $500+ per project',
    payRange_sq: '$100 - $500+ për projekt',
    requirements_en: ['Good voice', 'Recording equipment', 'Demo reel'],
    requirements_sq: ['Zë i mirë', 'Pajisje regjistrimi', 'Demo reel'],
    url: 'https://www.voices.com/talent',
    icon: 'mic-circle',
    bgColor: '#E74C3C',
    bestFor: 'diaspora',
  },
  {
    id: 'videopixie',
    name: 'VideoPixie',
    category: 'video',
    description_en: 'Video editing for businesses - remote work',
    description_sq: 'Editim video për biznese - punë remote',
    payRange_en: '$20 - $50 per video',
    payRange_sq: '$20 - $50 për video',
    requirements_en: ['Video editing', 'Adobe Premiere/Final Cut', 'Fast delivery'],
    requirements_sq: ['Editim video', 'Adobe Premiere/Final Cut', 'Dorëzim i shpejtë'],
    url: 'https://www.videopixie.com/videographers',
    icon: 'videocam',
    bgColor: '#3498DB',
    bestFor: 'both',
  },
  {
    id: 'youtube',
    name: 'YouTube Partner',
    category: 'video',
    description_en: 'Create content and monetize with ads, sponsorships',
    description_sq: 'Krijo përmbajtje dhe monetizo me ads, sponsorships',
    payRange_en: '$1 - $10 per 1000 views',
    payRange_sq: '$1 - $10 për 1000 shikime',
    requirements_en: ['1000 subscribers', '4000 watch hours', 'Original content'],
    requirements_sq: ['1000 subscribers', '4000 orë shikime', 'Përmbajtje origjinale'],
    url: 'https://www.youtube.com/creators/',
    icon: 'logo-youtube',
    bgColor: '#FF0000',
    bestFor: 'both',
  },
];

const CATEGORIES = [
  { id: 'all', name_en: 'All', name_sq: 'Të gjitha', icon: 'apps' as const },
  { id: 'writing', name_en: 'Writing & Translation', name_sq: 'Shkrim & Përkthim', icon: 'document-text' as const },
  { id: 'design', name_en: 'Design & Creative', name_sq: 'Design & Kreativ', icon: 'color-palette' as const },
  { id: 'video', name_en: 'Video & Audio', name_sq: 'Video & Audio', icon: 'videocam' as const },
];

export default function OpportunitiesScreen() {
  const { t, currentLanguage } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredPlatforms = selectedCategory === 'all'
    ? PLATFORMS
    : PLATFORMS.filter(p => p.category === selectedCategory);

  const handleOpenPlatform = async (platform: Platform) => {
    try {
      // Direct open - simpler and more reliable
      await Linking.openURL(platform.url);
      
      // Track in background (don't wait for it)
      try {
        const backendUrl = process.env.EXPO_PUBLIC_BACKEND_URL || '';
        fetch(`${backendUrl}/api/r/${platform.id}`, { method: 'POST' }).catch(() => {});
      } catch (e) {
        // Ignore tracking errors
      }
    } catch (error) {
      Alert.alert(
        currentLanguage === 'sq' ? 'Gabim' : 'Error',
        currentLanguage === 'sq'
          ? 'Nuk mund të hapet linku. Ju lutem provoni përsëri.'
          : 'Cannot open link. Please try again.',
      );
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          {currentLanguage === 'sq' ? 'Mundësi Pune' : 'Work Opportunities'}
        </Text>
      </View>

      {/* Description */}
      <View style={styles.descriptionCard}>
        <Ionicons name="bulb" size={32} color="#FFD700" />
        <Text style={styles.descriptionText}>
          {currentLanguage === 'sq'
            ? 'Zbulo platforma ku mund të fitosh para duke punuar online nga shtëpia!'
            : 'Discover platforms where you can earn money working online from home!'}
        </Text>
      </View>
      
      {/* 🔥 AD #1: Top Banner */}
      <AdSenseBanner slot="3234567890" format="responsive" />

      {/* Category Filter */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoryScroll}
        contentContainerStyle={styles.categoryContainer}
      >
        {CATEGORIES.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.categoryButton,
              selectedCategory === category.id && styles.categoryButtonActive,
            ]}
            onPress={() => setSelectedCategory(category.id)}
          >
            <Ionicons
              name={category.icon}
              size={20}
              color={selectedCategory === category.id ? '#FFF' : '#888'}
            />
            <Text
              style={[
                styles.categoryButtonText,
                selectedCategory === category.id && styles.categoryButtonTextActive,
              ]}
            >
              {currentLanguage === 'sq' ? category.name_sq : category.name_en}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Platforms List */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.platformsList}
        showsVerticalScrollIndicator={false}
      >
        {filteredPlatforms.map((platform) => (
          <TouchableOpacity
            key={platform.id}
            style={styles.platformCard}
            onPress={() => handleOpenPlatform(platform)}
            activeOpacity={0.8}
          >
            {/* Platform Icon & Name */}
            <View style={styles.platformHeader}>
              <View style={[styles.platformIcon, { backgroundColor: platform.bgColor }]}>
                <Ionicons name={platform.icon} size={28} color="#FFF" />
              </View>
              <View style={styles.platformInfo}>
                <Text style={styles.platformName}>{platform.name}</Text>
                <Text style={styles.platformPay}>
                  {currentLanguage === 'sq' ? platform.payRange_sq : platform.payRange_en}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color="#888" />
            </View>

            {/* Description */}
            <Text style={styles.platformDescription}>
              {currentLanguage === 'sq' ? platform.description_sq : platform.description_en}
            </Text>

            {/* Requirements */}
            <View style={styles.requirementsContainer}>
              {(currentLanguage === 'sq' ? platform.requirements_sq : platform.requirements_en).map((req, index) => (
                <View key={index} style={styles.requirementTag}>
                  <Ionicons name="checkmark-circle" size={14} color="#4CAF50" />
                  <Text style={styles.requirementText}>{req}</Text>
                </View>
              ))}
            </View>

            {/* Best For Badge */}
            {platform.bestFor !== 'both' && (
              <View style={styles.bestForBadge}>
                <Text style={styles.bestForText}>
                  {platform.bestFor === 'albania'
                    ? currentLanguage === 'sq' ? '🇦🇱 Për Shqipëri' : '🇦🇱 For Albania'
                    : currentLanguage === 'sq' ? '🌍 Për Diaspora' : '🌍 For Diaspora'}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        ))}

        {/* 🔥 AD #2: In-Feed Ad (Between content) */}
        <AdSenseInFeed slot="3234567891" />
        
        {/* Footer Info */}
        <View style={styles.footerInfo}>
          <Ionicons name="information-circle" size={20} color="#888" />
          <Text style={styles.footerText}>
            {currentLanguage === 'sq'
              ? 'Këto janë platforma të jashtme. GameLoot nuk menaxhon pagesat ose kontaktet.'
              : 'These are external platforms. GameLoot does not manage payments or contracts.'}
          </Text>
        </View>
        
        {/* 🔥 AD #3: Multiplex Recommendation Grid */}
        <AdSenseMultiplex slot="5234567890" rows={2} columns={2} />
        
        {/* 🔥 AD #4: Bottom Banner */}
        <AdSenseBanner slot="3234567892" format="responsive" />

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#111',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  descriptionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    margin: 20,
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  descriptionText: {
    flex: 1,
    fontSize: 14,
    color: '#ccc',
    lineHeight: 20,
  },
  categoryScroll: {
    maxHeight: 60,
  },
  categoryContainer: {
    paddingHorizontal: 20,
    gap: 12,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#1a1a1a',
    borderRadius: 20,
    gap: 8,
  },
  categoryButtonActive: {
    backgroundColor: '#FF6B6B',
  },
  categoryButtonText: {
    fontSize: 14,
    color: '#888',
    fontWeight: '600',
  },
  categoryButtonTextActive: {
    color: '#FFF',
  },
  scrollView: {
    flex: 1,
  },
  platformsList: {
    padding: 20,
    gap: 16,
  },
  platformCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#333',
  },
  platformHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  platformIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  platformInfo: {
    flex: 1,
  },
  platformName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  platformPay: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '600',
  },
  platformDescription: {
    fontSize: 14,
    color: '#aaa',
    lineHeight: 20,
    marginBottom: 12,
  },
  requirementsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  requirementTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2a2a2a',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 4,
  },
  requirementText: {
    fontSize: 12,
    color: '#ccc',
  },
  bestForBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#2a2a2a',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  bestForText: {
    fontSize: 12,
    color: '#FFD700',
    fontWeight: '600',
  },
  footerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    padding: 16,
    borderRadius: 12,
    gap: 12,
    marginTop: 20,
  },
  footerText: {
    flex: 1,
    fontSize: 12,
    color: '#888',
    lineHeight: 18,
  },
});
