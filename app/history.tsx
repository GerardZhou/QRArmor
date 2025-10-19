import { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable } from 'react-native';
import { Stack } from 'expo-router';
import { useFocusEffect } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getHistory, clearHistory, type ScanHistoryItem } from '../utils/history';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function History() {
  const [history, setHistory] = useState<ScanHistoryItem[]>([]);

  useFocusEffect(
    useCallback(() => {
      loadHistory();
    }, [])
  );

  const loadHistory = async () => {
    const items = await getHistory();
    setHistory(items);
  };

  const handleClearHistory = async () => {
    await clearHistory();
    setHistory([]);
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Scan History',
          headerRight: () => (
            <Pressable onPress={handleClearHistory} style={styles.clearButton}>
              <Text style={styles.clearButtonText}>Clear</Text>
            </Pressable>
          ),
        }}
      />
      
      {history.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No scan history yet</Text>
        </View>
      ) : (
        <FlatList
          data={history}
          keyExtractor={(item) => item.timestamp.toString()}
          renderItem={({ item }) => (
            <View style={styles.historyItem}>
              <View style={styles.iconContainer}>
                <Ionicons
                  name={item.isSafe ? 'checkmark-circle' : 'close-circle'}
                  size={24}
                  color={item.isSafe ? '#4CAF50' : '#F44336'}
                />
              </View>
              <View style={styles.itemContent}>
                <Text style={styles.url} numberOfLines={1}>{item.url}</Text>
                <Text style={styles.timestamp}>{formatDate(item.timestamp)}</Text>
              </View>
            </View>
          )}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
  historyItem: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
  },
  iconContainer: {
    marginRight: 12,
  },
  itemContent: {
    flex: 1,
  },
  url: {
    fontSize: 16,
    marginBottom: 4,
  },
  timestamp: {
    fontSize: 12,
    color: '#666',
  },
  separator: {
    height: 1,
    backgroundColor: '#eee',
  },
  clearButton: {
    marginRight: 16,
  },
  clearButtonText: {
    color: '#007AFF',
    fontSize: 16,
  },
});