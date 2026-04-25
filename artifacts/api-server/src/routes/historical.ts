import { Router } from "express";
import { getIndicators } from "../lib/historical.js";

const router = Router();

router.get("/historical/indicators", async (req, res) => {
  const { instrument } = req.query;
  if (!instrument || typeof instrument !== "string") {
    return res.status(400).json({ error: "Parameter instrument wajib diisi" });
  }
  try {
    const indicators = await getIndicators(instrument);
    if (!indicators) {
      return res.status(404).json({ error: "Data historis tidak tersedia untuk instrumen ini" });
    }
    return res.json({ status: "success", indicators });
  } catch (err: any) {
    return res.status(502).json({ error: "Gagal mengambil data historis", detail: err.message });
  }
});

export default router;
