import axios from "axios";

const BASE_URL = "https://api.coingecko.com/api/v3/coins/markets";
const BASE_HISTORY = "https://api.coingecko.com/api/v3";

const params = {
  vs_currency: "eur",
  order: "market_cap_desc",
  per_page: 250,
  sparkline: false,
  page: 1,
  price_change_percentage: "1h,24h,7d"
};

export async function getInfos() {
  try {
    const response = await axios(BASE_URL, { params });
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
    console.log(e);
  }
}

export async function getDetails(id) {
  try {
    const response = await axios(`${BASE_HISTORY}/coins/${id}`);
    const d = response.data;
    return {
      name: d.name,
      symbol: d.symbol,
      currentPrice: d.market_data.current_price.eur,
      priceChange24h: d.market_data.price_change_percentage_24h,
      volume24h: d.market_data.total_volume.eur,
    };
  } catch (e) {
    console.log("erreur :", e);
    return;
  }
}

export async function getHistoric(id, days = 7) {
  try {
    const response = await axios(`${BASE_HISTORY}/coins/${id}/market_chart`, {
      params: { vs_currency: "eur", days },
    });
    return response.data; 
  } catch (e) {
    console.log("erreur :", e);
    return;
  }
}



export async function getMarketTrends() {
    try {
        const response = await axios(`${BASE_HISTORY}/global`)
        const d = response.data.data;
        return {
            totalMarketCap: d.total_market_cap.eur,
            marketCapChange24h: d.market_cap_change_percentage_24h_usd,
            activeCryptocurrencies: d.active_cryptocurrencies,
        };

    } catch (e) {
        console.log("erreur :", e);
        return;
    }
}

export async function getAnalysisData(id) {
  try {
    const [details, historic] = await Promise.all([
      getDetails(id),
      getHistoric(id, 1), 
    ]);
    return { ...details, historic };
  } catch (e) {
    console.log("erreur :", e);
    return;
  }
}