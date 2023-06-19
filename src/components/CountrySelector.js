import React, { useEffect, useState } from 'react';
import api from '../services/api';

function CountrySelector({ onCountrySelect }) {
    const [countries, setCountries] = useState([]);

    useEffect(() => {
        api.get('/countries')
            .then(response => setCountries(response.data))
            .catch(err => console.error(err));
    }, []);

    return (
        <select onChange={(event) => {
            const selectedCountry = countries.find(country => country.id === event.target.value);
            onCountrySelect(selectedCountry);
        }}>
            {countries.map(country => (
                <option key={country.id} value={country.id}>{country.name}</option>
            ))}
        </select>

    );
}

export default CountrySelector;
