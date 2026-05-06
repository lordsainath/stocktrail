import { onMounted } from "vue";
import useMarketStore from "../stores/marketStore";


export function useDashboard() {
    const marketNews = useMarketStore();
    const { marketNews: news } = marketNews;
    const { fetchMarketNews } = marketNews;
    

    const loadDashboardData = async () => {
        await marketNews.fetchMarketNews();
    }

    onMounted(loadDashboardData)

    return { loadDashboardData, news }
}