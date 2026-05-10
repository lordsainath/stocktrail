import { onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import useMarketStore from '@stores/marketStore';

export function useDashboard() {
  const marketStore = useMarketStore();
  const { marketNews: news } = storeToRefs(marketStore);
  const { fetchMarketNews } = marketStore;

  const loadDashboardData = async () => {
    await fetchMarketNews();
  };

  onMounted(loadDashboardData);

  return { loadDashboardData, news };
}
