// ============================================
// IMPORTS
// ============================================


import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import { toast } from 'vue-sonner';

import { finnhubApi } from '@stores/httpClients';

import { getErrorMessage } from '@composables/useErrorMessage';
import { generateMockCandleData } from '@/composables/generateMockCandleData';
import router from '@/router';

export const useMarketStore = defineStore('market', () => {

  // State Initialization
  const marketNews = ref([]);
  const dashboardCompanies = ref([]);
  const quote = ref(null);
  const profile = ref(null);
  const companyNews = ref([]);
  const chartData = ref(null);
  const candleData = ref(null);
  const loading = ref(false);
  const dashboardLoading = ref(false);

  // Constant list of popular stocks for dashboard
  const dashboardUniverse = [
    {
      symbol: 'AAPL',
      name: 'Apple Inc.',
    },
    {
      symbol: 'MSFT',
      name: 'Microsoft Corp.',
    },
    {
      symbol: 'GOOGL',
      name: 'Alphabet Inc.',
    },
    {
      symbol: 'AMZN',
      name: 'Amazon.com Inc.',
    },
    {
      symbol: 'TSLA',
      name: 'Tesla Inc.',
    },
    {
      symbol: 'NVDA',
      name: 'NVIDIA Corp.',
    },
    {
      symbol: 'META',
      name: 'Meta Platforms Inc.',
    },
    {
      symbol: 'NFLX',
      name: 'Netflix Inc.',
    },
  ];

  // Computed property to combine quote, profile, and news for the selected company
  const selectedCompany = computed(() => ({
    quote: quote.value,
    profile: profile.value,
    news: companyNews.value,
  }));

  // =========================
  // CHART SERIES
  // ApexCharts compatible
  // =========================
  const chartSeries = computed(() => {
    if (!chartData.value) return [];

    return [
      {
        name: 'Price',

        data: chartData.value.c,
      },
    ];
  });

  // =========================
  // X-AXIS CATEGORIES
  // Time labels
  // =========================
  const chartCategories = computed(() => {
    if (!chartData.value) return [];

    return chartData.value.t.map((timestamp) => {
      return new Date(timestamp).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      });
    });
  });

  const formatMarketCap = (value) => {
    if (!value) return '-';

    if (value >= 1_000_000) {
      return `${(value / 1_000_000).toFixed(2)}T`;
    }

    if (value >= 1_000) {
      return `${(value / 1_000).toFixed(2)}B`;
    }

    return value;
  };

  const requestQuote = async (symbol) => {
    const response = await finnhubApi.get('/quote', {
      params: { symbol },
    });

    return response.data || null;
  };

  const getQuoteData = async (symbol) => {
    try {
      return await requestQuote(symbol);
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to fetch quote'));

      return null;
    }
  };

  const buildDashboardChart = (quoteData) => {
    if (!quoteData) {
      return {
        series: [],
        categories: [],
      };
    }

    const mockData = generateMockCandleData(quoteData, 16);

    return {
      series: [
        {
          name: 'Price',
          data: mockData.c,
        },
      ],
      categories: mockData.t.map((timestamp) => {
        return new Date(timestamp).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        });
      }),
    };
  };

  const fetchMarketNews = async (category = 'general') => {
    try {
      const response = await finnhubApi.get('/news', {
        params: { category },
      });

      marketNews.value = response.data || [];

      return marketNews.value;
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to fetch market news'));

      marketNews.value = [];

      return [];
    }
  };

  const fetchQuote = async (symbol) => {
    try {
      quote.value = await requestQuote(symbol);

      return quote.value;
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to fetch quote'));

      quote.value = null;

      return null;
    }
  };

  const fetchDashboardCompanies = async () => {
    dashboardLoading.value = true;

    try {
      const companies = await Promise.all(
        dashboardUniverse.map(async (company) => {
          const quoteData = await requestQuote(company.symbol);
          const chart = buildDashboardChart(quoteData);

          return {
            ...company,
            quote: quoteData,
            price: quoteData?.c ?? null,
            change: quoteData?.d ?? null,
            changePercent: quoteData?.dp ?? null,
            chartSeries: chart.series,
            chartCategories: chart.categories,
          };
        })
      );

      dashboardCompanies.value = companies.filter((company) => company.quote);

      return dashboardCompanies.value;
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to load dashboard companies'));

      dashboardCompanies.value = [];

      return [];
    } finally {
      dashboardLoading.value = false;
    }
  };

  const fetchProfile = async (symbol) => {
    try {
      const response = await finnhubApi.get('/stock/profile2', {
        params: { symbol },
      });

      profile.value = response.data || null;

      return profile.value;
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to fetch company profile'));

      profile.value = null;

      router.push('/');

      return null;
    }
  };

  const fetchCompanyNews = async (symbol, from, to) => {
    try {
      const response = await finnhubApi.get('/company-news', {
        params: {
          symbol,
          from,
          to,
        },
      });

      companyNews.value = response.data || [];

      return companyNews.value;
    } catch (error) {
      router.push('/');
      // toast.error(getErrorMessage(error, 'Failed to fetch company news'));

      companyNews.value = [];

      return [];
    }
  };



  const getHistoricalData = async (symbol, resolution, from, to) => {
    void symbol;
    void resolution;
    void from;
    void to;

    try {
      if (!quote.value) {
        throw new Error('Quote data not found');
      }

      const mockData = generateMockCandleData(quote.value);

      chartData.value = mockData;
      candleData.value = mockData;

      console.log('Using mock candle data');

      return mockData;
    } catch (e) {
      console.log(e);

      toast.error('Failed to load historical data from page');

      chartData.value = null;
      candleData.value = null;

      return null;
    }
  };


  // Search for symbols based on user query
  const searchSymbols = async (query) => {
    try {
      if (!query?.trim()) {
        return [];
      }

      const response = await finnhubApi.get('/search', {
        params: {
          q: query,
        },
      });

      return response.data.result || [];
    } catch (error) {
      console.log(error);
      toast.error(getErrorMessage(error, 'Failed to search symbols'));

      return [];
    }
  };


  // Fetch all company details (quote, profile, news) for a given symbol

  const fetchCompanyDetails = async (symbol) => {
    loading.value = true;

    try {
      const to = Math.floor(Date.now() / 1000);

      const from = to - 30 * 24 * 60 * 60;

      await fetchQuote(symbol);

      await Promise.all([
        fetchProfile(symbol),

        fetchCompanyNews(
          symbol,
          new Date(from * 1000).toISOString().split('T')[0],

          new Date(to * 1000).toISOString().split('T')[0]
        ),

        getHistoricalData(symbol, '15', from, to),
      ]);
    } finally {
      loading.value = false;
    }
  };

  return {
    marketNews,

    dashboardCompanies,

    quote,
    profile,
    companyNews,

    selectedCompany,

    chartData,
    candleData,

    chartSeries,
    chartCategories,

    loading,
    dashboardLoading,

    formatMarketCap,

    fetchMarketNews,
    fetchQuote,
    getQuoteData,
    fetchProfile,
    fetchCompanyNews,
    fetchCompanyDetails,
    fetchDashboardCompanies,
    getHistoricalData,
    searchSymbols,
  };
});

export default useMarketStore;
