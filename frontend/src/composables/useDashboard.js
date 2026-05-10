import { onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import useMarketStore from '@stores/marketStore';

export function useDashboard() {
  const marketStore = useMarketStore();
  const {
    marketNews: news,
    dashboardCompanies: companies,
    dashboardLoading,
  } = storeToRefs(marketStore);
  const { fetchMarketNews, fetchDashboardCompanies } = marketStore;

  const loadDashboardData = async () => {
    await Promise.all([
      fetchDashboardCompanies(),
      fetchMarketNews(),
    ]);
  };

  onMounted(loadDashboardData);

  return { loadDashboardData, news, companies, dashboardLoading };
}
