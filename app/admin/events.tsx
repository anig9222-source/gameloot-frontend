import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
  TextInput
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

interface Event {
  _id: string;
  user_id: string;
  user_email?: string;
  event_type: string;
  timestamp: string;
  ip_address?: string;
  game_type?: string;
  revenue_usd?: number;
  mission_id?: string;
  reward?: number;
}

export default function AdminEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState('');
  const [eventTypeFilter, setEventTypeFilter] = useState<string | null>(null);

  useEffect(() => {
    fetchEvents();
  }, [eventTypeFilter]);

  const fetchEvents = async () => {
    try {
      const token = await AsyncStorage.getItem('admin_token');
      if (!token) return;

      const params: any = { limit: 100 };
      if (eventTypeFilter) {
        params.event_type = eventTypeFilter;
      }

      const response = await axios.get(`${API_URL}/api/admin/events`, {
        headers: { Authorization: `Bearer ${token}` },
        params
      });

      setEvents(response.data.events || []);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchEvents();
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'login': return 'log-in';
      case 'register': return 'person-add';
      case 'game_play': return 'game-controller';
      case 'referral_signup': return 'people';
      case 'mission_claim': return 'trophy';
      default: return 'information-circle';
    }
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case 'login': return '#4CAF50';
      case 'register': return '#2196F3';
      case 'game_play': return '#FF9800';
      case 'referral_signup': return '#9C27B0';
      case 'mission_claim': return '#FFD700';
      default: return '#666';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString('sq-AL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredEvents = events.filter(event => {
    if (!filter) return true;
    return (
      event.user_email?.toLowerCase().includes(filter.toLowerCase()) ||
      event.event_type.toLowerCase().includes(filter.toLowerCase()) ||
      event._id.toLowerCase().includes(filter.toLowerCase())
    );
  });

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#4CAF50" />
      }
    >
      <View style={styles.content}>
        <Text style={styles.title}>Events Log</Text>
        <Text style={styles.subtitle}>{events.length} events total</Text>

        {/* Search */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#666" />
          <TextInput
            style={styles.searchInput}
            placeholder="Kërko user, event type..."
            placeholderTextColor="#666"
            value={filter}
            onChangeText={setFilter}
          />
        </View>

        {/* Filter Buttons */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterContainer}>
          <TouchableOpacity
            style={[styles.filterButton, !eventTypeFilter && styles.filterButtonActive]}
            onPress={() => setEventTypeFilter(null)}
          >
            <Text style={[styles.filterText, !eventTypeFilter && styles.filterTextActive]}>Të gjitha</Text>
          </TouchableOpacity>

          {['login', 'register', 'game_play', 'referral_signup', 'mission_claim'].map(type => (
            <TouchableOpacity
              key={type}
              style={[styles.filterButton, eventTypeFilter === type && styles.filterButtonActive]}
              onPress={() => setEventTypeFilter(type)}
            >
              <Ionicons name={getEventIcon(type) as any} size={16} color={eventTypeFilter === type ? '#4CAF50' : '#666'} />
              <Text style={[styles.filterText, eventTypeFilter === type && styles.filterTextActive]}>
                {type.replace('_', ' ')}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Events List */}
        {filteredEvents.map((event) => (
          <View key={event._id} style={styles.eventCard}>
            <View style={[styles.eventIcon, { backgroundColor: getEventColor(event.event_type) + '20' }]}>
              <Ionicons name={getEventIcon(event.event_type) as any} size={24} color={getEventColor(event.event_type)} />
            </View>

            <View style={styles.eventContent}>
              <Text style={styles.eventType}>{event.event_type}</Text>
              <Text style={styles.eventUser}>{event.user_email || event.user_id}</Text>
              <Text style={styles.eventTime}>{formatTimestamp(event.timestamp)}</Text>

              {event.game_type && (
                <Text style={styles.eventDetail}>Game: {event.game_type}</Text>
              )}
              {event.revenue_usd !== undefined && (
                <Text style={styles.eventDetail}>Revenue: ${event.revenue_usd.toFixed(4)}</Text>
              )}
              {event.mission_id && (
                <Text style={styles.eventDetail}>Mission: {event.mission_id}</Text>
              )}
              {event.reward && (
                <Text style={styles.eventDetail}>Reward: +{event.reward} PW</Text>
              )}
              {event.ip_address && (
                <Text style={styles.eventDetail}>IP: {event.ip_address}</Text>
              )}
            </View>
          </View>
        ))}

        {filteredEvents.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="document-text-outline" size={64} color="#666" />
            <Text style={styles.emptyText}>Nuk ka events</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0c0c0c',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#0c0c0c',
    justifyContent: 'center',
    alignItems: 'center',
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#fff',
  },
  filterContainer: {
    marginBottom: 24,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  filterButtonActive: {
    backgroundColor: '#1a3a1a',
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  filterText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 6,
  },
  filterTextActive: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  eventCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
  },
  eventIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  eventContent: {
    flex: 1,
  },
  eventType: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
    textTransform: 'capitalize',
  },
  eventUser: {
    fontSize: 14,
    color: '#999',
    marginBottom: 4,
  },
  eventTime: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  eventDetail: {
    fontSize: 12,
    color: '#4CAF50',
    marginTop: 2,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 64,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginTop: 16,
  },
});
