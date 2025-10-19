import axios from 'axios';

export async function checkUrlWithVirusTotal(url: string) {
  const apiKey = process.env.VIRUSTOTAL_API_KEY;
  if (!apiKey) throw new Error('Missing VIRUSTOTAL_API_KEY');

  // Submit URL for scanning
  const submitResp = await axios.post(
    'https://www.virustotal.com/api/v3/urls',
    `url=${encodeURIComponent(url)}`,
    {
      headers: {
        'x-apikey': apiKey,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );

  const analysisId = submitResp.data?.data?.id;
  if (!analysisId) throw new Error('Failed to submit URL to VirusTotal');

  // Wait a bit for analysis to complete (VT scans asynchronously)
  await new Promise((r) => setTimeout(r, 5000)); // 5 seconds (tweak as needed)

  // Fetch analysis results
  const analysisResp = await axios.get(
    `https://www.virustotal.com/api/v3/analyses/${analysisId}`,
    {
      headers: { 'x-apikey': apiKey },
    }
  );

  const stats = analysisResp.data?.data?.attributes?.stats;
  if (stats?.malicious > 0) {
    return { verdict: 'malicious', stats };
  } else {
    return { verdict: 'harmless', stats };
  }
}
