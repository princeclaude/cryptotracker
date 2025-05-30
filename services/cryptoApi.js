import axios from "axios";


const BASE_URL = 'https://api.coingecko.com/api/v3';

export const marketData = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/coins/markets`, {
            headers: {
                'User-Agent': "mycryptotrackerapp/1.0",
            },
            params: {
                vs_currency: 'usd',
                order: 'market_cap_desc',
                per_page: 50,
                page: 1,
                sparkline: false,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching market data", error)
        return [];
    }
};