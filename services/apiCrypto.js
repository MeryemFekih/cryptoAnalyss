import axios from "axios";

const BASE_URL = "https://api.coingecko.com/api/v3/coins/markets";
const BASE_HISTORY = "https://api.coingecko.com/api/v3";

const params = {
  vs_currency: "eur",
  order: "market_cap_desc",
  per_page: 250,
  sparkline: false,
  page: 1,
  price_change_percentage: "1h,24h,7d",
};

// ---- Client axios avec retry automatique sur 429 ----
const api = axios.create();

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config;
    if (!config) return Promise.reject(error);

    config.__retryCount = config.__retryCount || 0;
    const isRateLimited = error.response?.status === 429;
    const maxRetries = 3;

    if (isRateLimited && config.__retryCount < maxRetries) {
      config.__retryCount += 1;
      const delay = 1500 * config.__retryCount;
      console.log(`429 reçu, nouvelle tentative dans ${delay}ms (${config.__retryCount}/${maxRetries})`);
      await new Promise((resolve) => setTimeout(resolve, delay));
      return api(config);
    }

    return Promise.reject(error);
  }
);

// ---- Cache mémoire court pour éviter les appels redondants ----
const cache = new Map();
const CACHE_TTL = 30000; // 30 secondes

function getCached(key) {
  const entry = cache.get(key);
  if (entry && Date.now() - entry.time < CACHE_TTL) {
    return entry.data;
  }
  return null;
}

function setCached(key, data) {
  cache.set(key, { data, time: Date.now() });
}

export async function getInfos() {
  try {
    const response = await api(BASE_URL, { params });
    const data = response.data.map((item) => ({
      logo: item.image,
      price: item.current_price,
      name: item.name,
      volume: item.total_volume,
      symbol: item.symbol,
      id: item.id,
      percent: item.price_change_percentage_24h,
      percent1h: item.price_change_percentage_1h_in_currency,
      percent7d: item.price_change_percentage_7d_in_currency,
    }));
    return data;
  } catch (e) {
    console.log("Erreur getInfos :", e.response?.status || e.message);
    return [];
  }
}

export async function getDetails(id) {
  const cacheKey = `details:${id}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  try {
    const response = await api(`${BASE_HISTORY}/coins/${id}`);
    const d = response.data;

    const result = {
      name: d.name,
      symbol: d.symbol,
      currentPrice: d.market_data.current_price.eur,
      priceChange1h: d.market_data.price_change_percentage_1h_in_currency?.eur ?? 0,
      priceChange24h: d.market_data.price_change_percentage_24h ?? 0,
      priceChange7d: d.market_data.price_change_percentage_7d ?? 0,
      volume24h: d.market_data.total_volume.eur ?? 0,
      marketCap: d.market_data.market_cap.eur ?? 0,
    };

    setCached(cacheKey, result);
    return result;
  } catch (e) {
    console.log("Erreur getDetails :", e.response?.status || e.message);
    return null;
  }
}

export async function getHistoric(id, days = 7) {
  const cacheKey = `historic:${id}:${days}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  try {
    const response = await api(`${BASE_HISTORY}/coins/${id}/market_chart`, {
      params: { vs_currency: "eur", days },
    });
    setCached(cacheKey, response.data);
    return response.data;
  } catch (e) {
    console.log("Erreur getHistoric :", e.response?.status || e.message);
    return { prices: [], market_caps: [], total_volumes: [] };
  }
}

export async function getMarketTrends() {
  try {
    const response = await api(`${BASE_HISTORY}/global`);
    const d = response.data.data;
    return {
      totalMarketCap: d.total_market_cap.eur,
      marketCapChange24h: d.market_cap_change_percentage_24h_usd,
      activeCryptocurrencies: d.active_cryptocurrencies,
    };
  } catch (e) {
    console.log("Erreur getMarketTrends :", e.response?.status || e.message);
    return null;
  }
}

// Réutilise le cache de getDetails/getHistoric au lieu de refaire les appels
export async function getMarketData(id) {
  try {
    const [details, historic] = await Promise.all([
      getDetails(id),
      getHistoric(id, 7),
    ]);

    if (!details) return null;

    const prices = (historic?.prices || []).map((p) => Number(p[1]));

    return {
      ...details,
      priceHistory7d: prices,
      high7d: prices.length > 0 ? Math.max(...prices) : null,
      low7d: prices.length > 0 ? Math.min(...prices) : null,
    };
  } catch (e) {
    console.log("Erreur getMarketData :", e.response?.status || e.message);
    return null;
  }
}