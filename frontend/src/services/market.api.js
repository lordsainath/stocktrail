import finnhubApi from "./finnhubApi";

const getMarketNews = async (category = "general") => {
  try {
    const response = await finnhubApi.get("/news", {
      params: { category },
    });

    const data = response.data;

    console.log(data);

    return data;
  } catch (error) {
    console.error("Error fetching market news:", error);
    return [];
  }
};

const getQuote = async (symbol) => {
  try {
    const response = await finnhubApi.get("/quote", {
      params: { symbol },
    });

    const data = response.data;
   


    return data;
  } catch (error) {
    console.error("Error fetching quote:", error);
    return null;
  }
};

const getProfile = async (symbol) => {

  try {
    const response = await finnhubApi.get("/stock/profile2", {
      params: { symbol },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching profile:", error);
    return null;
  }
};

const getCompanyNews = async (symbol, from, to) => {
  try {


    const response =await finnhubApi.get('/company-news', { params: { symbol, from, to } });
    
    return response.data;
  } catch (error) {
    console.error("Error fetching company news:", error);
    return [];
  } finally {

  }
}

export { getMarketNews, getQuote, getProfile, getCompanyNews };