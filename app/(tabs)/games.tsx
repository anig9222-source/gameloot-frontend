import React, { useState, useEffect } from 'react';
import { useAudio } from '../../contexts/AudioContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { useRouter } from 'expo-router';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  Animated,
  Modal,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import api from '../../utils/api';
import AdSenseBanner from '../../components/AdSenseBanner';
import AdSenseInFeed from '../../components/AdSenseInFeed';
import AdSenseNative from '../../components/AdSenseNative';
import AdSenseRewardModal from '../../components/AdSenseRewardModal';
import AdSensePlaceholder from '../../components/AdSensePlaceholder';
import { useAdRevenue } from '../../contexts/AdRevenueContext';

// Quiz questions database
const QUIZ_QUESTIONS = [
  {
    question: "Cili është Kryeqyteti i Shqipërisë?",
    options: ["Tirana", "Durrësi", "Vlora", "Shkodra"],
    correct: 0,
    category: "Kultura"
  },
  {
    question: "Sa kontinente ka në botë?",
    options: ["5", "6", "7", "8"],
    correct: 2,
    category: "Kultura"
  },
  {
    question: "Cili është planeti më i madh në sistemin diellor?",
    options: ["Toka", "Marsi", "Jupiteri", "Saturni"],
    correct: 2,
    category: "Shkencë"
  },
  {
    question: "Në cilin vit u themelua Google?",
    options: ["1996", "1998", "2000", "2002"],
    correct: 1,
    category: "Teknologji"
  },
  {
    question: "Sa lojtarë ka në një ekip futbolli?",
    options: ["10", "11", "12", "13"],
    correct: 1,
    category: "Sport"
  },
  {
    question: "Cili është oqeani më i madh?",
    options: ["Atlantiku", "Indiani", "Arktiku", "Paqësorit"],
    correct: 3,
    category: "Gjeografi"
  },
  {
    question: "Kush shkroi 'Hamlet'?",
    options: ["Dante", "Shakespeare", "Homer", "Tolstoy"],
    correct: 1,
    category: "Letërsi"
  },
  {
    question: "Sa është 15 x 8?",
    options: ["110", "115", "120", "125"],
    correct: 2,
    category: "Matematikë"
  }
];

// Emerald-themed sectors around a golden center
const SPIN_SECTORS = [
  { value: 0.10, color: '#004D40' }, // dark emerald
  { value: 0.50, color: '#00695C' },
  { value: 1.00, color: '#00796B' },
  { value: 0.10, color: '#00897B' },
  { value: 2.00, color: '#009688' },
  { value: 0.50, color: '#26A69A' },
  { value: 5.00, color: '#4DB6AC' },
  { value: 0.10, color: '#80CBC4' },
];

export default function Games() {
  const { playWin, playLoss, playJackpot } = useAudio();
  const { t } = useLanguage();
  const router = useRouter();
  const { addWinTokens, todayWinTokens, totalWinTokens, adsWatched, todayUSD, totalUSD, refreshFromBackend } = useAdRevenue();
  
  // State declarations - MUST come before useEffect that uses them
  const [loading, setLoading] = useState(false);
  const [tapCount, setTapCount] = useState(0);
  const [lastReward, setLastReward] = useState<number | null>(null);
  const [adLoading, setAdLoading] = useState(false);
  const [adCountdown, setAdCountdown] = useState(5);
  const [spinRotation] = useState(new Animated.Value(0));
  const scaleAnim = new Animated.Value(1);
  
  // State for storing game result to show in Alert (fix scope issue)
  const [gameResult, setGameResult] = useState<{
    earned: number;
    pending: number;
    winTokens: number;
    totalRevenue?: number;
    liquidity?: number;
    geoInfo?: string;
  } | null>(null);
  
  // Initialize component
  useEffect(() => {
    // Component mounted
    console.log('[Games] Component mounted');
  }, []);
  
  // Show Alert when game result is available (fixes scope issue)
  useEffect(() => {
    if (gameResult && gameResult.earned > 0) {
      Alert.alert(
        '✅ E Fituar!',
        `💰 Reklama gjeneroi: $${gameResult.totalRevenue?.toFixed(4) || gameResult.earned.toFixed(4)} USD\n\n` +
        `🎁 Ju fituat (60%): $${gameResult.earned.toFixed(4)} USD\n` +
        `🪙 WIN Tokens: ${gameResult.winTokens}\n` +
        `💧 Liquidity (40%): $${gameResult.liquidity?.toFixed(4) || (gameResult.earned * 0.67).toFixed(4)} USD\n\n` +
        `📊 Total Balance: $${gameResult.pending.toFixed(4)} USD` +
        (gameResult.geoInfo ? `\n\n${gameResult.geoInfo}` : ''),
        [
          { 
            text: 'Shiko Dashboard', 
            onPress: () => {
              setGameResult(null); // Clear result
              router.push('/(tabs)/dashboard');
            }
          },
          { 
            text: 'Loja Tjetër', 
            style: 'cancel',
            onPress: () => setGameResult(null) // Clear result
          }
        ]
      );
    }
  }, [gameResult]);
  
  // Quiz state
  const [quizModalVisible, setQuizModalVisible] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [quizQuestions, setQuizQuestions] = useState<typeof QUIZ_QUESTIONS>([]);
  
  // Spin Wheel state
  const [spinModalVisible, setSpinModalVisible] = useState(false);
  const [spinning, setSpinning] = useState(false);
  const [selectedSector, setSelectedSector] = useState<number | null>(null);
  
  // Slot Machine - REMOVED (not wanted)
  
  // Ad Choice Modal state
  const [adSenseModalVisible, setAdSenseModalVisible] = useState(false);
  const [currentGameType, setCurrentGameType] = useState('');
  const [isWatchAgain, setIsWatchAgain] = useState(false); // Track if watch again
  
  // Ad Result Modal state
  // Removed old AdResult modal - using AdSense now
  const [earnedUsd, setEarnedUsd] = useState(0);
  const [pendingRevenueUsd, setPendingRevenueUsd] = useState(0);

  const showAdLoadingAnimation = async () => {
    setAdLoading(true);
    // Real AdMob rewarded video ads: 15-30 seconds (using 20 as average)
    setAdCountdown(20);
    
    // Countdown from 20 to 0 (simulating real ad duration)
    for (let i = 20; i > 0; i--) {
      setAdCountdown(i);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    setAdLoading(false);
  };

  const startQuiz = () => {
    // Shuffle and pick 5 random questions
    const shuffled = [...QUIZ_QUESTIONS].sort(() => 0.5 - Math.random());
    setQuizQuestions(shuffled.slice(0, 5));
    setCurrentQuestion(0);
    setQuizScore(0);
    setSelectedAnswer(null);
    setQuizModalVisible(true);
  };

  const handleQuizAnswer = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    
    setTimeout(() => {
      if (answerIndex === quizQuestions[currentQuestion].correct) {
        setQuizScore(quizScore + 1);
      }
      
      if (currentQuestion + 1 < quizQuestions.length) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
      } else {
        // Quiz finished
        setTimeout(() => {
          setQuizModalVisible(false);
          // Play the quiz game with backend
          playGame('quiz');
        }, 1000);
      }
    }, 1000);
  };

  const playGame = (gameType: string) => {
    // Show AdSense modal INSTANTLY
    setCurrentGameType(gameType);
    setAdSenseModalVisible(true);
  };
  
  const handleWatchAdSense = async () => {
    // User chose to watch AdSense ad
    setAdSenseModalVisible(false);
    setLoading(true);
    
    // Simulate AdSense ad watch (15-30 seconds)
    // In production, real AdSense ads will play here
    setTimeout(() => {
      handleGameComplete(true); // true = watched ad
    }, 1500); // Demo delay
  };
  
  const handleSkipAd = () => {
    // User chose to skip ad
    setAdSenseModalVisible(false);
    handleGameComplete(false); // false = skipped ad
  };

  const handleGameComplete = async (watchedAd: boolean) => {
    // Process game completion with backend
    setLoading(true);
    
    try {
      // **Track game play in backend**
      const response = await api.post('/game/play', {
        game_type: currentGameType,
        ad_watched: watchedAd,
        watch_again: isWatchAgain, // Pass watch again flag
      });
      
      const earned_usd = response.data.earned_usd || 0;  // User's 60% share
      const total_revenue = response.data.total_revenue_usd || earned_usd;  // Total ad revenue
      const liquidity_usd = response.data.liquidity_usd || 0;  // 40% to liquidity
      const win_tokens = response.data.win_tokens || 0;  // WIN tokens from backend
      const pending_revenue = response.data.pending_revenue_usd || 0;
      const geo_info = response.data.geo_info || '';  // Country + CPM info
      
      setLastReward(earned_usd);
      setEarnedUsd(earned_usd);
      setPendingRevenueUsd(pending_revenue);
      
      // Track WIN tokens if user watched ad
      if (watchedAd && win_tokens > 0) {
        addWinTokens(win_tokens, 'modal');
        console.log(`💰 [WIN] Tracked ${win_tokens} WIN tokens from $${earned_usd.toFixed(4)} ad revenue (60% share)`);
        console.log(`🌍 [GEO] ${geo_info}`);
        console.log(`💧 [LIQUIDITY] $${liquidity_usd.toFixed(4)} (40% share)`);
      }
      
      // Store result in state to avoid scope issues in setTimeout
      setGameResult({
        earned: earned_usd,
        pending: pending_revenue,
        winTokens: win_tokens,
        totalRevenue: total_revenue,
        liquidity: liquidity_usd,
        geoInfo: geo_info
      });
      
      // Success Animation
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.2,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();

      setLoading(false);
      
      // 🔄 REFRESH DATA FROM BACKEND - Updates stats automatically!
      await refreshFromBackend();
      console.log('✅ [AUTO-REFRESH] Stats updated from backend');
      
    } catch (error: any) {
      console.error('Ad reward error:', error);
      setLoading(false);
      Alert.alert(
        'Gabim',
        error.response?.data?.detail || 'Diçka shkoi keq. Provoni përsëri.'
      );
    }
  };
  
  // Removed old handleCloseResult and duplicate handleSkipAd

  const handleTap = () => {
    if (loading) return;
    setTapCount(prev => prev + 1);
    if (tapCount + 1 >= 10) {
      playGame('tap');
      setTapCount(0);
    }
  };

  const handleSpin = () => {
    if (loading) return;
    setSpinModalVisible(true);
  };

  const spinWheel = async () => {
    if (spinning) return;
    
    setSpinning(true);
    setSelectedSector(null);
    
    // Random sector (0-7)
    const randomSector = Math.floor(Math.random() * 8);
    
    // Spin animation
    spinRotation.setValue(0);
    await new Promise(resolve => {
      Animated.timing(spinRotation, {
        toValue: 5 + (randomSector / 8), // 5 full rotations + land on sector
        duration: 3000,
        useNativeDriver: true,
      }).start(resolve);
    });
    
    setSelectedSector(randomSector);
    setSpinning(false);
    
    // Show result
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSpinModalVisible(false);
    
    // Offer ad choice
    playGame('spin');
  };

  const handleQuiz = () => {
    if (loading) return;
    startQuiz();
  };

  // Slot Machine functions - REMOVED (not wanted)

  const spin = spinRotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  });

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>{t('games.title')}</Text>
        <Text style={styles.subtitle}>{t('games.subtitle')}</Text>
        
        {/* 💰 WIN Balance - Locked until KYC */}
        <View style={styles.revenueCard}>
          <View style={styles.revenueHeader}>
            <Ionicons name="wallet" size={24} color="#FFD700" />
            <Text style={styles.revenueTitle}>🪙 WIN Token Balance</Text>
          </View>
          <View style={styles.revenueStats}>
            <View style={styles.revenueStat}>
              <Text style={styles.revenueLabel}>Sot</Text>
              <Text style={styles.revenueAmount}>{todayWinTokens.toFixed(2)} WIN</Text>
              <Text style={styles.revenueUsd}>${(todayWinTokens / 60).toFixed(4)} (60%)</Text>
            </View>
            <View style={styles.revenueDivider} />
            <View style={styles.revenueStat}>
              <Text style={styles.revenueLabel}>Totali</Text>
              <Text style={styles.revenueAmountTotal}>{totalWinTokens.toFixed(2)} WIN</Text>
              <Text style={styles.revenueUsd}>${(totalWinTokens / 60).toFixed(4)} (60%)</Text>
            </View>
            <View style={styles.revenueDivider} />
            <View style={styles.revenueStat}>
              <Text style={styles.revenueLabel}>Ads</Text>
              <Text style={styles.revenueCount}>{adsWatched}</Text>
              <Text style={styles.revenueUsd}>shikuar</Text>
            </View>
          </View>
          <View style={styles.infoBox}>
            <Ionicons name="lock-closed" size={16} color="#FF9800" />
            <Text style={styles.lockText}>🔒 Locked deri KYC (15 ditë | $0.40/ditë | 10 referral)</Text>
          </View>
          <View style={styles.infoBox}>
            <Ionicons name="information-circle" size={16} color="#4CAF50" />
            <Text style={styles.lockText}>💡 60% e ad revenue → WIN tokens (automatik)</Text>
          </View>
        </View>
        
        {/* 🔥 AD #1: Top Games Banner */}
        <AdSenseBanner slot="2234567890" format="responsive" />

        {/* Realistic Ad Mock Overlay */}
        {adLoading && (
          <View style={styles.adLoadingOverlay}>
            <View style={styles.adVideoContainer}>
              {/* Mock Video Ad */}
              <View style={styles.mockVideoAd}>
                <Ionicons name="play-circle" size={80} color="rgba(255,255,255,0.8)" />
                <Text style={styles.mockAdText}>Reklama po luhet...</Text>
              </View>
              
              {/* Ad Info Bar */}
              <View style={styles.adInfoBar}>
                <Text style={styles.adInfoText}>Reklamë e sponsorizuar</Text>
                <Text style={styles.adCountdownText}>
                  {adCountdown > 0 ? `Prit ${adCountdown}s` : 'Gati!'}
                </Text>
              </View>
              
              {/* Skip Button (appears after countdown) */}
              {adCountdown === 0 && (
                <TouchableOpacity 
                  style={styles.skipAdButton}
                  onPress={() => setAdLoading(false)}
                >
                  <Text style={styles.skipAdText}>Kapërce Reklamën ›</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}

        {lastReward && (
          <View style={styles.rewardBanner}>
            <Ionicons name="trophy" size={24} color="#FFD700" />
            <Text style={styles.rewardText}>Last Earned: ${lastReward.toFixed(6)} USD</Text>
          </View>
        )}

        {/* Tap to Earn Game */}
        <View style={styles.gameCard}>
          <View style={styles.gameHeader}>
            <Ionicons name="finger-print" size={32} color="#4CAF50" />
            <View style={styles.gameInfo}>
              <Text style={styles.gameName}>{t('games.tapGame')}</Text>
              <Text style={styles.gameDesc}>{t('games.tapToEarn')}</Text>
            </View>
          </View>
          
          <TouchableOpacity
            style={styles.tapButton}
            onPress={handleTap}
            disabled={loading}
          >
            <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
              <Ionicons name="hand-left" size={64} color="#fff" />
            </Animated.View>
            <Text style={styles.tapCount}>{tapCount}/10</Text>
          </TouchableOpacity>
        </View>
        
        {/* 🔥 AD #2: In-Feed Native Ad (Between games) */}
        <AdSenseInFeed slot="2234567892" />

        {/* Spin Wheel Game */}
        <View style={styles.gameCard}>
          <View style={styles.gameHeader}>
            <Ionicons name="radio-button-on" size={32} color="#FF9800" />
            <View style={styles.gameInfo}>
              <Text style={styles.gameName}>Spin Wheel</Text>
              <Text style={styles.gameDesc}>Rrotëllo për të fituar më shumë</Text>
            </View>
          </View>
          
          {/* Spin Wheel Animation */}
          <View style={styles.spinWheelContainer}>
            <Animated.View style={{ transform: [{ rotate: spin }] }}>
              <Ionicons name="disc" size={120} color="#FF9800" />
            </Animated.View>
          </View>
          
          <TouchableOpacity
            style={[styles.actionButton, styles.spinButton]}
            onPress={handleSpin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Ionicons name="refresh-circle" size={24} color="#fff" />
                <Text style={styles.buttonText}>Rrotëllo Tani</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* Quiz Game */}
        <View style={styles.gameCard}>
          <View style={styles.gameHeader}>
            <Ionicons name="help-circle" size={32} color="#2196F3" />
            <View style={styles.gameInfo}>
              <Text style={styles.gameName}>Quiz Game</Text>
              <Text style={styles.gameDesc}>Përgjigju pyetjeve për të fituar</Text>
            </View>
          </View>
          
          <TouchableOpacity
            style={[styles.actionButton, styles.quizButton]}
            onPress={handleQuiz}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Ionicons name="school" size={24} color="#fff" />
                <Text style={styles.buttonText}>Luaj Quiz</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* Slot Machine Game - REMOVED (not wanted) */}

        <View style={styles.infoBox}>
          <Ionicons name="information-circle" size={24} color="#4CAF50" />
          <Text style={styles.infoText}>
            Çdo lojë gjeneron të ardhura nga ads. 60% konvertohen automatikisht në WIN token!
          </Text>
        </View>
      </View>

      {/* Spin Wheel Modal */}
      <Modal
        visible={spinModalVisible}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setSpinModalVisible(false)}
      >
        <View style={styles.spinModalContainer}>
          <View style={styles.spinModalHeader}>
            <Text style={styles.spinModalTitle}>Spin Wheel</Text>
            <TouchableOpacity onPress={() => setSpinModalVisible(false)}>
              <Ionicons name="close-circle" size={32} color="#fff" />
            </TouchableOpacity>
          </View>

          <View style={styles.wheelContainer}>
            <Text style={styles.wheelInstruction}>Rrotëllo për të fituar!</Text>
            
            {/* Visual Wheel with Sectors */}
            <View style={styles.wheelCircle}>
              <Animated.View 
                style={[
                  styles.wheelInner,
                  {
                    transform: [{
                      rotate: spinRotation.interpolate({
                        inputRange: [0, 1],
                        outputRange: ['0deg', '360deg']
                      })
                    }]
                  }
                ]}
              >
                {SPIN_SECTORS.map((sector, index) => (
                  <View 
                    key={index}
                    style={[
                      styles.sector,
                      { 
                        backgroundColor: sector.color,
                        transform: [{ rotate: `${index * 45}deg` }]
                      },
                      selectedSector === index && styles.sectorSelected
                    ]}
                  >
                    <Text style={styles.sectorText}>${sector.value}</Text>
                  </View>
                ))}
                
                {/* Golden emerald center with Star of David */}
                <View style={styles.centerCircle}>
                  <Text style={styles.centerText}>✡</Text>
                </View>
              </Animated.View>
              
              {/* Pointer */}
              <View style={styles.pointer}>
                <Ionicons name="caret-down" size={40} color="#FF0000" />
              </View>
            </View>

            {selectedSector !== null && !spinning && (
              <View style={styles.resultContainer}>
                <Text style={styles.resultText}>
                  Fitove: ${SPIN_SECTORS[selectedSector].value}!
                </Text>
              </View>
            )}

            <TouchableOpacity
              style={[styles.spinActionButton, spinning && styles.spinActionButtonDisabled]}
              onPress={spinWheel}
              disabled={spinning}
            >
              {spinning ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Ionicons name="refresh" size={24} color="#fff" />
                  <Text style={styles.spinActionButtonText}>
                    {selectedSector !== null ? 'Rrotëllo Përsëri' : 'Rrotëllo Tani'}
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Quiz Modal */}
      <Modal
        visible={quizModalVisible}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setQuizModalVisible(false)}
      >
        <View style={styles.quizContainer}>
          <View style={styles.quizHeader}>
            <Text style={styles.quizTitle}>Quiz Challenge</Text>
            <Text style={styles.quizProgress}>
              Pyetja {currentQuestion + 1}/{quizQuestions.length}
            </Text>
          </View>

          {quizQuestions.length > 0 && (
            <View style={styles.quizContent}>
              <View style={styles.questionCard}>
                <Text style={styles.questionCategory}>
                  {quizQuestions[currentQuestion].category}
                </Text>
                <Text style={styles.questionText}>
                  {quizQuestions[currentQuestion].question}
                </Text>
              </View>

              <View style={styles.answersContainer}>
                {quizQuestions[currentQuestion].options.map((option, index) => {
                  const isSelected = selectedAnswer === index;
                  const isCorrect = index === quizQuestions[currentQuestion].correct;
                  const showResult = selectedAnswer !== null;

                  return (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.answerButton,
                        isSelected && showResult && isCorrect && styles.answerCorrect,
                        isSelected && showResult && !isCorrect && styles.answerWrong,
                      ]}
                      onPress={() => handleQuizAnswer(index)}
                      disabled={selectedAnswer !== null}
                    >
                      <Text style={styles.answerText}>{option}</Text>
                      {isSelected && showResult && (
                        <Ionicons
                          name={isCorrect ? 'checkmark-circle' : 'close-circle'}
                          size={24}
                          color="#fff"
                        />
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>

              <View style={styles.quizScoreContainer}>
                <Ionicons name="trophy" size={20} color="#FFD700" />
                <Text style={styles.quizScoreText}>
                  Rezultati: {quizScore}/{currentQuestion + (selectedAnswer !== null ? 1 : 0)}
                </Text>
              </View>
            </View>
          )}
        </View>
      </Modal>

      {/* Slot Machine Modal - REMOVED (not wanted) */}

      {/* Ad Choice Modal - Shows INSTANTLY after every game round */}
      {/* AdSense Reward Modal - Shows before each game */}
      <AdSenseRewardModal
        visible={adSenseModalVisible}
        gameType={currentGameType}
        onWatchAd={handleWatchAdSense}
        onSkip={handleSkipAd}
        rewardAmount="$0.10 - $5.00"
      />
      
      {/* 🔥 AD #3: Native Ad (Bottom of games page) */}
      <AdSenseNative slot="4234567891" layout="image-middle" />
      
      {/* 🔥 AD #4: Bottom Banner */}
      <AdSenseBanner slot="2234567893" format="responsive" />
      
      {/* 🔥 AD #5: Sticky Bottom Ad (Always visible) */}
      <AdSenseBanner slot="2234567894" format="responsive" sticky />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0c0c0c',
  },
  content: {
    padding: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#999',
    marginBottom: 24,
  },
  rewardBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2a2a1a',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  rewardText: {
    color: '#FFD700',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 12,
  },
  gameCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  gameHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  gameInfo: {
    marginLeft: 16,
    flex: 1,
  },
  gameName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  gameDesc: {
    fontSize: 14,
    color: '#999',
    marginTop: 4,
  },
  tapButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tapCount: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 16,
  },
  actionButton: {
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  spinButton: {
    backgroundColor: '#FF9800',
  },
  quizButton: {
    backgroundColor: '#2196F3',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#1a2a1a',
    padding: 16,
    borderRadius: 12,
    marginTop: 8,
  },
  infoText: {
    flex: 1,
    color: '#999',
    marginLeft: 12,
    fontSize: 14,
    lineHeight: 20,
  },
  adLoadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  adLoadingCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    minWidth: 250,
  },
  adLoadingText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
  },
  adLoadingSubtext: {
    color: '#999',
    fontSize: 14,
    marginTop: 8,
  },
  spinWheelContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
  },
  // Realistic Ad Mock Styles
  adVideoContainer: {
    width: '90%',
    height: 400,
    backgroundColor: '#000',
    borderRadius: 16,
    overflow: 'hidden',
  },
  mockVideoAd: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
  },
  mockAdText: {
    color: '#fff',
    fontSize: 18,
    marginTop: 16,
  },
  adInfoBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: 'rgba(0,0,0,0.8)',
  },
  adInfoText: {
    color: '#999',
    fontSize: 12,
  },
  adCountdownText: {
    color: '#4CAF50',
    fontSize: 14,
    fontWeight: 'bold',
  },
  skipAdButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: 'rgba(76, 175, 80, 0.9)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  skipAdText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  // Quiz Modal Styles
  quizContainer: {
    flex: 1,
    backgroundColor: '#0c0c0c',
  },
  quizHeader: {
    backgroundColor: '#2196F3',
    padding: 24,
    paddingTop: 48,
  },
  quizTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  quizProgress: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
  },
  quizContent: {
    flex: 1,
    padding: 24,
  },
  questionCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
  },
  questionCategory: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: 'bold',
    marginBottom: 12,
    textTransform: 'uppercase',
  },
  questionText: {
    fontSize: 20,
    color: '#fff',
    lineHeight: 28,
  },
  answersContainer: {
    marginBottom: 24,
  },
  answerButton: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  answerCorrect: {
    backgroundColor: '#1a3a1a',
    borderColor: '#4CAF50',
  },
  answerWrong: {
    backgroundColor: '#3a1a1a',
    borderColor: '#f44336',
  },
  answerText: {
    fontSize: 16,
    color: '#fff',
    flex: 1,
  },
  quizScoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
  },
  quizScoreText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFD700',
    marginLeft: 8,
  },
  // Spin Wheel Modal Styles
  spinModalContainer: {
    flex: 1,
    backgroundColor: '#0c0c0c',
  },
  spinModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    paddingTop: 48,
    backgroundColor: '#FF9800',
  },
  spinModalTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  wheelContainer: {
    flex: 1,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  wheelInstruction: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 24,
  },
  wheelCircle: {
    width: 280,
    height: 280,
    position: 'relative',
    marginBottom: 32,
  },
  wheelInner: {
    width: '100%',
    height: '100%',
    borderRadius: 140,
    overflow: 'hidden',
    backgroundColor: '#1a1a1a',
    borderWidth: 8,
    borderColor: '#FFD700',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sector: {
    position: 'absolute',
    width: 140,
    height: 140,
    justifyContent: 'center',
    alignItems: 'center',
    transformOrigin: 'center',
  },
  sectorSelected: {
    borderWidth: 3,
    borderColor: '#FFD700',
  },
  sectorText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    textShadowColor: '#000',
    textShadowRadius: 2,
  },
  centerCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#00695C', // emerald center
    borderWidth: 4,
    borderColor: '#FFD700',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
  },
  centerText: {
    fontSize: 40,
    color: '#FFD700',
    fontWeight: 'bold',
  },
  pointer: {
    position: 'absolute',
    top: -20,
    alignSelf: 'center',
  },
  resultContainer: {
    backgroundColor: '#1a3a1a',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  resultText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
    textAlign: 'center',
  },
  spinActionButton: {
    backgroundColor: '#FF9800',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  spinActionButtonDisabled: {
    opacity: 0.5,
  },
  spinActionButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  // Slot Machine Styles - REMOVED (not wanted)
  // Revenue Card Styles
  revenueCard: {
    backgroundColor: '#1a1a2e',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#4CAF50',
  },
  revenueHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  revenueTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  revenueStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  revenueStat: {
    alignItems: 'center',
    flex: 1,
  },
  revenueLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
  revenueAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  revenueAmountTotal: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFD700',
  },
  revenueCount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  revenueUsd: {
    fontSize: 11,
    color: '#999',
    marginTop: 4,
  },
  revenueDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#333',
  },
  balanceInfo: {
    alignItems: 'center',
    marginBottom: 12,
  },
  balanceAmount: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 4,
  },
  balanceUsd: {
    fontSize: 14,
    color: '#999',
  },
  lockNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    backgroundColor: 'rgba(255, 152, 0, 0.1)',
    padding: 8,
    borderRadius: 8,
    gap: 6,
  },
  lockText: {
    fontSize: 12,
    color: '#FF9800',
    flex: 1,
  },
  conversionInfo: {
    marginTop: 12,
    padding: 8,
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    borderRadius: 8,
  },
  conversionText: {
    fontSize: 12,
    color: '#4CAF50',
    textAlign: 'center',
  },
});