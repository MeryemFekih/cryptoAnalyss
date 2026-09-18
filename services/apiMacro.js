import axios from "axios";
import { EIA_API_KEY } from "@env";

const OIL_URL = "https://api.eia.gov/v2/petroleum/pri/spt/data/";
const GOLD_URL = "https://api.gold-api.com/price/XAU";

// Récupère le dernier prix du pétrole brut (WTI, quotidien) via l'API EIA
export async function getOilPrice() {
  try {
    const response = await axios.get(OIL_URL, {
      params: {
        api_key: EIA_API_KEY,
        frequency: "daily",
        "data[0]": "value",
        "facets[series][]": "RWTC",
        "sort[0][column]": "period",
        "sort[0][direction]": "desc",
        offset: 0,
        length: 1,
      },
    });
    const latest = response.data.response.data[0];
    return {
      price: Number(latest.value),
      unit: latest.units,
      period: latest.period,
    };
  } catch (e) {
    console.log("erreur getOilPrice :", e);
    return null;
  }
}

// Récupère le prix actuel de l'or
export async function getGoldPrice() {
  try {
    const response = await axios.get(GOLD_URL);
    return {
      price: response.data.price,
      unit: "$/oz",
    };
  } catch (e) {
    console.log("erreur getGoldPrice :", e);
    return null;
  }
}

// Combine les deux pour donner à l'IA
export async function getMacroContext() {
  try {
    const [oil, gold] = await Promise.all([getOilPrice(), getGoldPrice()]);
    return { oil, gold };
  } catch (e) {
    console.log("erreur getMacroContext :", e);
    return null;
  }
}