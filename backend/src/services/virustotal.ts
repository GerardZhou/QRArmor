import axios from "axios";

export async function checkUrlWithVirusTotal(url: string) {
  const apiKey = process.env.VIRUSTOTAL_API_KEY;
  if (!apiKey) throw new Error("Missing VIRUSTOTAL_API_KEY");

  // Step 1: Submit the URL for scanning
  const submitResp = await axios.post(
    "https://www.virustotal.com/api/v3/urls",
    `url=${encodeURIComponent(url)}`,
    {
      headers: {
        "x-apikey": apiKey,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

  const analysisId = submitResp.data?.data?.id;
  if (!analysisId) throw new Error("Failed to submit URL to VirusTotal");

  // Step 2: Poll until analysis completes
  let result;
  for (let i = 0; i < 10; i++) { // Try up to ~10 times
    const analysisResp = await axios.get(
      `https://www.virustotal.com/api/v3/analyses/${analysisId}`,
      { headers: { "x-apikey": apiKey } }
    );

    const status = analysisResp.data?.data?.attributes?.status;
    if (status === "completed") {
      result = analysisResp.data?.data?.attributes?.stats;
      break;
    }

    // Wait 3 seconds before checking again
    await new Promise((r) => setTimeout(r, 3000));
  }

  if (!result) {
    return { verdict: "unknown" };
  }

  if (result.malicious > 0) {
    return { verdict: "malicious", stats: result };
  } else {
    return { verdict: "safe", stats: result };
  }
}
