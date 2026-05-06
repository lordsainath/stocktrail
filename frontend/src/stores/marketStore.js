import { defineStore } from "pinia";
import { ref } from "vue";
import { toast } from "vue-sonner";
import finnhubApi from "../services/finnhubApi";


export const useMarketStore = defineStore("market", () => {
    const marketNews = ref([]);

    const fetchMarketNews = async (category = 'general') => {
        try {
            const response = await finnhubApi.get("/news", { params: { category } });
            marketNews.value = response.data;
        }
        catch (error) {
            toast.error("Failed to fetch market news. Please try again later." , error);
          
        }



    }
    
    return { marketNews, fetchMarketNews }
})


export default useMarketStore;