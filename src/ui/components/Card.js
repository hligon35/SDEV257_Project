import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';

export default function Card({ item, onPress, styles }) {
  const title = item?.title || 'Untitled';
  const meta = item?.meta || '';
  const overview = item?.overview || '';
  const poster = item?.poster;

  return (
    <TouchableOpacity style={styles?.card} onPress={() => onPress && onPress(item)}>
      {poster ? (
        <Image source={{ uri: poster }} style={styles?.poster} />
      ) : (
        <View style={styles?.poster} />
      )}
      <View style={styles?.cardBody}>
        <Text numberOfLines={2} style={styles?.cardTitle}>{title}</Text>
        {meta ? <Text style={styles?.meta}>{meta}</Text> : null}
        {overview ? <Text numberOfLines={3} style={styles?.overview}>{overview}</Text> : null}
      </View>
    </TouchableOpacity>
  );
}
