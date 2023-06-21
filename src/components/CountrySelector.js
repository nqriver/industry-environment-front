import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Form } from 'react-bootstrap'; // importuj Bootstrap Form

function CountrySelector({ onCountrySelect }) {
    const [countries, setCountries] = useState([]);

    useEffect(() => {
        api.get('/countries')
            .then(response => setCountries(response.data))
            .catch(err => console.error(err));
    }, []);

    return (
        <Form.Group controlId="countrySelect">
            <Form.Label>Wybierz kraj</Form.Label>
            <Form.Control as="select" onChange={(event) => {
                const selectedCountry = countries.find(country => country.id === event.target.value);
                onCountrySelect(selectedCountry);
            }}>
                {countries.map(country => (
                    <option key={country.id} value={country.id}>{country.name}</option>
                ))}
            </Form.Control>
        </Form.Group>
    );}

export default CountrySelector;
