import { asyncHandler } from "../utils/asyncHandler.js";
import {
    getCountriesService,
    getStatesService,
    getCitiesService,
} from "../services/location.service.js";

export const getCountries = asyncHandler(async (req, res) => {
    const countries = getCountriesService();

    res.status(200).json({
        success: true,
        data: countries,
    });
});

export const getStates = asyncHandler(async (req, res) => {
    const { countryCode } = req.query;
    const states = getStatesService(countryCode);

    res.status(200).json({
        success: true,
        data: states,
    });
});

export const getCities = asyncHandler(async (req, res) => {
    const { countryCode, stateCode } = req.query;
    const cities = getCitiesService(countryCode, stateCode);

    res.status(200).json({
        success: true,
        data: cities,
    });
});
