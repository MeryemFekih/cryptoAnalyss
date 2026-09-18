import axios from "axios";

const BASE_URL =
  "https://api.coingecko.com/api/v3/coins/markets";

const BASE_HISTORY =
  "https://api.coingecko.com/api/v3";

const params = {
  vs_currency: "eur",
  order: "market_cap_desc",
  per_page: 250,
  sparkline: false,
  page: 1,
  price_change_percentage: "1h,24h,7d",
};


// ========================================
// PARAMETERS - HISTORIC DATA
// ========================================

const paramHistoric = {
  vs_currency: "eur",
  days: 7,
};


// ========================================
// GET INFOS
// ========================================

export async function getInfos() {
  try {
    const response = await axios(BASE_URL, {
      params,
    });

    const data = response.data.map((item) => ({
      logo: item.image,
      price: item.current_price,
      name: item.name,
      volume: item.total_volume,
      symbol: item.symbol,
      id: item.id,

      percent:
        item.price_change_percentage_24h,

      percent1h:
        item.price_change_percentage_1h_in_currency,

      percent7d:
        item.price_change_percentage_7d_in_currency,
    }));

    return data;
  } catch (e) {
    console.log("Erreur getInfos :", e);
    return [];
  }
}


// ========================================
// GET DETAILS
// ========================================

export async function getDetails(id) {
  try {
    const response = await axios(
      `${BASE_HISTORY}/coins/${id}`
    );

    const d = response.data;

    return {
      name: d.name,
      symbol: d.symbol,

      currentPrice:
        d.market_data.current_price.eur,

      priceChange24h:
        d.market_data.price_change_percentage_24h,

      volume24h:
        d.market_data.total_volume.eur,
    };
  } catch (e) {
    console.log("Erreur getDetails :", e);
    return;
  }
}


// ========================================
// GET HISTORIC
// ========================================

export async function getHistoric(id, days = 7) {
  try {
    const response = await axios(
      `${BASE_HISTORY}/coins/${id}/market_chart`,
      {
        params: {
          vs_currency: "eur",
          days,
        },
      }
    );

    return response.data;
  } catch (e) {
    console.log("Erreur getHistoric :", e);
    return;
  }
}


// ========================================
// GET MARKET TRENDS
// ========================================

export async function getMarketTrends() {
  try {
    const response = await axios(
      `${BASE_HISTORY}/global`
    );

    const d = response.data.data;

    return {
      totalMarketCap:
        d.total_market_cap.eur,

      marketCapChange24h:
        d.market_cap_change_percentage_24h_usd,

      activeCryptocurrencies:
        d.active_cryptocurrencies,
    };
  } catch (e) {
    console.log(
      "Erreur getMarketTrends :",
      e
    );

    return;
  }
}


// ========================================
// GET ANALYSIS DATA
// ========================================

export async function getAnalysisData(id) {
  try {
    const [details, historic] =
      await Promise.all([
        getDetails(id),
        getHistoric(id, 1),
      ]);

    return {
      ...details,
      historic,
    };
  } catch (e) {
    console.log(
      "Erreur getAnalysisData :",
      e
    );

    return;
  }
}


// ========================================
// GET MARKET DATA FOR AI
// ========================================

export async function getMarketData(id) {
  try {
    const [infos, historic] =
      await Promise.all([
        axios.get(
          `${BASE_HISTORY}/coins/${id}`,
          {
            params: {
              localization: false,
              tickers: false,
              community_data: false,
              developer_data: false,
            },
          }
        ),

        axios.get(
          `${BASE_HISTORY}/coins/${id}/market_chart`,
          {
            params: paramHistoric,
          }
        ),
      ]);

    const data = infos.data;

    const prices =
      historic.data.prices.map((p) =>
        Number(p[1])
      );

    return {
      // Basic information
      name: data.name,
      symbol: data.symbol,

      // Current price
      currentPrice:
        data.market_data.current_price.eur,

      // Price changes
      priceChange24h:
        data.market_data
          .price_change_percentage_24h,

      priceChange7d:
        data.market_data
          .price_change_percentage_7d,

      // Volume
      volume24h:
        data.market_data.total_volume.eur,

      // Market cap
      marketCap:
        data.market_data.market_cap.eur,

      // Historical prices
      priceHistory7d: prices,

      // Highest price over 7 days
      high7d:
        prices.length > 0
          ? Math.max(...prices)
          : null,

      // Lowest price over 7 days
      low7d:
        prices.length > 0
          ? Math.min(...prices)
          : null,
    };
  } catch (e) {
    console.log(
      "Erreur getMarketData :",
      e
    );

    return null;
  }
}