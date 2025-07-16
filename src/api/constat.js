import {getUserId} from "./user";

export const BASE_URL = "http://localhost:80";
//export const BASE_URL = "http://3.135.224.142";

export const API_ENDPOINTS = {
    LOGOUT: `${BASE_URL}/api/auth/logout`,
};

export function getInitiatePaymentBody(fiatAmount,currency){
    return {
        "userId":getUserId(),
        "amount":fiatAmount * 100, //amount in minor
        "currency": currency
    }
}

export class generateMoonPayUrl {
}