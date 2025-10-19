import AsyncStorage from '@react-native-async-storage/async-storage';

const HISTORY_KEY = 'qr_scan_history';

export interface ScanHistoryItem {
  url: string;
  timestamp: number;
  isSafe: boolean;
}

export async function addToHistory(url: string, isSafe: boolean): Promise<void> {
  try {
    const history = await getHistory();
    const newItem: ScanHistoryItem = {
      url,
      timestamp: Date.now(),
      isSafe,
    };
    
    const updatedHistory = [newItem, ...history].slice(0, 100); // Keep last 100 items
    await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory));
  } catch (error) {
    console.error('Failed to save to history:', error);
  }
}

export async function getHistory(): Promise<ScanHistoryItem[]> {
  try {
    const history = await AsyncStorage.getItem(HISTORY_KEY);
    return history ? JSON.parse(history) : [];
  } catch (error) {
    console.error('Failed to get history:', error);
    return [];
  }
}

export async function clearHistory(): Promise<void> {
  try {
    await AsyncStorage.removeItem(HISTORY_KEY);
  } catch (error) {
    console.error('Failed to clear history:', error);
  }
}