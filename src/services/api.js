import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080',
    headers: {'Content-Type': 'application/json'}
});

// Mapa kodów błędów
const errorCodes = {
    "BMS01": "Zewnętrzna usługa internetowa odpowiedziała kodem 4xx",
    "BMS02": "Zewnętrzna usługa internetowa odpowiedziała kodem 5xx",
    "BMS03": "Zakres dat może rozpoczynać się od 1940 roku, a data początkowa powinna być wcześniejsza niż data końcowa",
    "BMS04": "Nie można znaleźć kraju",
    "BMS05": "Nie można znaleźć centrum przemysłu",
    "BSM06": "Usługa API pogodowego zwróciła niespójną liczbę pomiarów minimalnej i maksymalnej temperatury",
    "BSM07": "Kombinacja atrybutów tego zestawu danych jest nieznana/niedozwolona",
    "BMS08": "Użytkownik z wybranym adresem email już istnieje",
    "BMS09": "Użytkownik z wybranym loginem już istnieje",
    "BMS10": "Nie można znaleźć użytkownika"
};

api.interceptors.request.use((config) => {
    if (config.url !== '/users/login' && config.url !== 'users/register') { // dodaj token tylko gdy to nie jest żądanie logowania
        const token = localStorage.getItem('jwt');
        config.headers.Authorization = token ? `Bearer ${token}` : '';
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response.status >= 500) {
            return Promise.reject("Problem z połączeniem z serwerem");
        }
        if (error.response.status === 401) {
            if (localStorage.getItem('jwt')) {
                localStorage.removeItem('jwt');
            }
            return Promise.reject('Niepoprawne dane uwierzytelniające');
        }
        if (error.response.data && error.response.data.code) {
            return Promise.reject(errorCodes[error.response.data.code] || error.response.data.message);
        }
        return Promise.reject(`Wystąpił niezidentyfikowany błąd. Status: ${error.response.status}`);
    }
);

export default api;
