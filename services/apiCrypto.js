import axios from "axios";


const BASE_URL="https://api.coingecko.com/api/v3/coins/markets";
const BASE_HISTORY ="https://api.coingecko.com/api/v3";
const params = {
    "vs_currency":"eur",
    "order":"market_cap_desc",
    "per_page":250,
    "sparkline":false,
    "page":1
}

const paramHistoric = {
    "vs_currency":"eur",
    "days":7
}

//récuperer les infos des cryptos
export async function getInfos(){
    try{
        const response = await axios(BASE_URL,{params})
        const data = response.data.map((item)=>{
            return {
            "logo":item.image,
            "price":item.current_price,
            "name":item.name,
            "volume":item.total_volume,
            "symbol":item.symbol,
            "id":item.id,
            "percent":item.price_change_percentage_24h,
            
        
        }

        });
        return data;

    }catch(e){
        console.log(e);

    }
}

// récupere l'historique d'une crypto
export async function getHistoric(id){
    try {
        const response = await axios(`${BASE_HISTORY}/coins/${id}/market_chart`,{params:paramHistoric})
        return response.data;

    }catch(e){
        console.log("erreur :",e);
        return;

    }

}

export async function getDetails(id){
try {
    const response = await axios(`${BASE_HISTORY}/coins/${id}`)
    const d = response.data;
    return {
        name: d.name,
        symbol: d.symbol,
        currentPrice: d.market_data.current_price.eur,
        priceChange24h: d.market_data.price_change_percentage_24h,
        volume24h: d.market_data.total_volume.eur,
    };

    }catch(e){
console.log("erreur :",e);
return;

    } 
}


// Récupère et formate les données nécessaires à l'agent IA
export async function getMarketData(id) {
  try {
    const [infos, historic] = await Promise.all([
      axios.get(`${BASE_HISTORY}/coins/${id}`, {
        params: { localization: false, tickers: false, community_data: false, developer_data: false }
      }),
      axios.get(`${BASE_HISTORY}/coins/${id}/market_chart`, { params: paramHistoric })
    ]);

    const data = infos.data;
    const prices = historic.data.prices.map((p) => Number(p[1]));

    return {
      name: data.name,
      symbol: data.symbol,
      currentPrice: data.market_data.current_price.eur,
      priceChange24h: data.market_data.price_change_percentage_24h,
      priceChange7d: data.market_data.price_change_percentage_7d,
      volume24h: data.market_data.total_volume.eur,
      marketCap: data.market_data.market_cap.eur,
      priceHistory7d: prices, // tableau de prix sur 7 jours, pour donner une tendance à l'IA
      high7d: Math.max(...prices),
      low7d: Math.min(...prices),
    };
  } catch (e) {
    console.log("erreur getMarketData :", e);
    return null;
  }
}
