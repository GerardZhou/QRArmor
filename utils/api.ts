import { Config } from '../constants/Config';

interface Detection {
  engine: string;
  category: string;
  result: string;
}

interface ScanStats {
  malicious: number;
  suspicious: number;
  harmless: number;
  total: number;
}

interface ScanResponse {
  status: 'malicious' | 'safe';
  link: string;
  analysis: {
    stats: ScanStats;
    detections: Detection[];
  };
  summary?: string;
}

export async function scanUrl(url: string): Promise<ScanResponse> {
  try {
    const response = await fetch(`${Config.BACKEND_URL}/scan`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url }),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error scanning URL:', error);
    throw error;
  }
}