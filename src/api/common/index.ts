import { GET_API } from '@/api/request';

export const getCountries = async () => {
    return await GET_API('/common/countries');
};

export const getStates = async (countryCode: string) => {
    return await GET_API(`/common/countries/${countryCode}/states`);
};
