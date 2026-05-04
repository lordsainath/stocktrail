import { locationData } from "../data/location.data.js";
import { ValidationError } from "../utils/appError.js";

const getCountryRecord = (countryCodeOrName) => {
    if (!countryCodeOrName) {
        throw new ValidationError("countryCode is required");
    }

    const normalized = String(countryCodeOrName).trim();

    if (locationData[normalized]) {
        return { code: normalized, record: locationData[normalized] };
    }

    const matchedEntry = Object.entries(locationData).find(([, country]) => {
        return country.name.toLowerCase() === normalized.toLowerCase();
    });

    if (!matchedEntry) {
        throw new ValidationError("Country not found");
    }

    return { code: matchedEntry[0], record: matchedEntry[1] };
};

const getStateRecord = (countryRecord, stateCodeOrName) => {
    if (!stateCodeOrName) {
        throw new ValidationError("stateCode is required");
    }

    const normalized = String(stateCodeOrName).trim();

    if (countryRecord.states[normalized]) {
        return { code: normalized, record: countryRecord.states[normalized] };
    }

    const matchedEntry = Object.entries(countryRecord.states).find(([, state]) => {
        return state.name.toLowerCase() === normalized.toLowerCase();
    });

    if (!matchedEntry) {
        throw new ValidationError("State not found for selected country");
    }

    return { code: matchedEntry[0], record: matchedEntry[1] };
};

export const getCountriesService = () => {
    return Object.entries(locationData).map(([code, country]) => ({
        code,
        name: country.name,
    }));
};

export const getStatesService = (countryCodeOrName) => {
    const { record } = getCountryRecord(countryCodeOrName);

    return Object.entries(record.states).map(([code, state]) => ({
        code,
        name: state.name,
    }));
};

export const getCitiesService = (countryCodeOrName, stateCodeOrName) => {
    const { record: countryRecord } = getCountryRecord(countryCodeOrName);
    const { record: stateRecord } = getStateRecord(countryRecord, stateCodeOrName);

    return stateRecord.cities.map((city) => ({ name: city }));
};
