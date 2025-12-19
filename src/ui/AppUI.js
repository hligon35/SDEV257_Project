// src/ui/AppUI.js
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
} from 'react-native';

import {
  fetchTrending,
  fetchUpcoming,
  fetchByGenre,
  GENRE_IDS,
} from '../api';

export default function AppUI() {
  const [trending, setTrending] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState('All');

  useEffect(() => {
    loadMovies();
  }, [selectedGenre]);

  async function loadMovies() {
    try {
      if (selectedGenre === 'All') {
        const t = await fetchTrending();
        const u = await fetchUpcoming();
        setTrending(t);
        setUpcoming(u);
      } else {
        const movies = await fetchByGenre(GENRE_IDS[selectedGenre]);
        setTrending(movies);
        setUpcoming([]);
      }
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Spotlight</Text>

      <View style={styles.genreRow}>
        {Object.keys(GENRE_IDS).map((genre) => (
          <Pressable
            key={genre}
            onPress={() => setSelectedGenre(genre)}
            style={[
              styles.genreButton,
              selectedGenre === genre && styles.genreActive,
            ]}
          >
            <Text style={styles.genreText}>{genre}</Text>
          </Pressable>
        ))}
      </View>

      <Text style={styles.section}>Trending Now</Text>
      <View style={styles.grid}>
        {trending.map((movie) => (
          <View key={movie.id} style={styles.card}>
            <Image
              source={{
                uri: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
              }}
              style={styles.poster}
            />
            <Text style={styles.movieTitle}>{movie.title}</Text>
          </View>
        ))}
      </View>

      {upcoming.length > 0 && (
        <>
          <Text style={styles.section}>Coming Soon</Text>
          <View style={styles.grid}>
            {upcoming.map((movie) => (
              <View key={movie.id} style={styles.card}>
                <Image
                  source={{
                    uri: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
                  }}
                  style={styles.poster}
                />
                <Text style={styles.movieTitle}>{movie.title}</Text>
              </View>
            ))}
          </View>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#0b132b',
    padding: 16,
  },
  title: {
    fontSize: 32,
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  genreRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  genreButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: '#1c2541',
    marginRight: 8,
    marginBottom: 8,
  },
  genreActive: {
    backgroundColor: '#5bc0be',
  },
  genreText: {
    color: 'white',
  },
  section: {
    fontSize: 20,
    color: 'white',
    marginVertical: 12,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '48%',
    marginBottom: 16,
  },
  poster: {
    width: '100%',
    height: 260,
    borderRadius: 8,
  },
  movieTitle: {
    color: 'white',
    marginTop: 6,
    fontSize: 14,
  },
});
