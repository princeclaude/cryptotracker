import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';

export default function SocialMetrics({ coinId }) {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSocialData = async () => {
      try {
        const res = await fetch(`https://api.coingecko.com/api/v3/coins/${coinId}`);
        const data = await res.json();
        setMetrics(data.community_data);
      } catch (error) {
        console.error('Failed to fetch social metrics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSocialData();
  }, [coinId]);

  if (loading) return <ActivityIndicator style={{ marginTop: 20 }} color="#00f5cc" />;
  if (!metrics) return <Text style={styles.errorText}>No social data available.</Text>;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Community Metrics</Text>
      <Text style={styles.metric}>Twitter Followers: {metrics.twitter_followers?.toLocaleString() || 0}</Text>
      <Text style={styles.metric}>Reddit Avg Posts/24h: {metrics.reddit_average_posts_48h || 0}</Text>
      <Text style={styles.metric}>Reddit Avg Comments/24h: {metrics.reddit_average_comments_48h || 0}</Text>
      <Text style={styles.metric}>Reddit Subscribers: {metrics.reddit_subscribers?.toLocaleString() || 0}</Text>
      <Text style={styles.metric}>Telegram Users: {metrics.telegram_channel_user_count?.toLocaleString() || 0}</Text>
      <Text style={styles.metric}>Facebook Likes: {metrics.facebook_likes?.toLocaleString() || 0}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'black',
    padding: 30,
    marginTop: 20,
    borderRadius: 10,
  },
  title: {
    fontSize: 20,
    color: '#00f5cc',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  metric: {
    color: '#ccc',
    marginBottom: 4,
  },
  errorText: {
    color: '#888',
    textAlign: 'center',
    marginTop: 20,
},
});