import { useState } from 'react';
import { StyleSheet, View, Text, Pressable, FlatList } from 'react-native';

type Movie = {
  id: number;
  title: string;
  year: string;
  rating: number;
  genres: string[];
};

/*
  Placeholder movie data for demonstration purposes.
*/
const MOVIES: Movie[] = [
  {
    id: 1,
    title: 'Example Movie One',
    year: '2025',
    rating: 8.2,
    genres: ['action', 'drama'],
  },
  {
    id: 2,
    title: 'Example Movie Two',
    year: '2025',
    rating: 7.6,
    genres: ['comedy'],
  },
  {
    id: 3,
    title: 'Family Feature',
    year: '2024',
    rating: 7.9,
    genres: ['family'],
  },
  {
    id: 4,
    title: 'Romantic Placeholder',
    year: '2026',
    rating: 6.8,
    genres: ['romance'],
  },
];

const GENRES = ['all', 'action', 'comedy', 'drama', 'family', 'romance'];

export default function HomeScreen() {
  const [selectedGenre, setSelectedGenre] = useState('all');

  const filteredMovies =
    selectedGenre === 'all'
      ? MOVIES
      : MOVIES.filter(movie =>
          movie.genres.includes(selectedGenre)
        );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Trending Movies</Text>

      {/* GENRE FILTER */}
      <View style={styles.filterRow}>
        {GENRES.map(genre => (
          <Pressable
            key={genre}
            style={[
              styles.filterButton,
              selectedGenre === genre && styles.filterActive,
            ]}
            onPress={() => setSelectedGenre(genre)}
          >
            <Text
              style={[
                styles.filterText,
                selectedGenre === genre && styles.filterTextActive,
              ]}
            >
              {genre.toUpperCase()}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* MOVIE LIST */}
      <FlatList
        data={filteredMovies}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.movieTitle}>{item.title}</Text>
            <Text style={styles.meta}>
              {item.year} • Rating {item.rating}
            </Text>
            <Text style={styles.genres}>
              {item.genres.join(', ')}
            </Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
    gap: 8,
  },
  filterButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: '#eeeeee',
  },
  filterActive: {
    backgroundColor: '#3b82f6',
  },
  filterText: {
    fontSize: 12,
    color: '#333',
  },
  filterTextActive: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  list: {
    gap: 12,
  },
  card: {
    padding: 16,
    borderRadius: 10,
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  movieTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  meta: {
    fontSize: 13,
    color: '#555',
    marginTop: 4,
  },
  genres: {
    fontSize: 12,
    color: '#777',
    marginTop: 6,
  },
});
