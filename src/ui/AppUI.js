// Entrypoint UI component

import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  Modal
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import { fetchTrending, fetchUpcoming, fetchByGenre, getTrendingPlaceholders, getUpcomingPlaceholders } from '../api';
import {
  filterByGenre,
  filterByRating,
  GENRE_FILTER_OPTIONS,
  getTmdbGenreId,
  RATING_FILTER_OPTIONS,
  SORT_OPTIONS,
  sortByOption,
} from '../filtering';

import Card from './components/Card';
import Dropdown from './components/Dropdown';
import { formatDate } from './utils/formatDate';
const { width } = Dimensions.get('window');
const CARD_WIDTH = Math.round((width - 40) / 2);

export default function AppUI() {
  const [tab, setTab] = useState('trending');
  const [trending, setTrending] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  // Use filtering/sorting utilities from src/filtering
  const [selectedFilter, setSelectedFilter] = useState('All');

  const [selectedRating, setSelectedRating] = useState('All');
  const [selectedSort, setSelectedSort] = useState('Top Rated');

  const trendingPlaceholders = getTrendingPlaceholders();
  const upcomingPlaceholders = getUpcomingPlaceholders();

  const [genreItems, setGenreItems] = useState([]);
  const [genreLoading, setGenreLoading] = useState(false);

  const renderCards = (list, placeholders = []) => {
    const items = (Array.isArray(list) && list.length > 0) ? list : placeholders;
    return (
      <View style={styles.cardsWrap}>
        {items.map((it, i) => (
          <Card key={i} item={it} onPress={() => openDetails(it)} styles={styles} />
        ))}
      </View>
    );
  };

  const filteredTrending = filterByGenre(trending, selectedFilter);
  const filteredUpcoming = filterByGenre(upcoming, selectedFilter);
  const ratedFilteredTrending = filterByRating(filteredTrending, selectedRating);
  const ratedFilteredUpcoming = filterByRating(filteredUpcoming, selectedRating);

  const finalTrending = sortByOption(ratedFilteredTrending, selectedSort);
  const finalUpcoming = sortByOption(ratedFilteredUpcoming, selectedSort);
  const finalGenreItems = sortByOption(filterByRating(genreItems, selectedRating), selectedSort);

  useEffect(() => {
    let mounted = true;
    async function loadGenre() {
      if (!selectedFilter || selectedFilter === 'All') {
        setGenreItems([]);
        return;
      }
      const id = getTmdbGenreId(selectedFilter);
      if (!id) {
        setGenreItems([]);
        return;
      }
      setGenreLoading(true);
      try {
        const items = await fetchByGenre(id, tab === 'coming');
        if (mounted) setGenreItems(items || []);
      } catch (e) {
        console.warn('Genre fetch failed', e);
        if (mounted) setGenreItems([]);
      } finally {
        if (mounted) setGenreLoading(false);
      }
    }
    loadGenre();
    return () => { mounted = false; };
  }, [selectedFilter, tab]);

  const [detailsItem, setDetailsItem] = useState(null);
  const [detailsVisible, setDetailsVisible] = useState(false);

  function openDetails(item) {
    setDetailsItem(item);
    setDetailsVisible(true);
  }

  function closeDetails() {
    setDetailsVisible(false);
    setDetailsItem(null);
  }

  const fetchData = async (loc) => {
    try {
      const t = await fetchTrending({ lat: loc?.latitude, lon: loc?.longitude });
      const u = await fetchUpcoming({ lat: loc?.latitude, lon: loc?.longitude });
      setTrending(t);
      setUpcoming(u);
    } catch (err) {
      console.warn('API error', err);
    }
  };
  useEffect(() => {
    // assume United States and fetch initial data
    fetchData(null);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />

      <Image
        source={{ uri: 'https://via.placeholder.com/1200x400.png?text=Spotlight' }}
        style={styles.headerImage}
      />

      <View style={styles.header}>
        <Text style={styles.desc}>Discover what’s trending now and what’s coming soon to theaters.</Text>
        
        <View style={styles.filterLabelsRow}>
          <Text style={styles.filterLabel}>Genre</Text>
          <Text style={styles.filterLabel}>Rating</Text>
          <Text style={styles.filterLabel}>Sort</Text>
        </View>

          <View style={styles.filterBar}>
            <Dropdown style={{ flex: 1, marginRight: 8 }} label="Genre" options={GENRE_FILTER_OPTIONS} value={selectedFilter} selectedOption={selectedFilter} onChange={setSelectedFilter} styles={styles} />
            <Dropdown style={{ flex: 1, marginRight: 8 }} label="Rating" options={RATING_FILTER_OPTIONS} value={selectedRating === 'All' ? 'All ratings' : (selectedRating + '+')} selectedOption={selectedRating} onChange={(v) => setSelectedRating(v)} styles={styles} />
            <Dropdown style={{ flex: 1 }} label="Sort" options={SORT_OPTIONS} value={selectedSort} selectedOption={selectedSort} onChange={setSelectedSort} styles={styles} />
          </View>
      </View>

      <Modal
        visible={detailsVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={closeDetails}
      >
        <View style={styles.detailsBackdrop}>
          <View style={styles.detailsCard}>
            {detailsItem && (
              <>
                <Image source={{ uri: detailsItem.poster }} style={styles.detailsImage} resizeMode="cover" />
                <Text style={styles.detailsTitle}>{detailsItem.title}</Text>
                <Text style={styles.detailsMeta}>{detailsItem.meta}</Text>
                {detailsItem.releaseDate ? (
                  <Text style={styles.detailsRelease}>Release: {formatDate(detailsItem.releaseDate)}</Text>
                ) : null}
                <ScrollView style={styles.detailsOverviewWrap}>
                  <Text style={styles.detailsOverview}>{detailsItem.overview}</Text>
                </ScrollView>
                <TouchableOpacity style={styles.closeButton} onPress={closeDetails}>
                  <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>

      <ScrollView style={styles.main} contentContainerStyle={{paddingBottom: 120}}>
        <Text style={styles.sectionTitle}>{tab === 'trending' ? 'Trending Now' : 'Coming Soon'}</Text>

        {selectedFilter && selectedFilter !== 'All' ? (
          genreLoading ? (
            <Text style={styles.noResults}>Loading {selectedFilter}…</Text>
          ) : (
            genreItems.length > 0 ? renderCards(finalGenreItems, tab === 'coming' ? upcomingPlaceholders : trendingPlaceholders) : <Text style={styles.noResults}>No results for "{selectedFilter}"</Text>
          )
        ) : (
          tab === 'trending' ? (
            finalTrending.length === 0 ? (
              <Text style={styles.noResults}>No results for "{selectedFilter}"</Text>
            ) : (
              renderCards(finalTrending, trendingPlaceholders)
            )
          ) : (
            finalUpcoming.length === 0 ? (
              <Text style={styles.noResults}>No results for "{selectedFilter}"</Text>
            ) : (
              renderCards(finalUpcoming, upcomingPlaceholders)
            )
          )
        )}
      </ScrollView>

      <View style={styles.bottomNav}>
        <TouchableOpacity style={[styles.navButton, tab === 'trending' && styles.navActive]} onPress={() => setTab('trending')}>
          <Text style={[styles.navText, tab === 'trending' && styles.navTextActive]}>Trending Now</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.navButton, tab === 'coming' && styles.navActive]} onPress={() => setTab('coming')}>
          <Text style={[styles.navText, tab === 'coming' && styles.navTextActive]}>Coming Soon</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  headerImage: { width: '100%', height: 160 },
  header: { padding: 16, borderBottomWidth: 1, borderBottomColor: '#eee' },
  title: { fontSize: 28, fontWeight: '700' },
  desc: { fontSize: 14, color: '#666', marginTop: 4, textAlign: 'center', fontWeight: 'bold' },

  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'center', alignItems: 'center' },
  modalCard: { width: '86%', backgroundColor: '#fff', borderRadius: 10, padding: 16 },
  modalTitle: { fontSize: 18, fontWeight: '700', marginBottom: 8 },
  modalBody: { fontSize: 14, color: '#444', marginBottom: 12 },
  modalRow: { flexDirection: 'row', justifyContent: 'flex-end' },
  modalButton: { paddingVertical: 10, paddingHorizontal: 14, borderRadius: 6, marginLeft: 8 },
  modalButtonText: { color: '#007AFF', fontWeight: '600' },
  modalButtonPrimary: { backgroundColor: '#007AFF' },
  modalButtonPrimaryText: { color: '#fff' },

  filterBar: { backgroundColor: '#ffffff', borderBottomColor: '#eee', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 4 },
  filterLabelsRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8, paddingHorizontal: 4 },
  filterLabel: { flex: 1, textAlign: 'center', fontSize: 12, color: '#666', fontWeight: '700' },
  filterText: { color: '#444' },
  filterCarousel: { paddingLeft: 4 },
  chip: { paddingHorizontal: 12, paddingVertical: 8, backgroundColor: '#fff', borderRadius: 20, borderWidth: 1, borderColor: '#FFD700', marginRight: 8 },
  chipActive: { backgroundColor: '#FFD700', borderColor: '#FFD700' },
  chipText: { color: '#000', fontWeight: '600', textAlign: 'center', width: '100%' },
  chipTextActive: { color: '#000', fontWeight: '800', textAlign: 'center', width: '100%' },
  main: { flex: 1, paddingHorizontal: 12 },
  sectionTitle: { fontSize: 20, fontWeight: '600', marginVertical: 12, textAlign: 'center' },
  detailsBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  detailsCard: { width: '92%', maxHeight: '86%', backgroundColor: '#fff', borderRadius: 10, padding: 12 },
  detailsImage: { width: '100%', height: 300, borderRadius: 8, backgroundColor: '#ddd' },
  detailsTitle: { fontSize: 18, fontWeight: '700', marginTop: 10 },
  detailsMeta: { color: '#666', marginTop: 4 },
  detailsOverviewWrap: { marginTop: 8, maxHeight: 160 },
  detailsOverview: { color: '#333', fontSize: 14 },
  closeButton: { marginTop: 12, alignSelf: 'flex-end', paddingVertical: 8, paddingHorizontal: 12, backgroundColor: '#007AFF', borderRadius: 6 },
  closeButtonText: { color: '#fff', fontWeight: '600' },
  detailsRelease: { color: '#444', marginTop: 6, fontSize: 13 },
  cardsWrap: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  noResults: { textAlign: 'center', color: '#666', marginVertical: 24 },
  card: { width: CARD_WIDTH, marginBottom: 12, backgroundColor: '#fff', borderRadius: 6, overflow: 'hidden', borderWidth: 1, borderColor: '#eee' },
  poster: { width: '100%', height: Math.round(CARD_WIDTH * 1.5), backgroundColor: '#ddd' },
  cardBody: { padding: 8 },
  cardTitle: { fontWeight: '600', fontSize: 14 },
  meta: { color: '#666', marginTop: 4, fontSize: 12 },
  overview: { marginTop: 6, color: '#333', fontSize: 12 },
  bottomNav: { position: 'absolute', left: 0, right: 0, bottom: 0, height: 64, flexDirection: 'row', borderTopWidth: 1, borderTopColor: '#eee', backgroundColor: '#fff' },
  navButton: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  navText: { fontSize: 16 },
  navActive: { backgroundColor: '#FFD700' },
  navTextActive: { color: '#000', fontWeight: '700' }
  ,
  dropdownButton: { alignSelf: 'stretch', justifyContent: 'center' },
  dropdownButtonText: { width: '100%', textAlign: 'center' },
  dropdownItem: { width: '100%', borderRadius: 6, marginBottom: 8, justifyContent: 'center' }
  ,
  menuBackdrop: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  menuContainer: { position: 'absolute', backgroundColor: '#fff', borderRadius: 8, padding: 8, elevation: 6, shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 6 }
});
