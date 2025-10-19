import { Router } from "express";
import { checkUrlWithVirusTotal } from "../services/virustotal";
import { summarizeWithGemini } from "../services/gemini";

const router = Router();

router.post("/", async (req, res) => {
  const { url } = req.body;
  if (!url || typeof url !== "string") {
    return res.status(400).json({ status: "error", message: "Invalid URL" });
  }

  try {
    const normalized = url.trim();

    // Step 1: Check with VirusTotal
    const vt = await checkUrlWithVirusTotal(normalized);

    if (vt.verdict === "malicious") {
      console.log("Blocked malicious URL:", normalized);
      return res.json({ status: "malicious", link: normalized });
    }

    // Step 2: Summarize only safe URLs
    const summary = await summarizeWithGemini(normalized);
    console.log(summary);
    console.log("safe URL:");
    return res.json({ status: "safe", link: normalized });
  } catch (err: any) {
    console.error(err);
    return res
      .status(500)
      .json({ status: "error", message: err.message || "internal error" });
  }
});

export default router;
